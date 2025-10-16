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
        <span className="px-2 pb-1 border-b border-foreground">
          <Equation text={numerator} />
        </span>
        <span className="px-2 pt-1">
          <Equation text={denominator} />
        </span>
      </div>
    );
  }

  // Handle other formatting for non-division strings
  const processChunk = (chunk: string) => {
    // Format numbers with Indian numbering system, but ignore numbers with decimals (weights)
    if (!isNaN(Number(chunk)) && !chunk.includes('.')) {
        return formatLargeNumber(Number(chunk));
    }
    return chunk;
  }

  const parts = text
    .replace(/\*/g, ' x ') // Use multiplication symbol
    .replace(/\(/g, '( ')
    .replace(/\)/g, ' )')
    .split(' ');

  const formattedParts = parts.map((part, index) => {
    if (part.includes('^')) {
      const [base, exponent] = part.split('^');
      return (
        <span key={index}>
          {processChunk(base)}<sup>{exponent}</sup>
        </span>
      );
    }
    return <span key={index}>{processChunk(part)}</span>;
  });

  return (
    <span>
        {formattedParts.reduce((prev, curr, i) => {
            if (i === 0) return [curr];
            return [...prev, ' ', curr];
        }, [] as React.ReactNode[])}
    </span>
  )
};

export default Equation;
