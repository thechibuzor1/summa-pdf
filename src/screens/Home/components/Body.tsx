import React, { useCallback, useState } from "react";
 import { useDropzone } from "react-dropzone";

import upload from "../../../assets/upload.svg"

import RelatedVideos from "../../../components/RelatedVideos";
import StudyEnhancer, {
  StudyEnhancerProps,
} from "../../../components/StudyEnhancer";
import Scanning from "../../../components/Scanning";
import { BASE_URL } from "../../Auth/Auth";


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
        const response = await fetch("https://summa-pdf-backend.onrender.com/upload", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to summarize PDF");
        }

        const rawText = data.summary.candidates[0].content.parts[0].text;

        // Extract the JSON portion safely using regex
        const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);

        if (jsonMatch[1]) {
            try {
                const parsedData = JSON.parse(jsonMatch[1]); // Parse JSON
                setSummary(parsedData);
                
                // Save the summary via API call'
                await saveSummary(parsedData, selectedFile.name)

            } catch (error) {
                console.error("JSON Parsing Error:", error);
            }
        } else {
            console.error("JSON block not found in response.");
        }
    } catch (err: any) {
        setError(err.message || "Something went wrong.");
    } finally {
        setLoading(false);
    }
};

// Function to save summary
const saveSummary = async (parsedData: any, filename: string) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
      console.error("No auth token found. Cannot save summary.");
      return;
  }

  try {
      const response = await fetch(`${BASE_URL}/api/v1/summaries`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
              filename: filename,
              content:  JSON.stringify(parsedData),
          })
      });

      const result = await response.json();

      if (!response.ok) {
          console.error("Full API response:", result); 
          throw new Error(result.error || "Failed to save summary.");
      }

      console.log("Summary saved successfully:", result);
  } catch (error) {
      console.error("Error saving summary:", error);
  }
};

  return (
    <div
      {...getRootProps()}
      className={`flex py-6 flex-col ${
        isDragActive ? "border-dashed  border-2 " : ""
      }  
        
      
      rounded-xl items-center justify-center min-h-[75vh] text-center border-gray-400 w-full mx-auto transition`}
    >
      {!selectedFile ? (
        <div className="w-full flex flex-col items-center">
          {isDragActive ? (
            <p className="text-gray-600">Drop the file here...</p>
          ) : (
            <>
             {/*  <FiUpload size={40} /> */}
              <p className="mt-4 text-lg  font-[700]">Drag & drop or browse to upload a file</p>
                <p>(Max File Size: 5MB)</p>
              <button
                className="bg-primary mt-8 rounded-lg text-white p-2 px-6 text-sm font-[600] cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  open(); // Manually open file picker
                }}
              >
                Browse files
              </button>

              <input {...getInputProps()} className="hidden" />

               
            </>
          )}
        </div>
      ) : (
        <div className={`flex flex-col items-center justify-center rounded-lg`}>
          {!loading ? (
            <>
               
              <div className="bg-primary rounded-full flex justify-center items-center w-[50px] h-[50px]"> 
                <img alt="upload" src={upload} className="w-25 h-25" />
                </div>
             
              <h1 className="text-xl md:text-2xl font-[900] mt-2">
                File Uploaded
              </h1>
              <p className="mt-1 break-all font-[700] text-center px-2">
                {selectedFile.name}
              </p>
              {!summary? (
                <button
                  className="bg-primary shadow-lg mt-6 rounded-lg text-white p-2 px-6 font-[600]"
                  onClick={handleUpload}
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Get Study Guide"}
                </button>
              ): <button
                  className="bg-primary shadow-lg mt-6 rounded-lg text-white p-2 px-6 font-[600]"
                  onClick={() => setSelectedFile(null)}
                  disabled={loading}
                >
                 Close
                </button>
              }
             
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </>
          ) : (
            <Scanning />
          )}
          {summary && (
            <StudyEnhancer response={summary} fileName={selectedFile.name} />
          )}

          {summary && (
            <RelatedVideos header={summary?.study_guide!.sections[0]?.title} />
          )}
        </div>
      )}
    </div>
  );
}

export default Body;
