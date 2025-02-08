import React, { useCallback, useState } from "react";
import { TbFileUpload } from "react-icons/tb";
import { useDropzone } from "react-dropzone";
import { ImCancelCircle } from "react-icons/im";

function Body() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]); // Set uploaded file
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 5 * 1024 * 1024, // 5MB limit
    multiple: false, // Ensure only one file is selected
  });

  return (
    <div
      {...getRootProps()}
      className={`flex p-6 flex-col ${
        isDragActive ? "bg-slate-50 border-2" : "bg-inherit border-0"
      } rounded-xl items-center justify-center flex-grow text-center border-dashed border-gray-300 w-full mx-auto transition`}
    >
      {!selectedFile ? (
        // File Upload UI
        <div className="w-full flex flex-col items-center">
          {isDragActive ? (
            <p className="text-gray-600">Drop the file here ...</p>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-bold">Upload PDF</h1>
              <h2 className="text-sm text-gray-600 text-center">
                Upload a PDF & Get a Smart Summary Instantly
              </h2>

              {/* ✅ Prevent double triggering by stopping event propagation */}
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

              <p className="text-[12px] text-red-500 mt-2">
                File size must be less than 5MB
              </p>
            </>
          )}
        </div>
      ) : (
        // File Preview & Get Summary Button
        <div className="flex flex-col items-center w-full">
          <ImCancelCircle
            onClick={() => setSelectedFile(null)}
            size={25}
            className="text-red-600 self-end cursor-pointer hover:scale-110 transition"
          />
          <TbFileUpload size={50} className="text-[#008585]" />
          <h1 className="text-xl md:text-2xl font-bold text-[#008585] mt-2">
            File Uploaded
          </h1>
          <p className="text-gray-600 mt-1 text-sm break-all text-center px-2">
            {selectedFile.name}
          </p>

          <button
            className="bg-[#008585] mt-6 rounded-xl text-white text-lg md:text-2xl px-6 md:px-8 py-3 md:py-4 font-semibold"
            onClick={() =>
              console.log("Generating summary for:", selectedFile.name)
            }
          >
            Get Summary
          </button>
        </div>
      )}

      <p className="text-[12px] text-gray-500 mt-4">Group8 CSC419 project</p>
    </div>
  );
}

export default Body;
