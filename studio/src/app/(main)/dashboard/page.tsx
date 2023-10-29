"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Library, TextQuote, Users2 } from "lucide-react";
import { useSession } from "next-auth/react";
import CardWithButton from "../_components/CardWithButton";

const Dashboard = () => {
  const { data: session } = useSession();
  return (
    <div className="flex p-4 md:p-16 gap-16 bg-primary-foreground min-h-screen h-full w-full flex-col">
      <h1 className="text-5xl font-semibold">
        Welcome to your Dashboard, {session?.user?.name}!
      </h1>
      <main>
        <div className="flex flex-wrap items-center justify-center gap-8">
          <CardWithButton
            hoverAnimation
            className="w-full text-white md:w-96 bg-gradient-to-t from-orange-400 to-yellow-400"
            buttonClassName="w-40 text-black bg-yellow-200 hover:bg-yellow-300"
            Icon={Users2}
            title="Classes"
            description="Manage your classes"
            buttonText="See my classes"
          >
            You have no classes yet.
          </CardWithButton>
          <CardWithButton
            hoverAnimation
            className="w-full text-white md:w-96 bg-gradient-to-t from-violet-400 to-fuchsia-400"
            buttonClassName="w-40 text-black bg-fuchsia-200 hover:bg-fuchsia-300"
            Icon={Library}
            title="Lessons"
            description="Manage your lessons"
            buttonText="See my lessons"
          >
            You have no lessons yet.
          </CardWithButton>
          <CardWithButton
            hoverAnimation
            className="w-full text-white md:w-96 bg-gradient-to-t from-indigo-400 to-cyan-400"
            buttonClassName="w-40 text-black bg-cyan-200 hover:bg-cyan-300"
            Icon={TextQuote}
            title="Blocks"
            description="Manage your blocks"
            buttonText="See my blocks"
          >
            You have no Blocks yet.
          </CardWithButton>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
