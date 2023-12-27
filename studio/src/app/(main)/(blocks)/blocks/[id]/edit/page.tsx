"use client";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, PlusSquare } from "lucide-react";
import Link from "next/link";
import EditBlockForm from "./_components/EditBlockForm";
import { useParams } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import ErrorPage from "@/components/ErrorPage";
import LoadingPage from "@/components/LoadingPage";

const EditBlock = () => {
  const { id: blockId } = useParams();
  const { isLoading, isError, error } = trpc.blocks.getBlockById.useQuery(
    blockId as string
  );
  if (isError) return <ErrorPage code={403} message={error?.message} />;
  if (isLoading) return <LoadingPage />;
  return (
    <div className="flex p-4 md:p-16 gap-16 bg-primary-foreground min-h-screen h-full w-full flex-col">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <PlusSquare className="w-14 h-14" />
          <h1 className="md:text-5xl text-xl font-semibold">Edit Block</h1>
        </div>
        <Link
          href={{
            pathname: "/blocks",
          }}
          className={buttonVariants({ variant: "secondary" })}
        >
          <ArrowLeft className="w-5 h-5" /> Learning Blocks
        </Link>
      </div>
      <EditBlockForm />
    </div>
  );
};

export default EditBlock;
