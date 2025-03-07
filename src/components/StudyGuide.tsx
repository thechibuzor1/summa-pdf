import React from "react";

interface Section {
  title: string;
  summary: string;
  key_takeaways?: string[];
  comparisons?: { concept_a: string; concept_b: string; difference: string }[];
  real_world_applications?: string[];
  common_misconceptions?: { misunderstanding: string; clarification: string }[];
}

interface StudyGuideProps {
  sections?: Section[];
}

const StudyGuide: React.FC<StudyGuideProps> = ({ sections = [] }) => {
  if (!sections.length) return <p className="text-gray-500">No study guide available.</p>;

  return (
    <div className="mb-4">
  <h3 className="text-2xl mb-4 font-[700] text-primary">Study Guide</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {sections.map((section, index) => (
      <div key={index} className="border p-6 rounded-lg bg-[#f2f2f2]">
        <h4 className="font-[900] text-start text-lg mb-2 underline">{section.title}</h4>
        <p className="text-start mb-4 font-[700] text-lg text-black">{section.summary}</p>

        {section.key_takeaways && section.key_takeaways.length > 0 && (
          <>
            <h5 className="mt-3 text-start font-semibold underline">Key Takeaways:</h5>
            <ul className="list-disc mt-2 pl-4">
              {section.key_takeaways.map((point, i) => (
                <li key={i} className="text-start font-[700] text-lg">{point}</li>
              ))}
            </ul>
          </>
        )}

        {section.common_misconceptions && section.common_misconceptions.length > 0 && (
          <>
            <h5 className="mt-3 text-start font-[900] text-lg underline">Common Misconceptions:</h5>
            <ul className="list-disc mt-2 pl-4  mb-4">
              {section.common_misconceptions.map((m, i) => (
                <li key={i} className="text-start font-[700] text-lg">
                  <strong>Misunderstanding:</strong> {m.misunderstanding}
                  <br />
                  <strong>Clarification:</strong> {m.clarification}
                </li>
              ))}
            </ul>
          </>
        )}

        {section.real_world_applications && section.real_world_applications.length > 0 && (
          <>
            <h5 className="mt-3 text-start font-[900] text-lg underline">Real-World Applications:</h5>
            <ul className="list-disc mt-2 pl-4">
              {section.real_world_applications.map((example, i) => (
                <li key={i} className="text-start font-[700] text-lg">{example}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    ))}
  </div>
</div>

  );
};

export default StudyGuide;
