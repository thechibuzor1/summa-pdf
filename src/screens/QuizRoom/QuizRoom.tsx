import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../Home/components/Header";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { RiArrowGoBackLine } from "react-icons/ri";
import { IoArrowForward } from "react-icons/io5";
import { FaArrowLeftLong } from "react-icons/fa6";
import gears from "../../assets/gears.json";
import Lottie from "react-lottie";
import { FaRegClock } from "react-icons/fa6";

const QUESTION_TIME_LIMIT = 30; // Each question gets 30 seconds

type Question = {
  question: string;
  type: "mcq" | "true_false" | "fill_in_blank";
  choices?: string[];
  correctAnswer: string;
};

function QuizRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const context = location.state?.context || "No context provided.";

  const [quiz, setQuiz] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [userInput, setUserInput] = useState("");

  const [flashColor, setFlashColor] = useState<string>("bg-white");

  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);

  useEffect(() => {
    if (!completed) {
      setTimeLeft(QUESTION_TIME_LIMIT);
    }
  }, [currentIndex, completed]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://summa-pdf-backend.onrender.com/quiz",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ context }),
        }
      );

      const data = await response.json();

      if (typeof data.quiz === "string") {
        const match = data.quiz.match(/```json\n([\s\S]*?)\n```/);
        if (match) {
          const parsedData = JSON.parse(match[1]);

          setQuiz(parsedData.quiz);
        }
      } else if (Array.isArray(data.quiz)) {
        setQuiz(data.quiz);
      } else {
        console.error("Unexpected quiz format:", data.quiz);
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleNextQuestion = () => {
    if (currentIndex + 1 < quiz.length) {
      setCurrentIndex((prev) => prev + 1);
      setUserInput("");
    } else {
      setCompleted(true);
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleNextQuestion();
    }
  }, [timeLeft]);

  // Fetch quiz on component mount
  useEffect(() => {
    fetchQuiz();
  }, [context]);

  // Function to generate a new quiz
  const generateNewQuiz = () => {
    setQuiz([]); // Clear previous quiz
    setCurrentIndex(0); // Reset index
    setScore(0); // Reset score
    setCompleted(false); // Ensure quiz is active
    setUserInput(""); // Clear input

    fetchQuiz();
  };

  const handleAnswer = (answer: string | boolean) => {
    const isCorrect =
      String(quiz[currentIndex].correctAnswer).trim().toLowerCase() ===
      String(answer).trim().toLowerCase();

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    setFlashColor(isCorrect ? "bg-green-300" : "bg-red-300");

    setTimeout(() => {
      setFlashColor("bg-white");
      handleNextQuestion();
    }, 500);
  };

  const percentage = (score / quiz.length) * 100;
  const getColor = (percentage: any) => {
    if (percentage >= 70) return "#4CAF50"; // Green
    if (percentage >= 40) return "#FFC107"; // Yellow
    return "#F44336"; // Red
  };

  const getMessage = (percentage: any) => {
    if (percentage >= 70) return "🎉 Amazing job! Keep it up! 🚀";
    if (percentage >= 40)
      return "😊 Good effort! A little more practice and you'll ace it!";
    return "💪 Don't give up! Keep trying, you'll get the hang of it!";
  };

  const retryQuiz = () => {
    setCompleted(false);
    setCurrentIndex(0);
    setScore(0);
    setUserInput("");
  };

  const [explanations, setExplanations] = useState<{ [key: number]: string }>(
    {}
  );
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const handleExplain = async (
    question: string,
    correctAnswer: string,
    index: number
  ) => {
    setLoadingIndex(index); // Show loading for this question
    try {
      const response = await fetch(
        "https://summa-pdf-backend.onrender.com/explain",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, correctAnswer }),
        }
      );

      const data = await response.json();

      setExplanations((prev) => ({
        ...prev,
        [index]: data.explanation || "No explanation available.",
      }));
    } catch (error) {
      console.error("Error fetching explanation:", error);
      setExplanations((prev) => ({
        ...prev,
        [index]: "Failed to fetch explanation. Please try again later.",
      }));
    } finally {
      setLoadingIndex(null); // Hide loading
    }
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
        <p>Generating questions...</p>
      </>
    );
  } else if (quiz.length === 0) {
    content = <p>No questions available.</p>;
  } else if (completed) {
    content = (
      <div className="bg-white p-6 rounded-lg shadow-lg text-center mt-6 w-[100vw] border  md:max-w-[85vw]">
        <h2 className="text-2xl font-semibold text-primary">Quiz Completed!</h2>

        <div className="w-24 h-24 mt-2 flex justify-center items-center mx-auto">
          <CircularProgressbar
            value={percentage}
            text={`${Math.round(percentage)}%`}
            styles={buildStyles({
              textColor: "#000",
              pathColor: getColor(percentage),
              trailColor: "#e0e0e0",
            })}
          />
        </div>
        <p className="text-lg mt-2 font-700">
          Your Score: {score} / {quiz.length}
        </p>
        <p className="text-center font-medium text-gray-700">
          {getMessage(percentage)}
        </p>

        {/* Displaying all questions with answers */}
        <div className="mt-6 text-left">
          <h3 className="text-xl font-bold mb-3">Review Answers:</h3>
          <div className="space-y-4">
            {quiz.map((q, index) => (
              <div
                key={index}
                className="border p-4 rounded-xl shadow-md bg-slate-100"
              >
                <p className="font-700 text-lg text-gray-800">
                  {index + 1}. {q.question}
                </p>
                <p className="text-green-600 font-700 mt-1">
                  Correct Answer: {q.correctAnswer}
                </p>

                {/* "I don't understand" Button (Hidden if explanation exists) */}
                {!explanations[index] && loadingIndex !== index && (
                  <button
                    className="text-blue-600 mt-2 underline"
                    onClick={() =>
                      handleExplain(q.question, q.correctAnswer, index)
                    }
                  >
                    I don't understand 🙁
                  </button>
                )}

                {/* Loading Indicator */}
                {loadingIndex === index && (
                  <p className="text-gray-500 mt-2">Loading explanation...</p>
                )}

                {/* Display Explanation if Available */}
                {explanations[index] && (
                  <p className="mt-2 text-gray-700">{explanations[index]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Retry Button */}
        <div className="flex flex-col items-center space-y-4 mt-6">
          {/* Retry Quiz Button */}
          <button
            title="retry"
            onClick={retryQuiz}
            className="bg-primary flex gap-1 items-center text-white px-6 py-3 rounded-lg transition hover:bg-primary-dark"
          >
            <RiArrowGoBackLine />
            Retry
          </button>

          {/* Generate New Questions Button */}
          <button
            onClick={generateNewQuiz}
            className="border  flex gap-1 items-center  text-black px-6 py-3 rounded-lg transition hover:bg-secondary-dark"
          >
            Generate New Questions <IoArrowForward />
          </button>
        </div>
      </div>
    );
  } else {
    content = (
      <>
        {/* Progress Bar */}
        <div className="w-full max-w-[90vw] md:max-w-[50vw] h-2 bg-gray-300 rounded-full my-4 relative">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500"
            style={{
              width: `${((currentIndex + 1) / quiz.length) * 100}%`,
            }}
          ></div>
        </div>
        {/* Question Display */}
        <div
          className={`w-[90vw] relative md:max-w-[50vw] h-[300px] md:h-[400px] 
              flex items-center justify-center p-6 sm:p-8 
              ${flashColor} transition-colors duration-500
              text-primary shadow-lg rounded-xl 
              text-center text-2xl sm:text-3xl md:text-4xl font-bold
              break-words overflow-hidden`}
        >
          <div className="max-h-full overflow-auto">
            {/* Quiz Progress */}
            <div className="text-lg font-semibold absolute top-0 right-5 text-gray-700 mt-4">
              {currentIndex + 1} / {quiz.length}
            </div>

            <div className="text-lg flex items-center gap-1 absolute top-0 left-5 font-semibold text-gray-700  mt-4">
              <FaRegClock /> {timeLeft}
            </div>
            {quiz[currentIndex].question}
          </div>
        </div>

        {/* Answer Choices */}
        <div className="mt-4 flex flex-col w-[90vw] md:max-w-[50vw] space-y-2">
          {/* Multiple Choice (MCQ) */}
          {quiz[currentIndex]?.type === "mcq" &&
            quiz[currentIndex]?.choices?.map((choice, index) => (
              <button
                key={index}
                className="bg-white border text-black p-3 rounded-lg hover:bg-primary-dark transition"
                onClick={() => handleAnswer(choice)}
              >
                {choice}
              </button>
            ))}

          {/* True or False */}
          {quiz[currentIndex]?.type === "true_false" && (
            <div className="flex  flex-col justify-center gap-2">
              <button
                className="bg-white border text-black px-6 py-3 rounded-lg  transition"
                onClick={() => handleAnswer("true")}
              >
                True
              </button>
              <button
                className="bg-white border text-black px-6 py-3 rounded-lg transition"
                onClick={() => handleAnswer("false")}
              >
                False
              </button>
            </div>
          )}

          {/* Fill in the Blank */}
          {["fill_in_blank", "fill_in_the_blank"].includes(
            quiz[currentIndex]?.type
          ) && (
            <div className="flex flex-col items-center space-y-3">
              <input
                type="text"
                className="border-2 focus:outline-none border-gray-400 p-3 rounded-lg text-lg w-full text-center block"
                placeholder="Type your answer..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <button
                className={`px-6 py-3 rounded-lg transition ${
                  userInput.trim()
                    ? "bg-primary text-white "
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
                onClick={() => handleAnswer(userInput)}
                disabled={!userInput.trim()}
              >
                Submit Answer
              </button>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <div className=" bg-gray-100">
      <Header />
      <div className="w-fit" onClick={() => navigate(-1)}>
        <h1 className="text-base cursor-pointer items-center gap-2 flex font-[700] text-primary m-6">
          <FaArrowLeftLong /> Quiz Room
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {content}
      </div>
    </div>
  );
}

export default QuizRoom;
