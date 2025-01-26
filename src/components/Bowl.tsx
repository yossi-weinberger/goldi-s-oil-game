import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Trash2, Package2 } from "lucide-react";

interface BowlProps {
  type: "healthy" | "unhealthy";
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDragOver: (e: React.DragEvent) => void;
  isOver: boolean;
}

export function Bowl({
  type,
  onDragEnter,
  onDragLeave,
  onDragOver,
  isOver,
}: BowlProps) {
  const Icon = type === "healthy" ? Package2 : Trash2;

  const styles = useMemo(
    () => ({
      container: `flex flex-col items-center p-8 rounded-xl transition-all duration-200 ease-in-out`,
      iconContainer: `p-6 rounded-full ${
        type === "healthy" ? "bg-green-100" : "bg-red-100"
      } mb-4`,
      icon: `${
        type === "healthy" ? "text-green-500" : "text-red-500"
      } transition-transform duration-200`,
      text: `mt-4 text-2xl font-bold ${
        type === "healthy" ? "text-green-600" : "text-red-600"
      }`,
    }),
    [type]
  );

  return (
    <motion.div
      className={`${styles.container} ${isOver ? "scale-110" : "scale-100"}`}
      onDragEnter={(e) => {
        e.preventDefault();
        onDragEnter();
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        onDragLeave();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(e);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDragEnter();
      }}
    >
      <div className={styles.iconContainer}>
        <Icon
          size={80}
          className={`${styles.icon} ${isOver ? "scale-110" : "scale-100"}`}
        />
      </div>
      <span className={styles.text}>
        {type === "healthy" ? "ארון המזון" : "פח האשפה"}
      </span>
    </motion.div>
  );
}
