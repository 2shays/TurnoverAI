import React from 'react';
import { formatLargeNumber } from '@/lib/utils';

const Equation = ({ text }: { text: string }) => {
  if (!text) return null;

  // Handle division first as it's a structural change
  if (text.includes('/')) {
    const parts = text.split('/');
    const numerator = parts[0].trim();
    const denominator = parts[1].trim();
    return (
      <div className="inline-flex flex-col items-center justify-center font-mono">
        <span className="px-2 pb-1 whitespace-nowrap">
          <Equation text={numerator} />
        </span>
        <span className="w-full border-b border-foreground"></span>
        <span className="px-2 pt-1">
          <Equation text={denominator} />
        </span>
      </div>
    );
  }

  // Handle other formatting for non-division strings
  const processChunk = (chunk: string) => {
    const cleanedChunk = chunk.trim();
    // Format numbers with Indian numbering system, but ignore numbers with decimals (weights) and non-numeric parts
    const isNumeric = !isNaN(parseFloat(cleanedChunk)) && isFinite(cleanedChunk as any);
    if (isNumeric && !cleanedChunk.includes('.')) {
        return formatLargeNumber(Number(cleanedChunk));
    }
    return cleanedChunk;
  }

  const parts = text
    .replace(/\*/g, ' x ')
    .replace(/\(/g, '( ')
    .replace(/\)/g, ' )')
    .split(/(\s+)/) // Split by spaces but keep them
    .filter(part => part.trim() !== ''); // Filter out empty strings from multiple spaces

  const formattedParts = parts.map((part, index) => {
    if (part.includes('^')) {
      const [base, exponent] = part.split('^');
      return (
        <span key={index}>
          {processChunk(base)}<sup>{exponent}</sup>
        </span>
      );
    }
    if (part.trim() === 'x') {
        return <span key={index} className="mx-1">x</span>
    }
    return <span key={index}>{processChunk(part)}</span>;
  });

  return (
    <span className="whitespace-nowrap">
        {formattedParts.reduce((prev, curr, i) => {
            // This avoids adding extra spaces around our controlled spaces
            if (i > 0 && !parts[i-1].match(/\s+/)) {
                 return [...prev, ' ', curr];
            }
            return [...prev, curr];
        }, [] as React.ReactNode[])}
    </span>
  )
};

export default Equation;
