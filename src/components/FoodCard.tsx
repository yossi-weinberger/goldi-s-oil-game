import React from 'react';
import { motion } from 'framer-motion';
import type { FoodItem } from '../data/foods';

interface FoodCardProps {
  food: FoodItem;
  onDragStart: () => void;
  onDragEnd: (e: React.DragEvent) => void;
}

export function FoodCard({ food, onDragStart, onDragEnd }: FoodCardProps) {
  return (
    <motion.div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="bg-white rounded-xl shadow-lg p-4 cursor-grab active:cursor-grabbing hover:shadow-xl transition-shadow transform hover:scale-105"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative w-48 h-48 rounded-lg overflow-hidden mb-3">
        <img
          src={`${food.image}?w=400&h=400&fit=crop&crop=center`}
          alt={food.name}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
      <h3 className="text-xl font-bold text-center text-purple-600">{food.name}</h3>
    </motion.div>
  );
}