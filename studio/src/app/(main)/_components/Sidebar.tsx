"use client";
import AuthButton from "@/components/AuthButton";
import { cn } from "@/lib/utils";
import { useNavbarStore } from "@/store/client/useStore";
import { HomeIcon, Library, Loader2, TextQuote, Users2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";

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
  const [selected, setSelected] = useState(pathName);
  const { data: session } = useSession();
  const { navbarOpen, setNavbarOpen } = useNavbarStore();

  useEffect(() => {
    setSelected(pathName);
  }, [pathName]);

  if (!session) return null;
  const userData = session.user;
  return (
    <>
      <aside
        className={`z-50 w-[13rem] text-foreground gap-8 flex-col h-screen hidden lg:flex bg-background `}
      >
        <div className="flex flex-col items-center mt-8 gap-3">
          <Avatar className="h-20 w-20">
            <AvatarImage src={userData?.image ?? ""} />
            <AvatarFallback>
              <Loader2 className="animate-spin w-10 h-10 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
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
      </aside>
      <Drawer onOpenChange={setNavbarOpen} open={navbarOpen}>
        <DrawerContent>
          <DrawerHeader className="flex items-center gap-4 justify-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userData?.image ?? ""} />
              <AvatarFallback>
                <Loader2 className="animate-spin w-10 h-10 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2 items-start">
              <h3 className="font-bold">{userData?.name}</h3>
              <AuthButton className="w-24 text-xs h-8" />
            </div>
          </DrawerHeader>
          <Separator className="my-2" />
          <nav className="mb-4">
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
                      setNavbarOpen(false);
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
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
