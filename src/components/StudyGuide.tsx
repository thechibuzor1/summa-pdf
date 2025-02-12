const StudyGuide: React.FC<{ sections: any[] }> = ({ sections }) => (
    <div className="mb-4">
      <h3 className="font-medium text-[#008585]">Study Guide</h3>
      {sections.map((section, index) => (
        <div key={index} className="border p-4 rounded mb-2">
          <h4 className="font-semibold mb-2">{section.title}</h4>
          <p className="text-start">{section.content}</p>
          <ul className="list-disc mt-2 pl-4">
            {section.key_takeaways.map((point:any, i:number) => <li className="font-semibold text-start" key={i}>{point}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
  
  export default StudyGuide;
  