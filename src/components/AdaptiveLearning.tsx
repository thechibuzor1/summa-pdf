const AdaptiveLearning: React.FC<{ data: any }> = ({ data }) => (
    <div className="mb-4 text-start">
      <h3 className="font-medium text-[#008585]">Adaptive Learning</h3>
      <p><strong>Difficulty Analysis:</strong> {data.difficulty_analysis}</p>
      <p><strong>Recommended Topics:</strong> {data.recommended_review_topics.join(", ")}</p>
      <p><strong>Resources:</strong> {data.suggested_resources.join(", ")}</p>
    </div>
  );
  
  export default AdaptiveLearning;
  