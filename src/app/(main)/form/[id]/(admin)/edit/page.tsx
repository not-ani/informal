"use client";
import React from "react";
import { Form } from "./form";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useParams } from "next/navigation";
import { Chat } from "./_chat";

export default function Page() {
  const { id } = useParams<{ id: string }>();

  return (
    <main className="h-screen overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={60}
          minSize={30}
          maxSize={75}
          className="bg-background flex flex-col gap-10 pt-10 items-center lg:min-w-2/3 h-screen overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent "
        >
          <div className="overflow-y-scroll w-full items-center flex flex-col gap-10 pt-10">
            <Form id={id} />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="overflow-y-scroll w-full h-full items-center flex flex-col gap-10 pt-10">
          <div className="overflow-y-scroll w-full h-full items-center flex flex-col gap-10 pt-10">
            <Chat id={id} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
