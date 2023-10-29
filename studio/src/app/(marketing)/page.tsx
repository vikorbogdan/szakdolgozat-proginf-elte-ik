"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import FeaturesCard from "@/app/(marketing)/_components/FeaturesCard";
import ProcessFlowCard from "@/app/(marketing)/_components/ProcessFlowCard";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import waveLine from "src/svg/wave-line.svg";
import AuthButton from "@/components/AuthButton";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
export default function Home() {
  const { data: userData } = useSession();
  if (userData) redirect("/dashboard");
  return (
    <MaxWidthWrapper className="mb-12 mt-14 flex flex-col items-center justify-center text-center">
      <Badge className="rounded-full drop-shadow-lg font-normal md:px-6 md:py-2 md:text-md">
        studio is now Live! 🎓 🥳
      </Badge>
      <main className="flex mt-24 flex-col gap-24 md:gap-48">
        <div id="hero" className="flex flex-col items-center w-full gap-24">
          <h1 className="drop-shadow-lg text-6xl md:text-9xl font-bold">
            Elevate teaching with <span className="text-blue-500 ">studio</span>
            .
          </h1>
          <div className="flex gap-5">
            <AuthButton signInLabel="Get Started for Free" />
          </div>
        </div>
        <div id="features" className="flex flex-col gap-12 items-center w-full">
          <h2 className="text-3xl md:text-5xl font-bold">Features</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <FeaturesCard
              icon={<BrainCircuit className="flex-grow h-20 w-20" />}
              title="Your Second Brain."
              description="Access a centralized hub for all your class notes. Say goodbye to
          scattered documents—Studio keeps everything organized and easily
          accessible."
            />
            <FeaturesCard
              icon={<BrainCircuit className="flex-grow h-20 w-20" />}
              title="Your Second Brain."
              description="Access a centralized hub for all your class notes. Say goodbye to
          scattered documents—Studio keeps everything organized and easily
          accessible."
            />
            <FeaturesCard
              icon={<BrainCircuit className="flex-grow h-20 w-20" />}
              title="Your Second Brain."
              description="Access a centralized hub for all your class notes. Say goodbye to
          scattered documents—Studio keeps everything organized and easily
          accessible."
            />
            <FeaturesCard
              icon={<BrainCircuit className="flex-grow h-20 w-20" />}
              title="Your Second Brain."
              description="Access a centralized hub for all your class notes. Say goodbye to
          scattered documents—Studio keeps everything organized and easily
          accessible."
            />
          </div>
        </div>
        <div
          id="howitworks"
          className="flex flex-col gap-12 items-center w-full"
        >
          <h2 className="text-3xl md:text-5xl font-bold">How does it work?</h2>
          <div
            id="flow-diagram"
            className="flex flex-col md:flex-row gap-5 md:gap-12 xl:gap-0"
          >
            <ProcessFlowCard
              title="Create a classroom"
              description="Create a class for your study materials."
            />
            <Image
              aria-hidden="true"
              className="hidden xl:block"
              width={300}
              alt=""
              src={waveLine}
            />
            <ProcessFlowCard
              title="Assemble lesson outlines"
              description="Assemble a lesson outline for your students."
            />
            <Image
              aria-hidden="true"
              className="hidden xl:block"
              width={300}
              alt=""
              src={waveLine}
            />
            <ProcessFlowCard
              title="Share with teachers"
              description="Share your study plan with other teachers."
            />
          </div>
        </div>
        <footer>
          © 2023 Studio. All rights reserved. |{" "}
          <Link className="text-blue-500" href={""}>
            Contact us
          </Link>
        </footer>
      </main>
    </MaxWidthWrapper>
  );
}
