"use client";
import AuthButton from "@/components/AuthButton";
import { cn } from "@/lib/utils";
import { useClientStore } from "@/store/client/useStore";
import { HomeIcon, Library, TextQuote, Users2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

const Sidebar = () => {
  const menuOptions = [
    {
      order: 0,
      name: "Dashboard",
      icon: HomeIcon,
      path: "/dashboard",
    },
    {
      order: 1,
      name: "Subject Groups",
      icon: Users2,
      path: "/groups",
    },
    {
      order: 2,
      name: "Lesson Outlines",
      icon: Library,
      path: "/lessons",
    },
    {
      order: 3,
      name: "Learning Blocks",
      icon: TextQuote,
      path: "/blocks",
    },
  ];
  const router = useRouter();
  const pathName = usePathname();
  console.log(pathName);
  const [selected, setSelected] = useState(pathName);
  const { data: session } = useSession();
  const { navbarOpen } = useClientStore();
  if (!session) return null;
  const userData = session.user;
  return (
    <motion.aside
      initial={{
        width: "var(--width-initial)",
        opacity: "var(--opacity-initial)",
      }}
      animate={{
        width: navbarOpen ? "var(--width-animate)" : "var(--width-initial)",
        opacity: navbarOpen
          ? "var(--opacity-animate)"
          : "var(--opacity-initial)",
      }}
      className={`z-50 absolute lg:static text-foreground gap-8 flex-col h-screen flex bg-background [--width-animate:100%] md:[--width-animate:13rem] [--width-initial:0%] lg:[--width-initial:13rem] [--opacity-initial:0] lg:[--opacity-initial:1] [--opacity-animate:1]`}
    >
      <div className="flex flex-col items-center mt-8 gap-3">
        <div className="h-20 w-20 relative">
          <Image
            alt="Profile picture of logged in user"
            objectFit="cover"
            className="rounded-full relative"
            fill={true}
            src={userData?.image || ""}
          />
        </div>
        <h3 className="font-bold">{userData?.name}</h3>
        <AuthButton className="w-24 text-xs h-8" />
      </div>
      <nav>
        <ul className="flex select-none flex-col text-sm px-3 gap-1">
          {menuOptions.map((menuElement) => {
            return (
              <li
                className={cn(
                  menuElement.path === selected
                    ? "text-background bg-primary hover:bg-primary"
                    : "hover:bg-primary-foreground",
                  "transition-colors p-1 gap-2 cursor-pointer flex items-center rounded-[0.2rem]"
                )}
                key={menuElement.order}
                onClick={() => {
                  router.push(menuElement.path);
                  setSelected(menuElement.path);
                }}
              >
                <menuElement.icon className="w-4 h-4" />
                {menuElement.name}
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
