import React from 'react';

const ReasoningDisplay = ({ reasoning }: { reasoning: string }) => {
  if (!reasoning) return null;

  // Split by the bold headings (e.g., **Constants:**)
  const sections = reasoning.split(/\*\*(.*?)\*\*/).filter(Boolean);

  return (
    <div className="text-sm text-left space-y-4">
      {sections.map((section, index) => {
        // This is a heading if its index is even
        if (index % 2 === 0) {
          const content = sections[index + 1] || '';
          const listItems = content.split('- ').filter(item => item.trim() !== '');

          return (
            <div key={index}>
              <h4 className="font-semibold text-foreground mb-2">{section.replace(/:/g, '')}</h4>
              {listItems.length > 0 ? (
                <ul className="list-none pl-4 space-y-1">
                  {listItems.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-muted-foreground">{`- ${item.trim()}`}</li>
                  ))}
                </ul>
              ) : <p className="text-muted-foreground whitespace-pre-wrap">{content.trim()}</p>}
            </div>
          );
        }
        // This is content, which is handled with its heading, so we skip it.
        return null;
      })}
    </div>
  );
};

export default ReasoningDisplay;
