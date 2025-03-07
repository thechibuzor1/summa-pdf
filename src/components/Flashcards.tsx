import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";

interface Flashcard {
  term: string;
  definition: string;
}

const Flashcards: React.FC<{ flashcards: Flashcard[] }> = ({ flashcards }) => {
  const [flipped, setFlipped] = useState<boolean[]>(flashcards.map(() => false));

  const handleFlip = (index: number) => {
    setFlipped((prev) => {
      const newFlipped = [...prev];
      newFlipped[index] = !newFlipped[index];
      return newFlipped;
    });
  };

  return (
    <div className="mb-4">
      <h3 className="mb-4 text-2xl font-[700] text-primary ">Flashcards</h3>
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
