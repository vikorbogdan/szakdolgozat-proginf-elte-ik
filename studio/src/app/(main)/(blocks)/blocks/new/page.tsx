"use client";
import CreateBlockForm from "./_components/CreateBlockForm";

const NewBlock = () => {
  return (
    <div className="flex p-4 md:p-16 gap-16 bg-primary-foreground min-h-screen h-full w-full flex-col">
      <h1 className="text-5xl font-semibold">Add New Block</h1>
      <CreateBlockForm />
    </div>
  );
};

export default NewBlock;
