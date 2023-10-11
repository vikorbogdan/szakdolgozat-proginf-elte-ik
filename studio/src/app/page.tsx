import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
      <div className="cursor-default mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden">
        <Badge className="rounded-full font-normal md:px-6 md:py-2 md:text-md">
          Studio is now Live! 🎓 🥳
        </Badge>
      </div>
      <div id="hero" className="flex flex-col items-center w-full gap-24">
        <h1 className="text-6xl md:text-9xl font-bold">
          Elevate teaching with <span className="text-blue-500">Studio</span>.
        </h1>
        <div className="flex gap-5">
          <Button>Log in</Button>
          <Button variant="outline">Sign up</Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
