"use client";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { useNavbarStore } from "@/store/client/useStore";
import { motion } from "framer-motion";
import { ChevronsRight, Menu } from "lucide-react";
import CurrentLessonDisplay from "./(current_lesson_display)/CurrentLessonDisplay";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
const Navbar = () => {
  const { toggleNavbarOpen, navbarOpen, onGoingLessonId } = useNavbarStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isOnOngoingLessonPage =
    onGoingLessonId && pathname === `/lessons/${onGoingLessonId}`;
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav
      className={`px-3 sticky top-0 z-[999] transition-opacity hover:opacity-100 bg-background ${
        isScrolled && isOnOngoingLessonPage ? "opacity-10" : "opacity-100"
      } h-14 w-full`}
    >
      <div className="flex h-14 gap-4 items-center justify-between">
        <Button
          variant="ghost"
          className="flex lg:hidden items-center"
          onClick={toggleNavbarOpen}
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={navbarOpen ? { rotate: -180 } : { rotate: 0 }}
          >
            <Menu className="h-6 w-6" />
          </motion.div>
        </Button>
        <CurrentLessonDisplay />
        <div className="ml-auto flex">
          <ModeToggle />
        </div>
        <div className="flex gap-5"></div>
      </div>
    </nav>
  );
};

export default Navbar;
