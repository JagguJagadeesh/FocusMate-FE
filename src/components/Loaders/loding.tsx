"use client";

import { GraduationCapIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ParticleLoaderProps {
  text?: string;
}

export const Component = ({ text = "Loading" }: ParticleLoaderProps) => {
  const particles = Array.from({ length: 6 });

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Floating particles */}
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-violet-500 rounded-full"
            animate={{
              x: Math.cos((i / particles.length) * Math.PI * 2) * 50,
              y: Math.sin((i / particles.length) * Math.PI * 2) * 50,
              opacity: [0, 1, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              delay: (i / particles.length) * 0.3
            }}
          />
        ))}

        {/* Center icon - no rotation */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            scale: { repeat: Infinity, duration: 1.5 }
          }}
        >
          <GraduationCapIcon width={60} height={60} className="" />
        </motion.div>

        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent dark:border-t-white border-t-black"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />
      </div>

      {/* Loading text */}
      <motion.p
        className="text-sm font-medium text-gray-600 dark:text-gray-400"
        animate={{ opacity: [0.6, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, repeatType: "mirror" }}
      >
        {`${text}...`}
      </motion.p>
    </div>
  );
};
