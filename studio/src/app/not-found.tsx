import { buttonVariants } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
const NotFound = () => {
  return (
    <div className="mt-[35vh] w-full justify-center items-center flex flex-col gap-5">
      <p className="">Page not found</p>
      <h1 className="font-bold text-9xl motion-safe:animate-bounce motion-reduce:animate-none ">
        404
      </h1>
      <Link
        href="/"
        className={buttonVariants({
          variant: "default",
        })}
      >
        <HomeIcon className="h-4 w-4 mr-2" /> Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
