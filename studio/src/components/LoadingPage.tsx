import { Loader2 } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="p-4 md:p-16 items-center justify-center flex bg-primary-foreground min-h-screen h-full w-full">
      <div className="items-center flex flex-col">
        <Loader2 className="text-muted-foreground animate-spin w-10 h-10" />
      </div>
    </div>
  );
};

export default LoadingPage;
