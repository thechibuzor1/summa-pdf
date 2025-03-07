import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdHistory } from "react-icons/md";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import SummaryCard from "../../../components/SummaryCard";

type Summary = {
  id: string;
  fileName: string;
  summary: string;
};

const BASE_URL = "https://school-aid.onrender.com"; // ✅ Update with your backend URL

function SummaryHistory() {
  const navigate = useNavigate();
  const historyRef = useRef<HTMLDivElement>(null);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Summaries
  useEffect(() => {
    const fetchSummaries = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken"); // ✅ Retrieve token

      try {
        const response = await fetch(`${BASE_URL}/api/v1/summaries`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Send auth token
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch summaries.");
        }

        console.log("Fetched Summaries:", data);

        // ✅ Extract summaries from response
        if (data.status === "success" && data.data.summaries) {
          const formattedSummaries = data.data.summaries.map((item: any) => ({
            id: item.id,
            fileName: item.filename,
            summary: item.content || "Summary not available",
          }));

          setSummaries(formattedSummaries);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, []);

  return (
    <div>
      {/* Clickable Header */}
      <div
        className="flex items-center p-6 hover:bg-slate-100 cursor-pointer gap-1"
        onClick={() => historyRef.current?.scrollIntoView({ behavior: "smooth" })}
      >
        <MdHistory size={30} />
        <h3 className="text-lg font-semibold">History</h3>
      </div>

      {/* History Section */}
      <div ref={historyRef} className="p-6">
        {loading ? (
          <p className="text-gray-500 text-center">Loading summaries...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : summaries.length === 0 ? (
          <p className="text-gray-500 text-center">No summary history found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {summaries.map((item) => (
              <div
                key={item.id}
                className="p-4 border rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedSummary(item)}
              >
                <h4 className="font-medium text-base">{item.fileName}</h4>
                <p className="text-gray-600 mt-1 text-sm line-clamp-2">{item.summary}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Modal */}
      {selectedSummary && (
        <Dialog
          open={!!selectedSummary}
          onClose={() => setSelectedSummary(null)}
          className="fixed inset-0 flex items-center justify-center bg-black/50 p-0 md:p-4"
        >
          <DialogPanel className="bg-white rounded-xl w-full shadow-xl max-h-[80vh] overflow-y-auto p-6">
            <DialogTitle className="text-lg mt-2 text-center font-semibold">
              {selectedSummary.fileName}
            </DialogTitle>

            <SummaryCard fileName={selectedSummary.fileName} text={selectedSummary.summary} loading={false} />
          </DialogPanel>
        </Dialog>
      )}
    </div>
  );
}

export default SummaryHistory;
