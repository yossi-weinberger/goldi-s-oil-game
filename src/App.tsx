import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Bowl } from "./components/Bowl";
import { FoodCard } from "./components/FoodCard";
import { foods, type FoodItem } from "./data/foods";

function App() {
  const [score, setScore] = useState(0);
  const [currentFood, setCurrentFood] = useState<FoodItem | null>(null);
  const [dragTarget, setDragTarget] = useState<"healthy" | "unhealthy" | null>(
    null
  );
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [soundsLoaded, setSoundsLoaded] = useState(false);

  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio elements
    correctSoundRef.current = new Audio();
    wrongSoundRef.current = new Audio();

    // Set sources
    if (correctSoundRef.current)
      correctSoundRef.current.src = "/sounds/correct.wav";
    if (wrongSoundRef.current) wrongSoundRef.current.src = "/sounds/wrong.wav";

    // Load sounds
    Promise.all([
      correctSoundRef.current
        ?.play()
        .then(() => correctSoundRef.current?.pause()),
      wrongSoundRef.current?.play().then(() => wrongSoundRef.current?.pause()),
    ])
      .then(() => {
        console.log("Sounds loaded successfully");
        setSoundsLoaded(true);
      })
      .catch((error) => {
        console.error("Error loading sounds:", error);
      });

    pickRandomFood();

    // Cleanup
    return () => {
      if (correctSoundRef.current) correctSoundRef.current = null;
      if (wrongSoundRef.current) wrongSoundRef.current = null;
    };
  }, []);

  const playSound = async (sound: "correct" | "wrong") => {
    try {
      const audioRef =
        sound === "correct" ? correctSoundRef.current : wrongSoundRef.current;
      if (audioRef) {
        audioRef.currentTime = 0;
        await audioRef.play();
      }
    } catch (error) {
      console.error(`Error playing ${sound} sound:`, error);
    }
  };

  const pickRandomFood = () => {
    const availableFoods = foods.filter(
      (food) => !currentFood || food.id !== currentFood.id
    );
    const randomIndex = Math.floor(Math.random() * availableFoods.length);
    setCurrentFood(availableFoods[randomIndex]);
  };

  const handleDrop = async (bowlType: "healthy" | "unhealthy") => {
    if (!currentFood || !isDragging) return;

    const isCorrect =
      (bowlType === "healthy" && currentFood.isHealthy) ||
      (bowlType === "unhealthy" && !currentFood.isHealthy);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setFeedback("correct");
      await playSound("correct");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFC0CB", "#87CEEB", "#98FB98", "#DDA0DD", "#F0E68C"],
      });
    } else {
      setScore((prev) => prev - 1);
      setFeedback("wrong");
      await playSound("wrong");
    }

    setIsDragging(false);
    setTimeout(() => {
      setFeedback(null);
      pickRandomFood();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-blue-100 to-purple-100 fixed w-full h-full overflow-auto">
      <div className="max-w-4xl mx-auto flex flex-col min-h-screen p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-purple-600">
            משחק הבריאות של המורה גולדי
          </h1>
          <div className="bg-white rounded-full px-8 py-2 inline-block shadow-lg">
            <p className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              ניקוד: {score}
            </p>
          </div>
        </header>

        <div className="flex-1 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {currentFood && (
              <motion.div
                key={currentFood.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="flex justify-center mb-8"
              >
                <FoodCard
                  food={currentFood}
                  onDragStart={() => {
                    setIsDragging(true);
                  }}
                  onDragEnd={(e) => {
                    e.preventDefault();
                    if (dragTarget && isDragging) {
                      handleDrop(dragTarget);
                    }
                    setDragTarget(null);
                    setIsDragging(false);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center gap-32 mb-16">
            <Bowl
              type="healthy"
              isOver={dragTarget === "healthy"}
              onDragEnter={() => setDragTarget("healthy")}
              onDragLeave={() => setDragTarget(null)}
              onDragOver={(e) => e.preventDefault()}
            />
            <Bowl
              type="unhealthy"
              isOver={dragTarget === "unhealthy"}
              onDragEnter={() => setDragTarget("unhealthy")}
              onDragLeave={() => setDragTarget(null)}
              onDragOver={(e) => e.preventDefault()}
            />
          </div>
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed bottom-8 left-1/2 transform -translate-x-1/2
                shadow-lg rounded-xl p-6 ${
                  feedback === "correct"
                    ? "bg-gradient-to-r from-green-400 to-green-500 text-white"
                    : "bg-gradient-to-r from-red-400 to-red-500 text-white"
                }`}
            >
              <div className="text-3xl font-bold text-center">
                {feedback === "correct" ? "🎉 כל הכבוד! 🎈" : "😕 נסה שוב! 💪"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
