import TRPCProviders from "@/components/providers/Providers";
import { ThemeProvider } from "@/components/ui/theme-provider";
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Handout",
  description: "Elevate teaching with Studio.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCProviders>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="w-full h-full">{children}</div>
      </ThemeProvider>
    </TRPCProviders>
  );
}
