import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme";

import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "./providers/clerk";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
  title: "Informal",
  description:
    "Informal is an AI-native survey builder that helps you create surveys faster and smarter.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <ClerkProvider
          >
            <ConvexClientProvider>
              <NuqsAdapter>{children}</NuqsAdapter>
            </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
