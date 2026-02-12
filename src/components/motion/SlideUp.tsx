"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SlideUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function SlideUp({ children, className, delay = 0 }: SlideUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
