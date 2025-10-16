import React from 'react';
import { formatLargeNumber } from '@/lib/utils';

const ReasoningDisplay = ({ equation }: { equation: string }) => {
  if (!equation) return null;

  // Add the final result to the equation string before splitting.
  const parts = equation.split(/([\*\+\=])/);

  const formattedEquation = parts.map((part, index) => {
    const trimmedPart = part.trim();
    if (trimmedPart === '*') {
      return `<span key=${index} class="mx-2 text-lg font-normal">×</span>`;
    }
    if (trimmedPart === '+') {
      return `<span key=${index} class="mx-2 text-lg font-normal">+</span>`;
    }
    if (trimmedPart === '=') {
      return `<span key=${index} class="mx-2 text-lg font-normal">=</span>`;
    }
    // Check if the part is a number and format it
    if (!isNaN(Number(trimmedPart)) && trimmedPart !== '') {
        // Only format large numbers, not the weights like 0.833
        if (Number(trimmedPart) > 1000) {
            return `<span key=${index}>${formatLargeNumber(Number(trimmedPart))}</span>`;
        }
    }
    // Return original part if it's not a large number (e.g., weights, parentheses)
    return `<span key=${index}>${part}</span>`;
  }).join('');

  return (
    <div className="text-sm text-left space-y-4">
      <h4 className="font-semibold text-foreground mb-2 text-center">Final Calculation</h4>
      <div 
        className="p-4 bg-background rounded-md text-center text-lg font-mono text-foreground flex items-center justify-center flex-wrap"
        dangerouslySetInnerHTML={{ __html: `<span class="font-bold">Predicted Turnover</span>&nbsp;=&nbsp;${formattedEquation}` }}
      />
    </div>
  );
};

export default ReasoningDisplay;
