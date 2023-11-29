import { Plus, TextQuote } from "lucide-react";
import BlockList from "./_components/BlockList";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const Blocks = () => {
  return (
    <div className="flex p-4 md:p-16 gap-16 bg-primary-foreground min-h-screen h-full w-full flex-col">
      <div className="flex justify-between w-full items-center">
        <div className="flex items-center gap-4">
          <TextQuote className="h-14 w-14" />
          <h1 className="text-5xl font-semibold">Learning Blocks</h1>
        </div>
        <Link
          href={{
            pathname: "/blocks/new",
          }}
          className={buttonVariants({ variant: "default" })}
        >
          <Plus className="w-5 h-5" /> Add New
        </Link>
      </div>
      <BlockList />
    </div>
  );
};

export default Blocks;
