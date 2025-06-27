// front_end/src/components/animated/SlideIn.tsx
import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface SlideInProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
}

const SlideIn: React.FC<SlideInProps> = ({ children, direction = "left" }) => {
  const { language } = useLanguage();
  const rtl = language === "ar";
  const adjustedDirection = rtl && ["left", "right"].includes(direction)
    ? direction === "left" ? "right" : "left"
    : direction;

  const animationMap = {
    left: { x: -100 },
    right: { x: 100 },
    up: { y: -100 },
    down: { y: 100 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: animationMap[adjustedDirection].x, y: animationMap[adjustedDirection].y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};