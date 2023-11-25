import { TextQuote } from "lucide-react";
import BlockList from "./_components/BlockList";

const Blocks = () => {
  return (
    <div className="flex p-4 md:p-16 gap-16 bg-primary-foreground min-h-screen h-full w-full flex-col">
      <div className="flex items-center gap-4">
        <TextQuote className="h-14 w-14" />
        <h1 className="text-5xl font-semibold">Learning Blocks</h1>
      </div>
      <BlockList />
    </div>
  );
};

export default Blocks;
