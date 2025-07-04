"use client";
import { useChat } from "@ai-sdk/react";
import { Attachment } from "ai";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Messages } from "./messages";
import { MultimodalInput } from "./input";

export function Chat({
  id: formId,
}: {
  id: string;
}) {
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
  } = useChat({
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    body: {
      formId,
    },
    onError: () => {
      toast.error("An error occured, please try again!");
    },
  });

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  // Prefill the chat input with the prompt stored in sessionStorage for this form
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedPrompt = sessionStorage.getItem(`newFormPrompt-${formId}`);
      if (storedPrompt) {
        // Remove it immediately so it's not reused unintentionally
        sessionStorage.removeItem(`newFormPrompt-${formId}`);

        // Send it as the very first user message
        append({ role: "user", content: storedPrompt });
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId, append]);

  return (
    <div className="w-full h-full flex flex-col gap-4 ">
      <div className="flex-1 overflow-y-auto">
        <Messages
          status={status}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={false}
        />
      </div>

      <form className="bg-background mx-auto flex w-full gap-2 px-4 pb-4 md:max-w-3xl md:pb-6">
        <MultimodalInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          status={status}
          stop={stop}
          attachments={attachments}
          setAttachments={setAttachments}
          messages={messages}
          setMessages={setMessages}
          append={append}
        />
      </form>
    </div>
  );
}
