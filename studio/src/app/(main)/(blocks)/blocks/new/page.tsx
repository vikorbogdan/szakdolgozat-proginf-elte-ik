"use client";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, PlusSquare } from "lucide-react";
import Link from "next/link";
import CreateNewBlockForm from "./_components/CreateNewBlockForm";

const NewBlock = () => {
  return (
    <div className="flex p-4 md:p-16 gap-16 bg-primary-foreground min-h-screen h-full w-full flex-col">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <PlusSquare className="w-14 h-14" />
          <h1 className="md:text-5xl text-xl font-semibold">Add New Block</h1>
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
      <CreateNewBlockForm />
    </div>
  );
};

export default NewBlock;
