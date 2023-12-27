import { buttonVariants } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

interface ErrorPageProps {
  code?: number;
  message?: string;
  isFullPage?: boolean;
}

const ErrorPage = ({ code, message, isFullPage }: ErrorPageProps) => {
  return (
    <div
      className={`${
        isFullPage ? "mt-[35vh]" : ""
      } w-full justify-center items-center flex flex-col gap-5`}
    >
      <p className="">{message || "Not found."}</p>
      <h1 className="font-bold text-9xl motion-safe:animate-bounce motion-reduce:animate-none ">
        {code || 404}
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

export default ErrorPage;
