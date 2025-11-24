import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Source } from '@/app/actions';

const SourceTable = ({ sources }: { sources: Source[] }) => {
  if (!sources || sources.length === 0) {
    return <p className="text-sm text-muted-foreground italic">No data sources were provided by the model.</p>;
  }

  return (
    <div className="space-y-2">
        <h4 className="font-semibold text-foreground text-center mb-4">Data Points</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data Point</TableHead>
              <TableHead className="text-left">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium align-top">{item.name}</TableCell>
                <TableCell className="text-left align-top">{item.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  );
};

export default SourceTable;
