import React from 'react';

const ReasoningDisplay = ({ reasoning }: { reasoning: string }) => {
  if (!reasoning) return null;

  const equationLine = reasoning.split('\n').find(line => line.startsWith('Predicted Turnover:'));

  if (!equationLine) {
    return (
       <div className="text-sm text-left space-y-4">
         <h4 className="font-semibold text-foreground mb-2">Calculation</h4>
         <p className="text-muted-foreground whitespace-pre-wrap">{reasoning}</p>
      </div>
    );
  }

  // Make it look more like a formula by replacing operators with styled spans
  const formattedEquation = equationLine
    .replace('Predicted Turnover:', '<span class="font-bold">Predicted Turnover</span> =')
    .replace(/\*/g, '<span class="mx-2 text-lg font-normal">×</span>') // multiply sign
    .replace(/\+/g, '<span class="mx-2 text-lg font-normal">+</span>') // plus sign
    .replace(/∑/g, '<span class="text-2xl mr-1">∑</span>'); // sigma sign


  return (
    <div className="text-sm text-left space-y-4">
      <h4 className="font-semibold text-foreground mb-2 text-center">Final Calculation</h4>
      <div 
        className="p-4 bg-background rounded-md text-center text-lg font-mono text-foreground flex items-center justify-center"
        dangerouslySetInnerHTML={{ __html: formattedEquation }}
      />
    </div>
  );
};

export default ReasoningDisplay;
