import React from 'react';

const ReasoningDisplay = ({ equation }: { equation: string }) => {
  if (!equation) return null;

  // Split the equation by operators to safely construct the HTML
  const parts = equation.split(/(\s*[\*\+\=]\s*)/);

  const formattedEquation = parts.map((part, index) => {
    if (part.trim() === '*') {
      return `<span key=${index} class="mx-2 text-lg font-normal">×</span>`;
    }
    if (part.trim() === '+') {
      return `<span key=${index} class="mx-2 text-lg font-normal">+</span>`;
    }
    if (part.trim() === '=') {
      return `<span key=${index} class="mx-2 text-lg font-normal">=</span>`;
    }
    return `<span key=${index}>${part}</span>`;
  }).join('');

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
