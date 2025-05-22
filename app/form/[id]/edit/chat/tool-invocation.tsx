import React from "react";
import { type ToolInvocation } from "ai";
import { cn } from "@/lib/utils";

export function ToolInvocationDisplay({ toolInvocation }: { toolInvocation: ToolInvocation }) {
  const { toolName, args, state } = toolInvocation;
  let resultDisplay = null;

  if (state === "result" && "result" in toolInvocation) {
    resultDisplay = <p>Result: {JSON.stringify(toolInvocation.result)}</p>;
  }

  return (
    <div
      className={cn("rounded-xl px-3 py-2", {
        "bg-muted text-muted-foreground": state === "call",
        "bg-primary text-primary-foreground": state === "result",
      })}
    >
      <p className="font-semibold">Tool Call: {toolName}</p>
      {args && <p>Arguments: {JSON.stringify(args)}</p>}
      {resultDisplay}
      {state === "call" && <p>Status: Calling tool...</p>}
    </div>
  );
}
