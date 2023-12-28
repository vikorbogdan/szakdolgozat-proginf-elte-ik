"use client";
import FeaturesCard from "@/app/(marketing)/_components/FeaturesCard";
import ProcessFlowCard from "@/app/(marketing)/_components/ProcessFlowCard";
import AuthButton from "@/components/AuthButton";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Braces, Library, Loader, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import waveLine from "src/svg/wave-line.svg";
import { trpc } from "../_trpc/client";
export default function Home() {
  const { data: userData } = useSession();
  if (userData) redirect("/dashboard");
  const { data: splashText, isLoading: isSplashTextLoading } =
    trpc.splash.useQuery(undefined, {
      onError: (error) => {
        console.error(error);
      },
    });
  return (
    <MaxWidthWrapper className="mb-12 mt-14 flex flex-col items-center justify-center text-center">
      <Badge className="rounded-full select-none drop-shadow-lg font-normal md:px-6 md:py-2 md:text-md animate-bounce">
        {isSplashTextLoading ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          splashText
        )}
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
              icon={<BookOpen className="flex-grow h-20 w-20" />}
              title="Assemble your Curriculum"
              description="Curate your curriculum with ease. Compose Lesson Outlines using pre-defined, modular Learning Blocks — save your favorite equation or concept once and reuse it in whatever lesson it fits. "
            />
            <FeaturesCard
              icon={<Library className="flex-grow h-20 w-20" />}
              title="Lesson Library at Your Fingertips"
              description="Never lose track of your teaching materials. Our app acts as a central library for your Lesson Outlines — find and attach your best content to multiple Subject Groups seamlessly."
            />
            <FeaturesCard
              icon={<Zap className="flex-grow h-20 w-20" />}
              title="Lesson Mode On"
              description="Teach your classes with 'Lesson Mode'. Track time and progress with a glance, while studying your Lesson Outline. Mark your current progress with interactive checkpoints for a seamless teaching experience."
            />
            <FeaturesCard
              icon={<Braces className="flex-grow h-20 w-20" />}
              title="Browser-Based Challenges"
              description="Transform lessons into interactive experiences with live-edit handouts. Upload exercises for any subject, allowing students to solve directly in their browsers. Instant results and easy sharing make for an engaging, hands-on learning journey."
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
            className="flex flex-col md:flex-row gap-5 md:gap-12 lg:gap-0"
          >
            <ProcessFlowCard
              title="Make your own Learning Blocks"
              description="Assemble a library of Learning Blocks to use in your lessons."
            />
            <Image
              aria-hidden="true"
              className="hidden w-32 xl:w-40 lg:block"
              width={300}
              alt=""
              src={waveLine}
            />
            <ProcessFlowCard
              title="Assemble Lesson Outlines"
              description="Compose Lesson Outlines using your Learning Blocks and use them to teach your classes."
            />
            <Image
              aria-hidden="true"
              className="hidden w-32 xl:w-40 lg:block"
              width={300}
              alt=""
              src={waveLine}
            />
            <ProcessFlowCard
              title="Create a Subject Group"
              description="Create a class for you and your colleagues to share your Lesson Outlines."
            />
          </div>
        </div>
        <footer>
          Studio by{" "}
          <Link
            className="text-blue-500"
            href={"https://github.com/vikorbogdan"}
          >
            @vikorbogdan
          </Link>
        </footer>
      </main>
    </MaxWidthWrapper>
  );
}
