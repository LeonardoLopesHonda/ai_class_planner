"use client";

import { useState } from "react";
import { Field, FieldContent } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setMessages([...messages, message]);
    setMessage("");
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
              <div key={idx} className="flex flex-col gap-2">
                <div className="bg-blue-500 text-white rounded-lg px-4 py-3 self-end max-w-[85%]">
                  <p className="text-sm">{msg}</p>
                </div>
              </div>
            ))
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
                    disabled={!message.trim()}
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
