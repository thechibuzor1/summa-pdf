import { useState } from "react";

const Quiz: React.FC<{ questions: any[] }> = ({ questions }) => {
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
            <h3 className="font-medium text-[#008585]">Quiz</h3>
            {questions.map((q, index) => (
                <div key={index} className="p-4 text-start border rounded mb-2">
                    <p><strong>{q.question}</strong></p>
                    {q.type === "multiple_choice" && (
                        <ul className="list-disc pl-4">
                            {q.options?.map((option: any, i: number) => (
                                <li key={i}>{option}</li>
                            ))}
                        </ul>
                    )}
                    <button
                        className="mt-2 px-3 py-1 bg-[#008585] font-semibold text-white rounded-lg"
                        onClick={() => toggleAnswer(index)}
                    >
                        {showAnswers[index] ? "Hide Answer" : "Show Answer"}
                    </button>
                    {showAnswers[index] && (
                        <div className="mt-2 p-2 bg-gray-100 border rounded">
                            <p><strong>Answer:</strong> {q.answer}</p>
                            <p className="text-sm text-gray-700">{q.explanation}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
  
  export default Quiz;
  