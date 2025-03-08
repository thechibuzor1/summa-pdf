import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdHistory } from "react-icons/md";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import SummaryCard from "../../../components/SummaryCard";
import StudyEnhancer, { StudyEnhancerProps } from "../../../components/StudyEnhancer";
import RelatedVideos from "../../../components/RelatedVideos";

 

const BASE_URL = "https://school-aid.onrender.com"; // ✅ Update with your backend URL

function SummaryHistory() {
  const navigate = useNavigate();
  const historyRef = useRef<HTMLDivElement>(null);
 
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

   const [selectedSummary, setSelectedSummary] = useState<any>();
   const [selectedFileName, setSelectedFileName] = useState<string>("")

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
      

        // Extract summaries from response
        if (data.status === "success" && data.data.data.summaries) {
          const formattedSummaries = data.data.data.summaries.map((item: any) => ({
            id: item.id,
            fileName: item.filename,
            date: item.createdAt
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

  async function fectchById(id:string){
    
      setError(null);

      const token = localStorage.getItem("authToken"); // ✅ Retrieve token

      try {
        const response = await fetch(`${BASE_URL}/api/v1/summaries/${id}`, {
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

        if(data.status === "success" && data.data){
          setSelectedSummary(JSON.parse(data.data.summary.content));
          setSelectedFileName(data.data.summary.filename);
        }
    
       
         
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
  
  };



  const renderSummaryContent = () => {
    if (loading) {
      return <p className="text-gray-500 text-center">Loading summaries...</p>;
    }
    if (error) {
      return <p className="text-red-500 text-center">{error}</p>;
    }
    if (summaries.length === 0) {
      return <p className="text-gray-500 text-center">No summary history found.</p>;
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {summaries.map((item: any) => (
          
          <div
            key={item.id}
            className="p-4 border rounded-lg transition cursor-pointer "
            onClick={() => fectchById(item.id)}
          >
             
            <h4 className="font-[700] text-black text-base">{item.fileName}</h4>
            <p className="font-medium text-sm">{new Date(item.date).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                  })}</p>
          </div>
        ))}
      </div>
    );
  };
  
  
  


  return (
    <div>
      {/* Clickable Header */}
      <div
        className="flex items-center p-6 md:px-12 hover:bg-slate-100 cursor-pointer gap-1"
        onClick={() => historyRef.current?.scrollIntoView({ behavior: "smooth" })}
      >
         <MdHistory size={30} />
        <h3 className="text-lg font-[700]">History</h3>
      </div>

    
      {selectedSummary ? (
        <div className="flex flex-col items-center justify-center rounded-lg">
           <button
                  className="bg-primary shadow-lg mt-6 rounded-lg text-white p-2 px-6 font-[600]"
                  onClick={() => setSelectedSummary(null)}
                  disabled={loading}
                >
                 Close
                </button>
        <StudyEnhancer response={selectedSummary} fileName={selectedFileName} />
        <RelatedVideos header={selectedSummary?.study_guide!.sections[0]?.title} />
        </div>
       
      ) :
      
      <div ref={historyRef} className="p-6 md:px-12">{renderSummaryContent()}</div>

    }
    </div>
  );
}

export default SummaryHistory;
