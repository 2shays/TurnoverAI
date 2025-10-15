import React from 'react';

const ReasoningDisplay = ({ reasoning }: { reasoning: string }) => {
  if (!reasoning) return null;

  // Find the specific line for "Predicted Turnover"
  const lines = reasoning.split('\n');
  const equationLine = lines.find(line => line.trim().startsWith('Predicted Turnover:'));

  // If the line isn't found, render nothing.
  if (!equationLine) {
    return null;
  }

  // Clean up the line to be just the equation part
  const equationOnly = equationLine.replace('Predicted Turnover:', '').trim();

  // Make it look more like a formula by replacing operators with styled spans
  const formattedEquation = equationOnly
    .replace(/\*/g, '<span class="mx-2 text-lg font-normal">×</span>') // multiply sign
    .replace(/\+/g, '<span class="mx-2 text-lg font-normal">+</span>') // plus sign
    .replace(/∑/g, '<span class="text-2xl mr-1">∑</span>') // sigma sign
    .replace(/=/g, '<span class="mx-2 text-lg font-normal">=</span>'); // equals sign


  return (
    <div className="text-sm text-left space-y-4">
      <h4 className="font-semibold text-foreground mb-2 text-center">Final Calculation</h4>
      <div 
        className="p-4 bg-background rounded-md text-center text-lg font-mono text-foreground flex items-center justify-center flex-wrap"
        dangerouslySetInnerHTML={{ __html: `<span class="font-bold">Predicted Turnover</span>&nbsp;${formattedEquation}` }}
      />
    </div>
  );
};

export default ReasoningDisplay;
