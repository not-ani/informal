"use client";
import React from "react";
import { Form } from "./form";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useParams } from "next/navigation";
import { Chat } from "./chat";
export default function Page() {
  const { id } = useParams<{ id: string }>();

  return (
    <main className="">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={60}
          minSize={30}
          maxSize={75}
          className="bg-muted flex flex-col gap-10 h-screen pt-10 items-center lg:min-w-2/3 overflow-y-auto h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent "
        >
          <Form id={id} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <Chat id={id} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
