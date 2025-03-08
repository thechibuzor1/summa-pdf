import React, { useState, useEffect } from "react";
import Lottie from "react-lottie";
import animationData from "../assets/scanning.json";

function Scanning() {
  const defaultOptions: any = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const [statusIndex, setStatusIndex] = useState(0);
  const statuses = ["Processing File...", 
    "Extracting Text from file...", 
    "Generating Study guide",
    "Generating Keypoints...",
    "Generating Flashcards...",
    "Generating quiz questions...",
    "Generating Related Videos...",
    "Almost there..."];

  useEffect(() => {
    if (statusIndex < statuses.length - 1) {
      const timeout = setTimeout(() => {
        setStatusIndex((prevIndex) => prevIndex + 1);
      }, 3000); // ✅ Transition every 3 seconds

      return () => clearTimeout(timeout);
    }
  }, [statusIndex, statuses.length]);

  return (
    <div className="flex flex-col items-center">
      <Lottie options={defaultOptions} height={250} width={250} />
      <p className="mt-2 text-lg font-[700] text-gray-700 transition-opacity duration-700 ease-in-out">
        {statuses[statusIndex]}
      </p>
    </div>
  );
}

export default Scanning;
