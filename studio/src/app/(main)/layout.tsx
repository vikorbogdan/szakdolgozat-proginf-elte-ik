import { ThemeProvider } from "@/components/ui/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "../globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { getServerSession } from "next-auth";
import Sidebar from "./_components/Sidebar";
import Navbar from "./_components/Navbar";
import { redirect } from "next/navigation";

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
  if (!session || !session.user) {
    redirect("/");
  }

  return (
    <html lang="en">
      <body
        className={cn(
          "h-2 flex-col flex antialiased bg-primary-foreground",
          rubik.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <Navbar />
            <div className="flex flex-row h-full">
              <Sidebar />
              {children}
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
