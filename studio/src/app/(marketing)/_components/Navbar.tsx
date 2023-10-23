"use client";
import Link from "next/link";
import MaxWidthWrapper from "../../../components/MaxWidthWrapper";
import { ModeToggle } from "../../../components/ModeToggle";
import { buttonVariants } from "@/components/ui/button";
import useScrollTop from "@/hooks/useScrollTop";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const scrolledDown = useScrollTop(100);
  return (
    <nav
      className={cn(
        "sticky h-14 inset-x-0 top-0 z-30 w-full transition-all",
        scrolledDown &&
          "border-b border-gray-200 dark:border-primary-foreground bg-white/75 dark:bg-background/75 backdrop-blur-lg"
      )}
    >
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between">
          <Link className="z-40 font-black flex" href={"/"}>
            studio
          </Link>
          <ModeToggle className="ml-auto mr-5" />
          <div className="flex gap-5">
            <Link href="/" className={buttonVariants({ variant: "secondary" })}>
              Log in
            </Link>
            <Link href="/" className={buttonVariants({ variant: "default" })}>
              Sign up
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
