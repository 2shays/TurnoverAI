import React from 'react';

const ReasoningDisplay = ({ reasoning }: { reasoning: string }) => {
  if (!reasoning) return null;

  const equationLine = reasoning.split('\n').find(line => line.startsWith('Predicted Turnover ='));

  if (!equationLine) {
    return (
       <div className="text-sm text-left space-y-4">
         <h4 className="font-semibold text-foreground mb-2">Calculation</h4>
         <p className="text-muted-foreground whitespace-pre-wrap">{reasoning}</p>
      </div>
    );
  }

  // Make it look more like a formula
  const formattedEquation = equationLine
    .replace('Predicted Turnover =', '<span class="font-bold">Predicted Turnover</span> =')
    .replace(/\*/g, '×') // multiply sign
    .replace(/∑/g, '<span class="text-xl">∑</span>');


  return (
    <div className="text-sm text-left space-y-4">
      <h4 className="font-semibold text-foreground mb-2">Calculation</h4>
      <div 
        className="p-4 bg-background rounded-md text-center text-lg font-mono text-foreground"
        dangerouslySetInnerHTML={{ __html: formattedEquation }}
      />
    </div>
  );
};

export default ReasoningDisplay;
