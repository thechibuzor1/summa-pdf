import React, { useCallback, useState } from "react";
import { TbFileUpload } from "react-icons/tb";
import { useDropzone } from "react-dropzone";
import { TiWarningOutline } from "react-icons/ti";
import { ImCancelCircle } from "react-icons/im";
import SummaryCard from "../../../components/SummaryCard";
import { db } from "../../../firebase"; // Firestore instance
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { auth } from "../../../firebase"; // Firebase Auth

function Body() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
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
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB limit
    multiple: false,
  });

  // Function to check if summary already exists
  const summaryExists = async (userId: string, fileName: string, summaryText: string) => {
    const q = query(
      collection(db, "summaries"),
      where("userId", "==", userId),
      where("fileName", "==", fileName),
      where("summary", "==", summaryText)
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Returns true if a matching summary exists
  };

  // Function to save summary to Firestore
  const saveSummaryToFirestore = async (summaryText: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const exists = await summaryExists(user.uid, selectedFile!.name, summaryText);
    if (exists) {
      console.log("Summary already exists, skipping save.");
      return;
    }

    try {
      await addDoc(collection(db, "summaries"), {
        userId: user.uid,
        fileName: selectedFile?.name,
        summary: summaryText,
        timestamp: serverTimestamp(),
      });
      console.log("Summary saved to Firestore!");
    } catch (err) {
      console.error("Error saving summary:", err);
    }
  };

  // Upload file and fetch summary
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

      setSummary(data.summary);
      await saveSummaryToFirestore(data.summary);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      {...getRootProps()}
      className={`flex p-6 flex-col ${
        isDragActive ? "bg-slate-50 border-2" : "bg-inherit border-0"
      } rounded-xl items-center justify-center min-h-[75vh] text-center border-dashed border-gray-300 w-full mx-auto transition`}
    >
      {!selectedFile ? (
        <div className="w-full flex flex-col items-center">
          {isDragActive ? (
            <p className="text-gray-600">Drop the file here ...</p>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-bold">Upload PDF</h1>
              <h2 className="text-sm text-gray-600 text-center">
                Upload a PDF & Get a Smart Summary Instantly
              </h2>

              <button
                className="bg-[#008585] mt-4 rounded-xl text-white text-lg md:text-2xl px-6 md:px-8 py-3 md:py-4 font-semibold cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  open(); // Manually open file picker
                }}
              >
                Select PDF file
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
              className="bg-[#008585] shadow-lg mt-6 rounded-xl text-white text-lg md:text-2xl px-6 md:px-8 py-3 md:py-4 font-semibold"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Summarizing..." : "Get Summary"}
            </button>
          )}

          {error && <p className="text-red-500 mt-4">{error}</p>}

          {(loading || summary) && <SummaryCard fileName={selectedFile.name} text={summary} loading={loading} />}
        </div>
      )}

      <p className="text-[12px] text-gray-500 mt-4">Group8 CSC419 project</p>
    </div>
  );
}

export default Body;
