import { useState } from "react";

interface QuizProps {
  questions: {
    question: string;
    type: "multiple_choice" | "true_false" | "short_answer";
    options?: string[]; // Ensure this remains optional
    answer: string;
    explanation: string;
  }[];
}

const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [showAnswers, setShowAnswers] = useState<boolean[]>(Array(questions.length).fill(false));

  const toggleAnswer = (index: number) => {
    setShowAnswers((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  return (
    <div className="mb-4 p-4 border rounded-lg">
      <h3 className="text-2xl font-[700] text-primary  mb-4">Quiz</h3>
      {questions.length === 0 ? (
        <p className="text-gray-600">No quiz questions available.</p>
      ) : (
        questions.map((q, index) => (
          <div key={index} className="p-4 text-start border rounded mb-2">
            <p className="font-[700] text-lg text-black"><strong>{q.question}</strong></p>

            {/* Multiple Choice Options (Check if options exist before mapping) */}
            {q.type === "multiple_choice" && q.options?.length ? (
              <ul className="list-disc pl-4">
                {q.options.map((option, i) => (
                  <li className="font-[700] text-lg text-black" key={i}>{option}</li>
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
                <p className="font-[700] text-lg text-primary"><strong>Correct Answer</strong> {q.answer}</p>
                <p className="font-[700] text-lg text-gray-700">{q.explanation}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Quiz;
