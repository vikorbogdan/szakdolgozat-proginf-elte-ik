"use client";
import SandpackRenderer from "@/app/(public)/_components/SandpackRenderer";
import { trpc } from "@/app/_trpc/client";
import NotFound from "@/app/not-found";
import LoadingPage from "@/components/LoadingPage";
import { SandpackPredefinedTemplate } from "@codesandbox/sandpack-react";
import { useParams } from "next/navigation";

const RenderHandoutPage = () => {
  const { id } = useParams();
  const { data: handoutData, isLoading: isHandoutDataLoading } =
    trpc.handouts.getHandoutById.useQuery({ handoutId: id as string });
  if (isHandoutDataLoading) return <LoadingPage />;
  if (!handoutData) return <NotFound />;
  return (
    <div className="flex p-4 md:p-16 gap-16 bg-primary-foreground min-h-screen h-full w-full flex-col">
      <header>
        <h1 className="md:text-5xl text-xl font-semibold">Handout</h1>
      </header>
      <main className="h-screen">
        <SandpackRenderer
          template={handoutData.template as SandpackPredefinedTemplate}
          files={JSON.parse(handoutData.files)}
        />
      </main>
    </div>
  );
};

export default RenderHandoutPage;
