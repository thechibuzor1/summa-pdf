import React, { useCallback, useState } from "react";
import { TbFileUpload } from "react-icons/tb";
import { useDropzone } from "react-dropzone";
import { TiWarningOutline } from "react-icons/ti";
import { ImCancelCircle } from "react-icons/im";
 
 

import RelatedVideos from "../../../components/RelatedVideos";
import StudyEnhancer, {
  StudyEnhancerProps,
} from "../../../components/StudyEnhancer";
import { FiUpload } from "react-icons/fi";
import Scanning from "../../../components/Scanning";

function Body() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<StudyEnhancerProps["response"] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setSummary(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB limit
    multiple: false,
  });
 
  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setSummary(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://192.168.100.77:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to summarize PDF");
      }

      // Ensure data.summary is parsed before setting it
      const parsedSummary = JSON.parse(data.summary);
      setSummary(parsedSummary);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      {...getRootProps()}
      className={`flex py-6 flex-col ${
        isDragActive ? "bg-opacity-20 border-dashed  border-2 " : "bg-opacity-0"
      }  bg-[#008585] rounded-xl items-center justify-center min-h-[75vh] text-center border-gray-400 w-full mx-auto transition`}
    >
      {!selectedFile ? (
        <div className="w-full flex flex-col items-center">
          {isDragActive ? (
            <p className="text-gray-600">Drop the file here...</p>
          ) : (
            <>
              <FiUpload size={40} />
              <p className="mt-4 font-medium">Drop PDF file or browse</p>

              <button
                className="bg-[#008585] mt-4 rounded-lg text-white p-2 text-sm font-medium cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  open(); // Manually open file picker
                }}
              >
                Browse files
              </button>

              <input {...getInputProps()} className="hidden" />

              <div className="flex items-center space-x-1 mt-2 text-red-500">
                <TiWarningOutline size={14} />
                <p className="text-[12px] text-red-500">
                  File size must be less than 5MB
                </p>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          {!loading ? (
            <>
              <ImCancelCircle
                onClick={() => setSelectedFile(null)}
                size={35}
                className="text-red-600 mb-4 cursor-pointer hover:scale-110 transition"
              />
              <TbFileUpload size={50} className="text-[#008585]" />
              <h1 className="text-xl md:text-2xl font-bold text-[#008585] mt-2">
                File Uploaded
              </h1>
              <p className="text-gray-600 mt-1 text-sm break-all text-center px-2">
                {selectedFile.name}
              </p>
              {!summary && (
                <button
                  className="bg-[#008585] shadow-lg mt-6 rounded-xl text-white p-3 font-semibold"
                  onClick={handleUpload}
                  disabled={loading}
                >
                  {loading ? "Summarizing..." : "Get Summary"}
                </button>
              )}
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </>
          ) : (
            <Scanning />
          )}

          {/* {(loading || summary) && (
            <SummaryCard
              fileName={selectedFile.name}
              text={summary}
              loading={loading}
            />
          )} */}

          {summary && <StudyEnhancer response={summary} fileName={selectedFile.name}/>}

          {summary && (
            <RelatedVideos header={summary.study_guide.sections[0]?.title} />
          )}
        </div>
      )}
    </div>
  );
}

export default Body;
