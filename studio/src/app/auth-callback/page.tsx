"use client";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { trpc } from "../_trpc/client";
import { Loader } from "lucide-react";

const Page = () => {
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");
  const { isSuccess, isError } = trpc.authCallback.useQuery(undefined, {
    retry: true,
    retryDelay: 500,
  });

  useEffect(() => {
    if (isSuccess) {
      redirect(origin ? `/${origin}` : "dashboard");
    }
  }, [isSuccess, origin]);
  useEffect(() => {
    if (isError) {
      redirect("login");
    }
  }, [isError]);
  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader className="h-10 w-10 animate-spin text-primary" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be automatically redirected.</p>
      </div>
    </div>
  );
};

export default Page;
