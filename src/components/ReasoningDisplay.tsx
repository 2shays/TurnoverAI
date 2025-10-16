import React from 'react';

const ReasoningDisplay = ({ equation }: { equation: string }) => {
  if (!equation) return null;

  // Make it look more like a formula by replacing operators with styled spans
  const formattedEquation = equation
    .replace(/\*/g, '<span class="mx-2 text-lg font-normal">×</span>')
    .replace(/\+/g, '<span class="mx-2 text-lg font-normal">+</span>')
    .replace(/=/g, '<span class="mx-2 text-lg font-normal">=</span>');

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
