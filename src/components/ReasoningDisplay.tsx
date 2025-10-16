import React from 'react';
import { formatLargeNumber, formatNumber } from '@/lib/utils';
import { type CalculationComponent } from '@/app/actions';
import Equation from './Equation';

const ReasoningDisplay = ({ breakdown, finalTurnover }: { breakdown: CalculationComponent[], finalTurnover: number }) => {
  if (!breakdown || breakdown.length === 0) return null;

  return (
    <div className="text-sm text-left space-y-4 w-full">
      <h4 className="font-semibold text-foreground mb-4 text-center">Final Calculation</h4>
      <div className="space-y-3">
        {breakdown.map((item, index) => (
          <div key={index} className="grid grid-cols-[auto,1fr,auto] items-center gap-x-4">
            <div className="col-span-1 text-muted-foreground text-xs">{item.description}</div>
            <div className="col-span-1 text-right font-mono text-sm px-4">
                <Equation text={item.calculation} />
            </div>
            <div className="col-span-1 text-right font-mono text-sm font-semibold">= {formatLargeNumber(item.value)}</div>
          </div>
        ))}
        <div className="border-t border-dashed my-3"></div>
        <div className="grid grid-cols-[auto,1fr,auto] items-center gap-x-4 pt-2">
            <div className="col-span-1 text-foreground font-bold">Predicted Turnover</div>
            <div className="col-span-1 text-center"></div>
            <div className="col-span-1 text-right font-bold text-primary text-lg">= {formatNumber(finalTurnover)}</div>
        </div>
      </div>
    </div>
  );
};

export default ReasoningDisplay;
