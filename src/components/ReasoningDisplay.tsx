import React from 'react';
import { formatLargeNumber, formatNumber } from '@/lib/utils';
import { type CalculationComponent } from '@/app/actions';
import Equation from './Equation';

const ReasoningDisplay = ({ breakdown, finalTurnover }: { breakdown: CalculationComponent[], finalTurnover: number }) => {
  if (!breakdown || breakdown.length === 0) return null;

  return (
    <div className="text-sm text-left space-y-4 w-full">
      <h4 className="font-semibold text-foreground mb-4 text-center">Final Calculation</h4>
      <table className="w-full border-separate" style={{ borderSpacing: '0 1rem' }}>
        <tbody>
          {breakdown.map((item, index) => (
            <tr key={index} className="align-center">
              <td className="text-muted-foreground text-xs pr-4">{item.description}</td>
              <td className="font-mono text-sm px-4 text-center">
                  <Equation text={item.calculation} />
              </td>
              <td className="font-mono text-sm pl-4 whitespace-nowrap text-right w-px">=</td>
              <td className="text-right font-mono text-sm font-semibold pl-4 whitespace-nowrap">{formatLargeNumber(item.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
       <div className="border-t border-dashed my-3"></div>
        <div className="grid grid-cols-[1fr,auto,auto] items-center gap-x-4 pt-2">
            <div className="text-foreground font-bold">Predicted Turnover</div>
            <div className="font-mono text-sm pl-4 whitespace-nowrap text-right w-px">=</div>
            <div className="text-right font-bold text-primary text-lg whitespace-nowrap">{formatNumber(finalTurnover)}</div>
        </div>
    </div>
  );
};

export default ReasoningDisplay;
