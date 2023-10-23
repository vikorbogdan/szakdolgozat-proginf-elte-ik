"use client";
import { Loader2 } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type AuthButtonProps = {
  signInLabel?: string;
  signOutLabel?: string;
  className?: string;
};

const AuthButton = ({
  signInLabel,
  signOutLabel,
  className,
}: AuthButtonProps) => {
  const { status: authStatus } = useSession();
  return authStatus === "authenticated" ? (
    <Button
      className={cn(className, "")}
      onClick={() => signOut()}
      variant={"secondary"}
    >
      {signOutLabel || "Sign Out"}
    </Button>
  ) : authStatus === "unauthenticated" ? (
    <Button
      className={cn(className, "")}
      onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
      variant={"default"}
    >
      {signInLabel || "Sign In"}
    </Button>
  ) : (
    <Button className={cn(className, "")} disabled={true} variant={"default"}>
      <Loader2 className="h-4 w-4 animate-spin" />
    </Button>
  );
};

export default AuthButton;
