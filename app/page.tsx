"use client";

import { useState } from "react";
import { Field, FieldContent } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GoogleGenAI } from "@google/genai";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // apiKey is defined in .env
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

  async function generateResponse(userMessage: string, messageIndex: number) {
    setIsLoading(true);
    try {
      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
        config: {
          systemInstruction: `
            Inclua no planejamento: 
              1) Introdução lúdica — uma abertura criativa e envolvente com história ou desafio; 
              2) Objetivo de aprendizagem da BNCC — descreve o que o aluno deve saber ou fazer; 
              3) Passo a passo — roteiro detalhado e temporizado da atividade; 
              4) Rubrica de avaliação — critérios claros de desempenho com níveis como Excelente, Bom, Satisfatório e Precisa de Apoio.
          `
        }
      });

      const aiResponse = res.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      // Update the specific response at the correct index
      setResponses((prev) => {
        const newResponses = [...prev];
        newResponses[messageIndex] = aiResponse;
        return newResponses;
      });
    } catch (error) {
      console.error("Error generating response:", error);
      setResponses((prev) => {
        const newResponses = [...prev];
        newResponses[messageIndex] = "Desculpe, ocorreu um erro ao gerar a resposta.";
        return newResponses;
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    const currentMessageIndex = messages.length;
    setMessages([...messages, message]);
    setMessage("");
    
    // Add placeholder for response
    setResponses([...responses, ""]);

    // Generate response
    await generateResponse(message, currentMessageIndex);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            AI Class Planner
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 pb-8">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto py-8 space-y-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-medium text-gray-900 dark:text-white">
                  Como podemos te ajudar hoje?
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Comece a planejar suas aulas hoje com o AI Planner
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-blue-500 text-white rounded-lg px-4 py-3 max-w-[85%]">
                    <p className="text-sm whitespace-pre-wrap">{msg}</p>
                  </div>
                </div>
                {/* AI Response */}
                {responses[idx] && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 max-w-[85%]">
                      <p className="text-sm whitespace-pre-wrap">{responses[idx]}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 max-w-[85%]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
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
                    className="absolute bottom-2 right-2 h-8 w-8 p-0 rounded-full"
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
