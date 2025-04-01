import React, { useState, useEffect } from "react";
import Lottie, { Options as LottieOptions } from "react-lottie";
import scanning from "../assets/scanning.json";
import gears from "../assets/gears.json";
import bubbles from "../assets/bubbles.json";

interface LottieAnimation {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  ddd: number;
  assets: any[];
  layers: any[];
}

function Scanning() {
   
  const statuses = [
    "Processing file...",
    "Extracting text from file...",
    "Generating study guide...",
    "Identifying key points...",
    "Generating flashcards...",
    "Creating quiz questions...",
    "Fetching related resources...",
    "Almost done!",
  ];

  const totalSteps = statuses.length;
  const [statusIndex, setStatusIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [animation, setAnimation] = useState<LottieAnimation>(scanning);

  useEffect(() => {
    if (statusIndex < totalSteps - 1) {
      const timeout = setTimeout(() => {
        setStatusIndex((prevIndex) => prevIndex + 1);
        setProgress(((statusIndex + 1) / totalSteps) * 100);

        // Ensure correct animation switching
        if (statusIndex === 2) setAnimation(gears);
        if (statusIndex === totalSteps - 2) setAnimation(bubbles);
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [statusIndex]);

  const lottieOptions: LottieOptions = {
    loop: true, // Stop animation at last stage
    autoplay: true,
    animationData: animation,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      {/* Corrected Lottie Usage */}
      <Lottie options={lottieOptions} height={250} width={250} />

      {/* Progress Bar */}
      <div className="w-full max-w-md bg-gray-300 rounded-full h-3 relative">
        <div
          className="bg-primary h-full rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Status Message */}
      <p className="mt-2 text-lg font-semibold text-gray-700 animate-fade">
        {statuses[statusIndex]}
      </p>

      {/* Estimated Time */}
      {statusIndex < totalSteps - 1 && (
        <p className="text-gray-500 text-sm">
          Estimated time remaining: ~{(totalSteps - statusIndex) * 3} sec
        </p>
      )}
    </div>
  );
}

export default Scanning;
