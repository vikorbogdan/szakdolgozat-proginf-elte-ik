"use client";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, PlusSquare } from "lucide-react";
import Link from "next/link";
import CreateBlockForm from "./_components/CreateBlockForm";

const NewBlock = () => {
  return (
    <div className="flex p-4 md:p-16 gap-16 bg-primary-foreground min-h-screen h-full w-full flex-col">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <PlusSquare className="w-14 h-14" />
          <h1 className="text-5xl font-semibold">Add New Block</h1>
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
      <CreateBlockForm />
    </div>
  );
};

export default NewBlock;
