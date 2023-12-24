import TRPCProviders from "@/components/providers/Providers";
import SessionProvider from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import "../globals.css";
import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";

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
    <TRPCProviders>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SessionProvider session={session}>
          <EdgeStoreProvider>
            <Navbar />
            <div className="flex flex-row h-full">
              <Sidebar />
              {children}
            </div>
          </EdgeStoreProvider>
        </SessionProvider>
      </ThemeProvider>
    </TRPCProviders>
  );
}
