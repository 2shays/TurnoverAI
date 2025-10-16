import React from 'react';
import { formatLargeNumber } from '@/lib/utils';
import { type Source } from '@/app/actions';

const ReasoningDisplay = ({ equation, sources }: { equation: string, sources: Source[] }) => {
  if (!equation || !sources) return null;

  // Extract the variable labels (e.g., Ra, Rb) from the sources
  const labelMap = new Map<string, string>();
  sources.forEach(source => {
    const match = source.name.match(/\((R[a-d])\)/);
    if (match) {
        // This regex finds numbers with or without decimals, and commas
        const valueMatch = source.value.match(/[\d,.]+/);
        if (valueMatch) {
            // Remove commas for clean lookup
            const numericValue = valueMatch[0].replace(/,/g, '');
            labelMap.set(numericValue, match[1]);
        }
    }
  });

  const parts = equation.split(/([\*\+\=\(\)])/);

  let partIndex = 0;
  const formattedEquation = parts.map((part, index) => {
    const trimmedPart = part.trim();
    if (!trimmedPart) return null;

    switch (trimmedPart) {
      case '*':
        return `<span key=${index} class="mx-2 text-lg font-normal">×</span>`;
      case '+':
        return `<span key=${index} class="mx-2 text-lg font-normal">+</span>`;
      case '=':
        return `<span key=${index} class="mx-2 text-lg font-normal">=</span>`;
      case '(':
      case ')':
        return `<span key=${index}>${trimmedPart}</span>`;
      default:
        // This is either a number or a weight
        if (!isNaN(Number(trimmedPart))) {
          const numberValue = Number(trimmedPart);
          if (numberValue > 1000) { // It's a large currency value
            const label = labelMap.get(trimmedPart) || '';
            const labelPrefix = label ? `<span class="text-sm font-semibold text-primary">${label}: </span>` : '';
            partIndex++;
            return `<span key=${index}>${labelPrefix}${formatLargeNumber(numberValue)}</span>`;
          }
          // It's a weight like 0.833
          return `<span key=${index}>${trimmedPart}</span>`;
        }
        // It could be the final result which may already have commas from a previous step
        const cleanedPart = trimmedPart.replace(/,/g, '');
        if (!isNaN(Number(cleanedPart))) {
             if (parts[index-1]?.trim() === '=') {
                 return `<span key=${index} class="font-bold text-primary">${formatLargeNumber(Number(cleanedPart))}</span>`;
             }
             return `<span key=${index}>${formatLargeNumber(Number(cleanedPart))}</span>`
        }

        return `<span key=${index}>${trimmedPart}</span>`;
    }
  }).join('');
  
  const finalHtml = `<span class="font-bold">Predicted Turnover</span>&nbsp;=&nbsp;${formattedEquation}`;

  return (
    <div className="text-sm text-left space-y-4">
      <h4 className="font-semibold text-foreground mb-2 text-center">Final Calculation</h4>
      <div 
        className="p-4 bg-background rounded-md text-center text-lg font-mono text-foreground flex items-center justify-center flex-wrap"
        dangerouslySetInnerHTML={{ __html: finalHtml }}
      />
    </div>
  );
};

export default ReasoningDisplay;
