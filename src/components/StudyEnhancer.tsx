import React from "react";
import StudyGuide from "./StudyGuide";
import Flashcards from "./Flashcards";
import Quiz from "./Quiz";
import AdaptiveLearning from "./AdaptiveLearning";
import CollaborationTools from "./CollaborationTools";
import ContextualEnhancements from "./ContextualEnhancements";
import { HiOutlineDownload } from "react-icons/hi";
import { jsPDF } from "jspdf";


export interface StudyEnhancerProps {
  response: {
    study_guide: {
      sections: {
        title: string;
        content: string;
        key_takeaways: string[];
        misconceptions: { misunderstanding: string; clarification: string }[];
        real_world_applications: string[];
        diagrams: string[];
      }[];
    };
    flashcards: { term: string; definition: string }[];
    quiz: {
      questions: {
        question: string;
        type: string;
        options?: string[];
        answer: string;
        explanation: string;
      }[];
    };
    adaptive_learning: {
      difficulty_analysis: string;
      recommended_review_topics: string[];
      suggested_resources: string[];
    };
    collaboration_tools: {
      discussion_prompts: string[];
      group_exercises: string[];
    };
    contextual_enhancements: {
      visual_aids: string[];
      historical_context: string;
      real_world_examples: string[];
    };
  };
  fileName: string;
}

const StudyEnhancer: React.FC<StudyEnhancerProps> = ({ response, fileName }) => {
  if (
    !response ||
    !response.study_guide ||
    !response.study_guide.sections ||
    !Array.isArray(response.study_guide.sections)
  ) {
    return <p>Loading study materials...</p>; // Prevent crash if data is missing
  }

  const handleDownload = () => {
    if (!response || !fileName) return;

    const pdf = new jsPDF();
    const marginLeft = 10;
    const marginTop = 20;
    const pageHeight = pdf.internal.pageSize.height;
    const lineHeight = 8;
    let y = marginTop;

    const addSectionTitle = (title: string) => {
      pdf.setFontSize(14);
      if (y + lineHeight > pageHeight - 20) {
        pdf.addPage();
        y = marginTop;
      }
      pdf.text(title, marginLeft, y);
      y += lineHeight;
      pdf.setFontSize(12);
    };

    const addText = (text: string) => {
      const lines = pdf.splitTextToSize(text, 180);
      lines.forEach((line:any) => {
        if (y + lineHeight > pageHeight - 20) {
          pdf.addPage();
          y = marginTop;
        }
        pdf.text(line, marginLeft, y);
        y += lineHeight;
      });
    };

    // Add Study Guide Sections
    addSectionTitle("Study Guide");
    response.study_guide.sections.forEach((section: any, index: number) => {
      addSectionTitle(`${index + 1}. ${section.title}`);
      addText(section.content);
      addSectionTitle("Key Takeaways:");
      section.key_takeaways.forEach((point: string) => addText(`- ${point}`));

      if (section.misconceptions.length > 0) {
        addSectionTitle("Common Misconceptions:");
        section.misconceptions.forEach((m: any) =>
          addText(`Misunderstanding: ${m.misunderstanding}\nClarification: ${m.clarification}`)
        );
      }

      if (section.real_world_applications.length > 0) {
        addSectionTitle("Real-World Applications:");
        section.real_world_applications.forEach((app: string) =>
          addText(`- ${app}`)
        );
      }
    });

    // Add Flashcards
    addSectionTitle("Flashcards");
    response.flashcards.forEach((flashcard: any) => {
      addText(`${flashcard.term}: ${flashcard.definition}`);
    });

    // Add Quiz Questions
    addSectionTitle("Quiz Questions");
    response.quiz.questions.forEach((q: any, index: number) => {
      addText(`${index + 1}. ${q.question}`);
      if (q.options) {
        q.options.forEach((option: string, i: number) =>
          addText(`${String.fromCharCode(65 + i)}. ${option}`)
        );
      }
      addText(`Answer: ${q.answer}`);
      addText(`Explanation: ${q.explanation}`);
    });

    // Add Adaptive Learning
    addSectionTitle("Adaptive Learning");
    addText(`Difficulty Analysis: ${response.adaptive_learning.difficulty_analysis}`);
    addSectionTitle("Recommended Review Topics:");
    response.adaptive_learning.recommended_review_topics.forEach((topic: string) => addText(`- ${topic}`));

    // Add Collaboration Tools
    addSectionTitle("Collaboration Tools");
    addSectionTitle("Discussion Prompts:");
    response.collaboration_tools.discussion_prompts.forEach((prompt: string) => addText(`- ${prompt}`));
    addSectionTitle("Group Exercises:");
    response.collaboration_tools.group_exercises.forEach((exercise: string) => addText(`- ${exercise}`));

    // Add Contextual Enhancements
    addSectionTitle("Contextual Enhancements");
    addText(`Historical Context: ${response.contextual_enhancements.historical_context}`);
    addSectionTitle("Real-World Examples:");
    response.contextual_enhancements.real_world_examples.forEach((example: string) => addText(`- ${example}`));

    // Format and save the file
    const formattedFileName = fileName.replace(/\.[^/.]+$/, ""); // Remove extension
    pdf.save(`${formattedFileName}-study-guide.pdf`);
  };
 
  return (
    <div className="p-4 mt-6 w-full border rounded-xl shadow-lg bg-[#008585] bg-opacity-5 md:max-w-[75vw]">
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl text-start font-semibold">
        Interactive Study Tools
      </h2>
        <HiOutlineDownload
          className="cursor-pointer transition hover:text-[#008585]"
          size={30}
          onClick={handleDownload} // Call download function on click
        />
      </div>

      <StudyGuide sections={response.study_guide.sections} />
      <Flashcards flashcards={response.flashcards || []} />
      <Quiz questions={response.quiz?.questions || []} />
      <AdaptiveLearning data={response.adaptive_learning || {}} />
      <CollaborationTools data={response.collaboration_tools || {}} />
      <ContextualEnhancements data={response.contextual_enhancements || {}} />
    </div>
  );
};

export default StudyEnhancer;
