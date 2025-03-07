import React from "react";
import { jsPDF } from "jspdf";
import Scanning from "./Scanning";
import { HiOutlineDownload } from "react-icons/hi";

function SummaryCard({
  text,
  loading,
  fileName, // Accept fileName as a prop
}: {
  text: string | null;
  loading: boolean;
  fileName: string | null; // Add fileName prop
}) {
  
  const handleDownload = () => {
    if (!text || !fileName) return;

    const pdf = new jsPDF();
    pdf.setFontSize(14);
    pdf.text("Summary:", 10, 10);
    pdf.setFontSize(12);

    const marginLeft = 10;
    const marginTop = 20;
    const pageHeight = pdf.internal.pageSize.height;
    const lineHeight = 8;
    let y = marginTop;

    // Ensure TypeScript recognizes `lines` as an array of strings
    const lines: string[] = pdf.splitTextToSize(text, 180);

    // Properly loop through each line with correct typing
    lines.forEach((line: string) => {
      if (y + lineHeight > pageHeight - 20) {
        pdf.addPage();
        y = marginTop;
      }
      pdf.text(line, marginLeft, y);
      y += lineHeight;
    });

    // Format filename
    const formattedFileName = fileName.replace(/\.[^/.]+$/, ""); // Remove extension
    pdf.save(`${formattedFileName}-summary.pdf`);
  };

  return (
    <div
      className="flex p-6 my-6 w-full md:max-w-[75vw] flex-col 
      bg-primary bg-opacity-5 border rounded-xl justify-center 
      flex-grow shadow-lg border-gray-300 mx-auto transition"
    >
      {loading ? (
        <Scanning /> // Show animation when loading
      ) : text ? (
        <>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg text-start font-semibold text-primary">
              Summary:
            </h3>
            <HiOutlineDownload 
              className="cursor-pointer transition hover:text-primary" 
              size={25} 
              onClick={handleDownload} // Call download function on click
            />
          </div>
          <div className="mt-2 text-left leading-6">
            {text.split("\n").map((paragraph, index) =>
              paragraph.trim() ? (
                <p key={index} className="mb-2 text-sm md:text-base">
                  {paragraph}
                </p>
              ) : null
            )}
          </div>
        </>
      ) : (
        <p className="text-gray-600">No summary available.</p>
      )}
    </div>
  );
}

export default SummaryCard;
