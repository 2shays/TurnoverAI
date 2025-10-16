import React from 'react';
import { formatLargeNumber, formatNumber } from '@/lib/utils';
import { type CalculationComponent } from '@/app/actions';
import Equation from './Equation';

const ReasoningDisplay = ({ breakdown, finalTurnover }: { breakdown: CalculationComponent[], finalTurnover: number }) => {
  if (!breakdown || breakdown.length === 0) return null;

  const weightedSumString = breakdown
    .map(item => `( ${formatNumber(item.value)} x ${item.weight * 100}% )`)
    .join(' + ');

  return (
    <div className="text-sm text-left space-y-4 w-full">
      <h4 className="font-semibold text-foreground mb-4 text-center">Final Calculation</h4>
      <table className="w-full border-separate" style={{ borderSpacing: '0 1rem' }}>
        <tbody>
          {breakdown.map((item, index) => (
            <tr key={index} className="align-center">
              <td className="text-muted-foreground text-xs pr-4">{item.description}</td>
              <td className="font-mono text-sm px-4 text-center whitespace-nowrap">
                  <Equation text={item.calculation} />
              </td>
              <td className="font-mono text-sm pl-4 whitespace-nowrap text-right w-px">=</td>
              <td className="text-right font-mono text-sm font-semibold pl-4 whitespace-nowrap">{formatLargeNumber(item.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
       <div className="border-t border-dashed my-3"></div>

      <div className="space-y-3 pt-2">
        <h4 className="font-semibold text-foreground text-center">Weighted Predicted Turnover</h4>
        <div className="text-center font-mono text-xs px-2 py-2 flex justify-center items-center flex-wrap">
            <Equation text={weightedSumString} />
            <span className="font-mono text-xs mx-2">=</span>
            <span className="font-mono text-xs font-bold text-primary">{formatNumber(finalTurnover)}</span>
        </div>
      </div>
    </div>
  );
};

export default ReasoningDisplay;
