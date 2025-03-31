import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Flashcard {
  term: string;
  definition: string;
}

const Flashcards: React.FC<{ flashcards: Flashcard[], context: any }> = ({ flashcards, context }) => {
  const navigate = useNavigate();
  
  const [flipped, setFlipped] = useState<boolean[]>(
    flashcards.map(() => false)
  );

  const handleFlip = (index: number) => {
    setFlipped((prev) => {
      const newFlipped = [...prev];
      newFlipped[index] = !newFlipped[index];
      return newFlipped;
    });
  };

  return (
    <div className="mb-4">
      <div className="mb-4 w-full flex justify-between items-center">
        <h3 className="text-2xl font-[700] text-primary ">Flashcards</h3>
        <div
        onClick={() => {
          navigate("/flashcard", { state: { context } });
        }}
         className="flex items-center gap-2 group cursor-pointer">
          <h3 className="text-base font-[700] group-hover:text-primary transition-colors">
            Go To Flashcards Room
          </h3>
          <FaArrowRight className="group-hover:text-primary group-hover:animate-wiggle" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {flashcards.map((card, index) => (
          <ReactCardFlip
            key={index}
            isFlipped={flipped[index]}
            flipDirection="horizontal"
          >
            <div
              className="p-4 border rounded-lg shadow-md cursor-pointer bg-white text-center"
              onClick={() => handleFlip(index)}
            >
              <h2 className="font-[700] text-primary text-xl">{card.term}</h2>
            </div>

            <div
              className="p-4 border rounded-lg shadow-md cursor-pointer bg-white text-center"
              onClick={() => handleFlip(index)}
            >
              <p className="font-[700] text-lg text-black">{card.definition}</p>
            </div>
          </ReactCardFlip>
        ))}
      </div>
    </div>
  );
};

export default Flashcards;
