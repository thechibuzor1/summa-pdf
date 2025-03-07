interface ContextualEnhancementsProps {
  visual_aids: string[];
  historical_context: string;
  real_world_examples: string[];
}

const ContextualEnhancements: React.FC<{ data: ContextualEnhancementsProps | null }> = ({ data }) => {
  if (!data) {
    return <p className="text-gray-600">No contextual enhancements available.</p>;
  }

  return (
    <div className="mb-4 text-start">
      <h3 className="font-medium text-primary">Contextual Enhancements</h3>

      <p><strong>Visual Aids:</strong> {data.visual_aids.length > 0 ? data.visual_aids.join(", ") : "None available."}</p>
      
      <p><strong>Historical Context:</strong> {data.historical_context || "No historical context provided."}</p>
      
      <p><strong>Real-World Examples:</strong></p>
      {data.real_world_examples.length > 0 ? (
        <ul className="list-disc pl-4">
          {data.real_world_examples.map((example, i) => <li key={i}>{example}</li>)}
        </ul>
      ) : (
        <p className="text-gray-600">No real-world examples available.</p>
      )}
    </div>
  );
};

export default ContextualEnhancements;
