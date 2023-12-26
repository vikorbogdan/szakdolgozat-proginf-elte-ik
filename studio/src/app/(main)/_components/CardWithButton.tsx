import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

type CardWithButtonProps = {
  className?: string;
  buttonClassName?: string;
  Icon?: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
  buttonText: string;
  hoverAnimation?: boolean;
  href?: string;
};

const CardWithButton = ({
  className,
  buttonClassName,
  Icon,
  title,
  description,
  children,
  buttonText,
  hoverAnimation,
  href,
}: CardWithButtonProps) => {
  const CardWithButtonComponent = (
    <Card className={className}>
      <CardHeader className="text-3xl">
        {Icon && <Icon className="w-12 h-12" />}
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-white">{description}</CardDescription>
        <Link
          href={href ?? ""}
          className={cn(
            buttonVariants({ variant: "default" }),
            buttonClassName
          )}
        >
          {buttonText}
        </Link>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
  if (hoverAnimation)
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileFocus={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {CardWithButtonComponent}
      </motion.div>
    );
  return CardWithButtonComponent;
};

export default CardWithButton;
