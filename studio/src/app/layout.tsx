import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { ModeToggle } from "@/components/ModeToggle";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Studio",
  description: "Elevate teaching with Studio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={rubik.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ModeToggle />

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
