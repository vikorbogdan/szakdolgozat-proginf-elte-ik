"use client";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { useNavbarStore } from "@/store/client/useStore";
import { motion } from "framer-motion";
import { ChevronsRight } from "lucide-react";
const Navbar = () => {
  const { toggleNavbarOpen, navbarOpen, lesson } = useNavbarStore();
  return (
    <nav className="px-3 z-50 bg-background h-14 w-full">
      <div className="flex h-14 items-center justify-between">
        <Button
          variant="ghost"
          className="flex lg:hidden items-center"
          onClick={toggleNavbarOpen}
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={navbarOpen ? { rotate: -180 } : { rotate: 0 }}
          >
            <ChevronsRight className="h-6 w-6" />
          </motion.div>
        </Button>
        <div className="ml-auto flex">
          <ModeToggle />
        </div>
        <div className="flex gap-5"></div>
      </div>
    </nav>
  );
};

export default Navbar;
