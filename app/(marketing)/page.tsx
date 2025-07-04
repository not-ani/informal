import { Hero } from "@/components/hero";
import React from "react";

export default function Page() {
  return (
    <div className="mx-auto w-full">
      <div className="py-20 sm:py-28 md:py-32 lg:py-40 min-h-[calc(100vh-8rem)]">
        <main className="flex flex-col gap-8 md:gap-12 w-full items-center justify-center">
          <Hero />
        </main>
      </div>
    </div>
  );
}
