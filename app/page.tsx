/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Field, FieldContent } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { safeParseAIResponse, ai } from "@/lib/gemini-utils";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  const [parsedResponses, setParsedResponses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const instructions = `
    Você é a Planedu, uma IA especialista em criar planos de aula. 
    Responda **apenas em JSON válido**, sem comentários, sem explicações fora do JSON.

    O formato da resposta deve ser:

      {
        "titulo": "Título da aula",
        "introducao": "Introdução lúdica e envolvente",
        "objetivo_bncc": "Objetivo alinhado à BNCC",
        "roteiro": "Passo a passo detalhado da atividade",
        "rubrica_avaliacao": "Critérios de avaliação com níveis: Excelente, Bom, Satisfatório e Precisa de Apoio"
      }

      Não use markdown, blocos de código, nem caracteres a fim de adicionar "Negrito" ou "Itálico", nem texto fora do JSON.
  `;

  const ai_settings = {
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
      },
    ],
    config: {
      systemInstruction: instructions,
    },
  };

  async function generateResponse(userMessage: string, messageIndex: number) {
    setIsLoading(true);
    try {
      const res = await ai.models.generateContent({
        ...ai_settings,
        contents: [{ parts: [{ text: userMessage }] }],
      });

      const aiResponse = res.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      const parsed = safeParseAIResponse(aiResponse);

      setResponses((prev) => {
        const updated = [...prev];
        updated[messageIndex] = aiResponse;
        return updated;
      });

      setParsedResponses((prev) => {
        const updated = [...prev];
        updated[messageIndex] = parsed;
        return updated;
      });

      if (parsed) {
        await salvarPlanoDeAula({
          entrada_user: { prompt: message },
          resposta_ia: parsed,
          titulo: parsed.titulo || null,
          introducao: parsed.introducao || null,
          objetivo_bncc: parsed.objetivo_bncc || null,
          roteiro: parsed.roteiro || null,
          rubrica_avaliacao: parsed.rubrica_avaliacao || null,
        });
      }
    } catch (error) {
      console.error("Error ao gerar resposta:", error);
      setResponses((prev) => {
        const updated = [...prev];
        updated[messageIndex] =
          "Desculpe, ocorreu um erro ao gerar a resposta.";
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function salvarPlanoDeAula(planoDeAula: {
    entrada_user: any;
    resposta_ia: any;
    titulo: string;
    introducao: string;
    objetivo_bncc: string;
    roteiro: string;
    rubrica_avaliacao: string;
  }) {
    try {
      const { data, error } = await supabase
        .from("PlanoDeAula")
        .insert([planoDeAula])
        .select();

      if (error) throw error;

      // Para fins de depuração
      // TODO: Remover este console.log
      console.log("Plano salvo com sucesso:", data);
      return data;
    } catch (err) {
      console.error("Erro a o salvar plano", err);
      return null;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const currentMessageIndex = messages.length;
    setMessages((prev) => [...prev, message]);
    setMessage("");

    setResponses((prev) => [...prev, ""]);
    setParsedResponses((prev) => [...prev, null]);

    await generateResponse(message, currentMessageIndex);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Planedu
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 pb-8">
        {/* Message Area */}
        <div className="flex-1 overflow-y-auto py-8 space-y-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-medium text-gray-900 dark:text-white">
                  Como podemos te ajudar hoje?
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Comece a planejar suas aulas hoje com o Planedu
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-blue-500 text-white rounded-2xl px-4 py-3 shadow max-w-[80%]">
                    <p className="text-sm whitespace-pre-wrap">{msg}</p>
                  </div>
                </div>

                {/* AI Response */}
                {responses[idx] && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl px-4 py-3 shadow max-w-[80%] space-y-2">
                      {parsedResponses[idx] ? (
                        Object.entries(parsedResponses[idx])
                          .filter(
                            ([key]) =>
                              !["id_plano_aula", "criado_em"].includes(key)
                          )
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="border-l-2 border-gray-300 dark:border-gray-700 pl-3"
                            >
                              <p className="font-semibold capitalize text-sm mb-1 text-blue-600 dark:text-blue-400">
                                {key.replace(/_/g, " ")}
                              </p>
                              {key === "rubrica_avaliacao" ? (
                                (() => {
                                  try {
                                    const rubrica = JSON.parse(
                                      value as string
                                    ) as Record<
                                      string,
                                      string | Record<string, string>
                                    >;
                                    return (
                                      <div className="pl-3 space-y-2 border-l-2 border-gray-300 dark:border-gray-700">
                                        {Object.entries(rubrica).map(
                                          ([criterio, detalhes]) => (
                                            <div key={criterio}>
                                              <p className="font-medium text-blue-500 dark:text-blue-400">
                                                {criterio}
                                              </p>
                                              {typeof detalhes === "object" &&
                                              detalhes !== null ? (
                                                <ul className="list-disc pl-4">
                                                  {Object.entries(
                                                    detalhes as Record<
                                                      string,
                                                      string
                                                    >
                                                  ).map(
                                                    ([nivel, descricao]) => (
                                                      <li
                                                        key={nivel}
                                                        className="text-sm"
                                                      >
                                                        <strong>
                                                          {nivel}:
                                                        </strong>{" "}
                                                        {String(descricao)}
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              ) : (
                                                <p className="text-sm">
                                                  {String(detalhes)}
                                                </p>
                                              )}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    );
                                  } catch {
                                    return (
                                      <p className="text-sm">{String(value)}</p>
                                    );
                                  }
                                })()
                              ) : typeof value === "object" &&
                                value !== null ? (
                                <div className="space-y-1">
                                  {Object.entries(value).map(
                                    ([subKey, subValue]) => (
                                      <p key={subKey} className="text-sm">
                                        <span className="font-medium">
                                          {subKey}:
                                        </span>{" "}
                                        {String(subValue)}
                                      </p>
                                    )
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm">{String(value)}</p>
                              )}
                            </div>
                          ))
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">
                          {responses[idx]}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 max-w-[80%] shadow">
                <div className="flex items-center gap-2">
                  {[0, 150, 300].map((delay) => (
                    <div
                      key={delay}
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Form */}
        <div className="sticky bottom-0 pt-4 bg-white dark:bg-black">
          <form onSubmit={handleSubmit} className="relative">
            <Field>
              <FieldContent>
                <div className="relative flex items-end gap-2">
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Gere um plano de aula para..."
                    rows={1}
                    className="resize-none overflow-hidden py-1.5 pr-12"
                    style={{
                      height: "fit-content",
                      minHeight: "52px",
                      maxHeight: "300px",
                    }}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute z-10 bottom-2 right-2 h-8 w-8 p-0 rounded-full"
                    disabled={!message.trim() || isLoading}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-white"
                    >
                      <path
                        d="M.5 1.163A1 1 0 011.97.28l12.868 6.837a1 1 0 010 1.766L1.969 15.72A1 1 0 01.5 14.836V10.33a1 1 0 01.816-.983L8.5 8 1.316 6.653A1 1 0 01.5 5.67V1.163z"
                        fill="currentColor"
                      />
                    </svg>
                  </Button>
                </div>
              </FieldContent>
            </Field>
          </form>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            AI pode cometer erros. Verifique as informações sempre.
          </p>
        </div>
      </main>
    </div>
  );
}
