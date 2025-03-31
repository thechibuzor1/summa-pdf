import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface QuizProps {
  questions: {
    question: string;
    type: "multiple_choice" | "true_false" | "short_answer";
    options?: string[]; // Ensure this remains optional
    answer: string;
    explanation: string;
  }[];
  context: any;
}

const Quiz: React.FC<QuizProps> = ({ questions, context }) => {
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState<boolean[]>(
    Array(questions.length).fill(false)
  );

  const toggleAnswer = (index: number) => {
    setShowAnswers((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  return (
    <div className="mb-4 p-4 border rounded-lg">
      <div className="mb-4 w-full flex justify-between items-center">
        <h3 className="text-2xl font-[700] text-primary ">Quiz</h3>
        <div
          onClick={() => {
            navigate("/quiz", { state: { context } });
          }}
          
          className="flex items-center gap-2 group cursor-pointer"
        >
          <h3 className="text-base font-[700] group-hover:text-primary transition-colors">
            Go To Quiz Room
          </h3>
          <FaArrowRight className="group-hover:text-primary group-hover:animate-wiggle" />
        </div>
      </div>
      {questions.length === 0 ? (
        <p className="text-gray-600">No quiz questions available.</p>
      ) : (
        questions.map((q, index) => (
          <div key={index} className="p-4 text-start border rounded mb-2">
            <p className="font-[700] text-lg text-black">
              <strong>{q.question}</strong>
            </p>

            {/* Multiple Choice Options (Check if options exist before mapping) */}
            {q.type === "multiple_choice" && q.options?.length ? (
              <ul className="list-disc pl-4">
                {q.options.map((option, i) => (
                  <li className="font-[700] text-lg text-black" key={i}>
                    {option}
                  </li>
                ))}
              </ul>
            ) : null}

            {/* Show/Hide Answer Button */}
            <button
              className="mt-2 px-6 py-2 bg-primary font-[700] text-white rounded-lg"
              onClick={() => toggleAnswer(index)}
            >
              {showAnswers[index] ? "Hide Answer" : "Show Answer"}
            </button>

            {/* Answer & Explanation */}
            {showAnswers[index] && (
              <div className="mt-2 p-2 bg-gray-100 border rounded">
                <p className="font-[700] text-lg text-primary">
                  <strong>Correct Answer</strong> {q.answer}
                </p>
                <p className="font-[700] text-lg text-gray-700">
                  {q.explanation}
                </p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Quiz;
