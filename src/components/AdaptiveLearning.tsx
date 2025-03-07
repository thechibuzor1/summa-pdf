interface AdaptiveLearningProps {
  difficulty_analysis: string;
  recommended_review_topics: string[];
  suggested_resources: string[];
}

const AdaptiveLearning: React.FC<{ data: AdaptiveLearningProps | null }> = ({ data }) => {
  if (!data) {
    return <p className="text-gray-600">No adaptive learning data available.</p>;
  }

  return (
    <div className="mb-4 text-start">
      <h3 className="font-medium text-primary">Adaptive Learning</h3>
      <p><strong>Difficulty Analysis:</strong> {data.difficulty_analysis}</p>
      <p><strong>Recommended Topics:</strong> {data.recommended_review_topics.length > 0 ? data.recommended_review_topics.join(", ") : "None"}</p>
      <p><strong>Resources:</strong> {data.suggested_resources.length > 0 ? data.suggested_resources.join(", ") : "None"}</p>
    </div>
  );
};

export default AdaptiveLearning;
