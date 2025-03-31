import React from "react";

export interface SummaryProps {
  keyPoints?: string[];
}

const Summary: React.FC<SummaryProps> = ({ keyPoints }) => {
  if (!keyPoints || keyPoints.length === 0) {
    return null; // Don't render if no key points are available
  }

  return (
    <div className="p-4 mb-4 bg-white shadow-md rounded-lg">
      <h3 className="text-2xl font-[700] text-primary mb-2">Summary</h3>
      <ul className="list-disc list-inside text-gray-700">
        {keyPoints.map((point, index) => (
          <li key={index} className="mb-1 text-start font-[700] text-lg">{point}</li>
        ))}
      </ul>
    </div>
  );
};

export default Summary;
