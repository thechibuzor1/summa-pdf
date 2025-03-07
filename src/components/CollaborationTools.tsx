interface CollaborationToolsProps {
  discussion_prompts: string[];
  group_exercises: string[];
}

const CollaborationTools: React.FC<{ data: CollaborationToolsProps | null }> = ({ data }) => {
  if (!data) {
    return <p className="text-gray-600">No collaboration tools available.</p>;
  }

  return (
    <div className="mb-4 text-start">
      <h3 className="font-medium text-primary">Collaboration Tools</h3>

      <p><strong>Discussion Prompts:</strong></p>
      {data.discussion_prompts.length > 0 ? (
        <ul className="list-disc pl-4">
          {data.discussion_prompts.map((prompt, i) => <li key={i}>{prompt}</li>)}
        </ul>
      ) : (
        <p className="text-gray-600">No discussion prompts available.</p>
      )}

      <p><strong>Group Exercises:</strong></p>
      {data.group_exercises.length > 0 ? (
        <ul className="list-disc pl-4">
          {data.group_exercises.map((exercise, i) => <li key={i}>{exercise}</li>)}
        </ul>
      ) : (
        <p className="text-gray-600">No group exercises available.</p>
      )}
    </div>
  );
};

export default CollaborationTools;
