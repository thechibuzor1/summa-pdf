const ContextualEnhancements: React.FC<{ data: any }> = ({ data }) => (
    <div className="mb-4 text-start">
      <h3 className="font-medium text-[#008585]">Contextual Enhancements</h3>
      <p><strong>Visual Aids:</strong> {data.visual_aids.join(", ")}</p>
      <p><strong>Historical Context:</strong> {data.historical_context}</p>
      <p><strong>Real-World Examples:</strong></p>
      <ul className="list-disc pl-4">{data.real_world_examples.map((q:any, i:number) => <li key={i}>{q}</li>)}</ul>
    </div>
  );
  
  export default ContextualEnhancements;
  