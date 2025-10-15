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
import { ExternalLink } from 'lucide-react';

const getDomainName = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    // Remove 'www.' if it exists
    return domain.replace(/^www\./, '');
  } catch (error) {
    return 'Website'; // Fallback for invalid URLs
  }
};

const SourceTable = ({ sources }: { sources: Source[] }) => {
  if (!sources || sources.length === 0) {
    return <p className="text-sm text-muted-foreground italic">No data sources were provided by the model.</p>;
  }

  return (
    <div className="space-y-2">
        <h4 className="font-semibold text-foreground text-center mb-4">Data Sources & Reasoning</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data Point</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="text-right">Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.value}</TableCell>
                <TableCell className="text-right">
                  {item.source ? (
                    <a
                      href={item.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      {getDomainName(item.source)}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground italic">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  );
};

export default SourceTable;
