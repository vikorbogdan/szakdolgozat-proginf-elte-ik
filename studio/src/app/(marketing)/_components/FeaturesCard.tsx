"use client";
import { motion, useInView } from "framer-motion";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useRef } from "react";
type FeaturesCardProps = {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
};
const FeaturesCard = ({ icon, title, description }: FeaturesCardProps) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, {
    once: true,
  });
  const fadeIn = {
    hidden: { opacity: 0, transform: "translateY(100px)" },
    visible: { opacity: 1, transform: "translateY(0px)" },
  };
  return (
    <motion.div
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeIn}
      transition={{ duration: 0.5 }}
    >
      <Card
        ref={cardRef}
        className="py-5 md:py-0 md:px-5 flex flex-col md:flex-row items-center justify-center"
      >
        {icon}
        <CardHeader className="text-center md:text-left">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="max-w-md">{description}</CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  );
};

export default FeaturesCard;
