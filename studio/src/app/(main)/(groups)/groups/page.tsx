import { Users2 } from "lucide-react";

const Groups = () => {
  return (
    <div className="flex p-4 md:p-16 gap-16 bg-primary-foreground min-h-screen h-full w-full flex-col">
      <div className="flex items-center gap-4">
        <Users2 className="h-14 w-14" />
        <h1 className="text-5xl font-semibold">Subject Groups</h1>
      </div>
    </div>
  );
};

export default Groups;