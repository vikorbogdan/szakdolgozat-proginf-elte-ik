"use client";
import AuthButton from "@/components/AuthButton";
import { cn } from "@/lib/utils";
import { HomeIcon, Library, TextQuote, Users2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

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
      name: "Classes",
      icon: Users2,
      path: "/dashboard",
    },
    {
      order: 2,
      name: "Lessons",
      icon: Library,
      path: "/dashboard",
    },
    {
      order: 3,
      name: "Study Blocks",
      icon: TextQuote,
      path: "/dashboard",
    },
  ];
  const [selected, setSelected] = useState(0); // TODO: Change this to the current page being rendered
  const { data } = useSession();
  if (!data) return null;
  const userData = data.user;
  return (
    <aside className="absolute lg:static text-foreground gap-8 flex-col h-screen flex w-52 bg-background">
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
      <ul className="flex select-none flex-col text-sm px-3 gap-1">
        {menuOptions.map((menuElement) => {
          return (
            <li
              className={cn(
                menuElement.order === selected // TODO: Change this to a way of checking if the current page is the one being rendered
                  ? "text-background bg-primary hover:bg-primary"
                  : "hover:bg-primary-foreground",
                "transition-colors p-1 gap-2 cursor-pointer flex items-center rounded-[0.2rem]"
              )}
              key="menuElement"
              onClick={() => setSelected(menuElement.order)}
            >
              <menuElement.icon className="w-4 h-4" /> {menuElement.name}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
