import React from 'react';

const ReasoningDisplay = ({ reasoning }: { reasoning: string }) => {
  const sections = reasoning.split(/\*\*(.*?)\*\*/).filter(Boolean);

  return (
    <div className="text-sm text-muted-foreground space-y-4">
      {sections.map((section, index) => {
        if (index % 2 === 0) {
          // This is a heading
          const nextContent = sections[index + 1] || '';
          const listItems = nextContent.split('- ').filter(item => item.trim() !== '');
          
          return (
            <div key={index}>
              <h4 className="font-medium text-foreground mb-2">{section.replace(/:/g, '')}</h4>
              {listItems.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {listItems.map((item, itemIndex) => (
                    <li key={itemIndex}>{item.trim()}</li>
                  ))}
                </ul>
              ) : <p>{nextContent.trim()}</p>}
            </div>
          );
        }
        return null; // Skip content parts as they are handled with the headings
      })}
    </div>
  );
};

export default ReasoningDisplay;
