import { ThemeProvider } from "@/components/ui/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { getServerSession } from "next-auth";
import TRPCProviders from "@/components/providers/Providers";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Studio",
  description: "Elevate teaching with Studio.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  // TODO: Add logo and finalize this layout for not-found page
  return (
    <html lang="en">
      <body
        className={cn("min-h-screen font-sans antialiased", rubik.className)}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCProviders>
            <SessionProvider session={session}>{children}</SessionProvider>
          </TRPCProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
