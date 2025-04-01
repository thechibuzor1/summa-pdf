import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactCardFlip from "react-card-flip";
import Header from "../Home/components/Header";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import Lottie from "react-lottie";
import gears from "../../assets/gears.json";

function FlashcardRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const context = location.state?.context;
  const [flashcards, setFlashcards] = useState<
    { term: string; definition: string }[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!context) return;

      try {
        const response = await fetch(
          "https://summa-pdf-backend.onrender.com/flashcards",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ context }),
          }
        );

        const data = await response.json();

        if (typeof data.flashcards === "string") {
          const match = data.flashcards.match(/```json\n([\s\S]*?)\n```/);
          if (match) {
            const parsedData = JSON.parse(match[1]);
            setFlashcards(parsedData.flashcards);
          }
        } else if (Array.isArray(data.flashcards)) {
          setFlashcards(data.flashcards);
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [context]);

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentIndex(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length
    );
  };

  const lottieOptions = {
    loop: true, // Stop animation at last stage
    autoplay: true,
    animationData: gears,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };
  let content;

  if (loading) {
    content = (
      <>
        <Lottie options={lottieOptions} height={250} width={250} />
        <p>Generating flashcards...</p>
      </>
    );
  } else if (flashcards.length === 0) {
    content = <p>No flashcards available.</p>;
  } else {
    content = (
      <>
        {/* Progress Bar */}
        <div className="w-full max-w-[90vw] md:max-w-[50vw] h-2 bg-gray-300 rounded-full my-4 relative">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500"
            style={{
              width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
            }}
          ></div>
        </div>

        {/* Flashcard Content */}
        <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
          {/* Front Side */}
          <div
            className="w-[90vw] md:max-w-[50vw] h-[300px] md:h-[400px] 
             flex items-center justify-center p-6 sm:p-8 
             bg-white text-primary shadow-lg rounded-xl 
             text-center text-2xl sm:text-3xl md:text-4xl font-bold cursor-pointer
             break-words overflow-hidden"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="max-h-full overflow-auto">
              {flashcards[currentIndex].term}
            </div>
          </div>

          {/* Back Side */}
          <div
            className="w-[90vw] md:max-w-[50vw] h-[300px] md:h-[400px] 
             flex items-center justify-center p-6 sm:p-8 
             bg-primary text-white shadow-lg rounded-xl 
             text-center text-xl sm:text-2xl md:text-3xl font-medium cursor-pointer
             break-words overflow-hidden"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="max-h-full overflow-auto">
              {flashcards[currentIndex].definition}
            </div>
          </div>
        </ReactCardFlip>

        {/* Flashcard Progress */}
        <div className="text-lg font-semibold text-gray-700 mt-4">
          {flashcards.length > 0 ? currentIndex + 1 : 0} / {flashcards.length}
        </div>

        {/* Controls */}
        <div className="flex gap-4 mt-6">
          <button
            title="prev"
            onClick={prevCard}
            className="bg-gray-700 text-white px-8 py-4 rounded-xl shadow-md hover:bg-gray-900 transition"
          >
            <FaArrowLeftLong />
          </button>
          <button
            title="next"
            onClick={nextCard}
            className="bg-primary text-white px-8 py-4 rounded-xl shadow-md hover:bg-primary-dark transition"
          >
            <FaArrowRightLong />
          </button>
        </div>
      </>
    );
  }

  return (
    <div className=" bg-gray-100">
      <Header />
      <div className="w-fit" onClick={() => navigate(-1)}>
        <h1 className="text-base cursor-pointer items-center gap-2 flex font-[700] text-primary m-6">
          <FaArrowLeftLong /> Flashcards Room
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {content}
      </div>
    </div>
  );
}

export default FlashcardRoom;
