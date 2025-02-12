import React, { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import YouTube from "react-youtube";

interface Video {
  title: string;
  videoId: string;
}

const RelatedVideos: React.FC<{ header: string }> = ({ header }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!header) return;

      setLoading(true);
      setError(null);

      try {
        const searchQuery = encodeURIComponent(header);
        const response = await fetch(
          `https://corsproxy.io/?https://www.youtube.com/results?search_query=${searchQuery}`
        );

        const text = await response.text();

        // Improve regex to correctly extract unique video IDs and titles
        const videoRegex = /"videoId":"(.*?)".*?"title":\{"runs":\[\{"text":"(.*?)"\}/g;
        const matches = Array.from(text.matchAll(videoRegex));

        // Use a Set to ensure unique videos
        const uniqueVideos = new Map();

        matches.forEach((match) => {
          const videoId = match[1];
          const title = match[2];

          if (!uniqueVideos.has(videoId)) {
            uniqueVideos.set(videoId, title);
          }
        });

        // Convert Map to an array and slice to get top 8 results
        const videoList = Array.from(uniqueVideos.entries())
          .map(([videoId, title]) => ({ title, videoId }))
          .slice(0, 8);

        setVideos(videoList);
      } catch (err) {
        setError("Failed to load videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [header]);

  return (
    <div className="mt-6 w-full">
      <h2 className="text-2xl font-semibold mb-4">Related Videos</h2>
      {loading && <p className="text-gray-600">Loading videos...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {selectedVideo ? (
        <div className="w-full h-full flex  flex-col  items-center">
          <div className="">
            <YouTube videoId={selectedVideo} className="w-full h-full" />
          </div>
          <button
            className="mt-4 px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
            onClick={() => setSelectedVideo(null)}
          >
            Close Player
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {videos.map((video, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-2 cursor-pointer"
              onClick={() => setSelectedVideo(video.videoId)}
            >
              <div className="relative group">
                <img
                  src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-auto rounded-md object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition">
                  <FaPlay className="text-white text-3xl" />
                </div>
              </div>
              <p className="mt-2 text-sm font-semibold m-2 truncate">
                {video.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedVideos;
