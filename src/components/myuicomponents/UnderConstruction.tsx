"use client";

import { Clock, Construction } from "lucide-react";
import { motion } from "framer-motion";

interface UnderConstructionCardProps {
  title?: string;
  description?: string;
}

export default function UnderConstructionCard({
  title = "Feature Coming Soon",
  description = "We're working on bringing you this amazing feature"
}: UnderConstructionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-xl border-2 border-dashed border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6"
    >
      {/* Animated background */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-400 opacity-10 blur"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8 }}
      />

      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-3"
        >
          <Construction className="w-8 h-8 text-amber-600" />
        </motion.div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>

        {/* Info banner */}
        <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-100/50 dark:bg-amber-900/30 rounded-lg px-3 py-2">
          <Clock className="w-4 h-4" />
          <span>Under active development</span>
        </div>
      </div>
    </motion.div>
  );
}
