const CollaborationTools: React.FC<{ data: any }> = ({ data }) => (
    <div className="mb-4 text-start">
      <h3 className="font-medium text-[#008585]">Collaboration Tools</h3>
      <p><strong>Discussion Prompts:</strong></p>
      <ul className="list-disc pl-4">{data.discussion_prompts.map((q:any, i:number) => <li key={i}>{q}</li>)}</ul>
      <p><strong>Group Exercises:</strong></p>
      <ul className="list-disc pl-4">{data.group_exercises.map((q:any, i:number) => <li key={i}>{q}</li>)}</ul>
    </div>
  );
  
  export default CollaborationTools;
  