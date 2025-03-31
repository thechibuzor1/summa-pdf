import React, { useState } from "react";
import StudyGuide from "./StudyGuide";
import Flashcards from "./Flashcards";
import Quiz from "./Quiz";

import { HiOutlineDownload } from "react-icons/hi";
import { jsPDF } from "jspdf";
import Summary from "./Summary";
import { RiChatAiLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import Assistant from "./Assistant";

export interface StudyEnhancerProps {
  response: {
    summary?: {
      key_points: string[];
    };
    flashcards?: {
      term: string;
      definition: string;
    }[];
    quiz?: {
      questions: {
        question: string;
        type: "multiple_choice" | "short_answer";
        options?: string[];
        answer: string;
        explanation: string;
      }[];
    };
    study_guide?: {
      sections: {
        title: string;
        summary: string;
        comparisons?: {
          concept_a: string;
          concept_b: string;
          difference: string;
        }[];
        real_world_applications?: string[];
        common_misconceptions?: {
          misunderstanding: string;
          clarification: string;
        }[];
      }[];
    };
    adaptive_learning?: {
      difficulty_analysis: string;
      recommended_review_topics: string[];
    };
    collaboration_tools?: {
      discussion_prompts: string[];
      group_exercises: string[];
    };
    contextual_enhancements?: {
      historical_context: string;
      real_world_examples: string[];
    };
  };
  fileName: string;
}

const StudyEnhancer: React.FC<StudyEnhancerProps> = ({
  response,
  fileName,
}) => {
  const [showAssistant, setShowAssistant] = useState<boolean>(false);

  if (!response?.study_guide?.sections) {
    return <p>Loading study materials...</p>;
  }

  const handleDownload = () => {
    if (!response || !fileName) return;

    const pdf = new jsPDF();
    const marginLeft = 10;
    const marginTop = 20;
    const pageWidth = pdf.internal.pageSize.width - 20;
    const pageHeight = pdf.internal.pageSize.height;
    const lineHeight = 8;
    let y = marginTop;

    const checkPageLimit = () => {
      if (y + lineHeight > pageHeight - 20) {
        pdf.addPage();
        y = marginTop;
      }
    };

    const addTitle = (title: any, size = 14) => {
      pdf.setFontSize(size);
      checkPageLimit();
      pdf.text(title, marginLeft, y);
      y += lineHeight * 1.5;
      pdf.setFontSize(12);
    };

    const addBulletList = (title: any, items: any) => {
      if (items?.length) {
        addTitle(title);
        items.forEach((item: any) => {
          checkPageLimit();
          const wrappedText = pdf.splitTextToSize(`• ${item}`, pageWidth);
          wrappedText.forEach((line: any) => {
            pdf.text(line, marginLeft, y);
            y += lineHeight;
          });
        });
        y += lineHeight * 0.5;
      }
    };

    const addParagraph = (text: string, bold = false) => {
      if (!text) return;

      pdf.setFont("helvetica", bold ? "bold" : "normal");

      const wrappedText = pdf.splitTextToSize(text, pageWidth); // Ensure proper wrapping

      wrappedText.forEach((line: string) => {
        checkPageLimit(); // Prevents overflow
        pdf.text(line, marginLeft, y);
        y += lineHeight;
      });

      y += lineHeight * 0.5; // Ensure proper spacing between paragraphs
    };

    // **Summary Key Points**
    addBulletList("Summary Key Points", response.summary?.key_points);

    // **Study Guide Sections**
    response.study_guide?.sections?.forEach((section, index) => {
      addTitle(`${index + 1}. ${section.title}`);
      addParagraph(section.summary);

      if (section.comparisons?.length) {
        addTitle("Comparisons", 12);

        section.comparisons.forEach(({ concept_a, concept_b, difference }) => {
          addParagraph(`${concept_a} vs ${concept_b}:`, true); // Bold title
          addParagraph(difference); // Normal text
          y += lineHeight * 0.5; // Slight spacing
        });
      }

      addBulletList("Real-World Applications", section.real_world_applications);
      addBulletList(
        "Common Misconceptions",
        section.common_misconceptions?.map(
          (m) =>
            `Misunderstanding: ${m.misunderstanding}\nClarification: ${m.clarification}`
        )
      );
    });

    // **Flashcards**
    if (response.flashcards?.length) {
      addTitle("Flashcards");

      response.flashcards.forEach(({ term, definition }) => {
        checkPageLimit();

        // Ensure term is bold and properly wrapped
        pdf.setFont("helvetica", "bold");
        const termWrapped = pdf.splitTextToSize(`${term}:`, pageWidth);
        termWrapped.forEach((line: string) => {
          checkPageLimit();
          pdf.text(line, marginLeft, y);
          y += lineHeight;
        });

        // Ensure definition is wrapped properly
        pdf.setFont("helvetica", "normal");
        const definitionWrapped = pdf.splitTextToSize(definition, pageWidth);
        definitionWrapped.forEach((line: string) => {
          checkPageLimit();
          pdf.text(line, marginLeft, y);
          y += lineHeight;
        });

        y += lineHeight * 0.5; // Space between flashcards
      });
    }

    // **Quiz Questions**
    response.quiz?.questions?.forEach((q, index) => {
      addTitle(`Q${index + 1}: ${q.question}`, 12);
      if (q.type === "multiple_choice") {
        q.options?.forEach((option, i) =>
          addParagraph(`${String.fromCharCode(65 + i)}. ${option}`)
        );
      }
      addParagraph(`Answer: ${q.answer}`);
      addParagraph(`Explanation: ${q.explanation}`);
    });

    // **Save PDF**
    const formattedFileName = fileName.replace(/\.[^/.]+$/, "");
    pdf.save(`${formattedFileName}-study-guide.pdf`);
  };

  return (
    <div className="p-6 mt-6 w-full border rounded-xl  md:max-w-[85vw]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg text-start font-[700]">{fileName}</h2>

        <div className="flex gap-2">
          <div className="bg-[#CACACA] flex justify-center items-center rounded-full w-[50px] h-[50px]">
            {showAssistant ? (
              <IoClose
                className="cursor-pointer transition hover:text-primary"
                size={25}
                onClick={() => setShowAssistant(!showAssistant)}
              />
            ) : (
              <RiChatAiLine
                className="cursor-pointer transition hover:text-primary"
                size={25}
                onClick={() => setShowAssistant(!showAssistant)}
              />
            )}{" "}
          </div>
          <div className="bg-[#CACACA] flex justify-center items-center rounded-full w-[50px] h-[50px]">
            <HiOutlineDownload
              className="cursor-pointer transition hover:text-primary"
              size={25}
              onClick={handleDownload}
            />
          </div>
        </div>
      </div>

      <div className={`${!showAssistant && "hidden"}`}>
        <Assistant context={response.summary?.key_points} />
      </div>

      <Summary keyPoints={response.summary?.key_points} />
      <StudyGuide sections={response.study_guide.sections} />
      <Flashcards  context={response.summary?.key_points} flashcards={response?.flashcards || []} />
      <Quiz context={response.summary?.key_points} questions={response?.quiz?.questions || []} />

      </div>
  );
};

export default StudyEnhancer;
