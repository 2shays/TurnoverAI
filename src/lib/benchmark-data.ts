import { readFile } from "fs/promises";
import path from "path";

export type BenchmarkRow = {
  id: number;
  company_name: string;
  turnover: number;
  employees: number;
  industry: string;
};

const benchmarkDataPath = path.join(process.cwd(), "turnover_rows.csv");

let benchmarkDataPromise: Promise<BenchmarkRow[]> | null = null;

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"') {
      if (insideQuotes && nextCharacter === '"') {
        currentValue += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (character === ',' && !insideQuotes) {
      values.push(currentValue);
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  values.push(currentValue);
  return values.map(value => value.trim());
}

function parseBenchmarkCsv(csvText: string): BenchmarkRow[] {
  const lines = csvText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map(line => {
    const values = parseCsvLine(line);
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])) as Record<string, string>;

    return {
      id: Number(row.id),
      company_name: row.company_name,
      turnover: Number(row.turnover),
      employees: Number(row.employees),
      industry: row.industry,
    };
  });
}

async function readBenchmarkData(): Promise<BenchmarkRow[]> {
  const csvText = await readFile(benchmarkDataPath, "utf8");
  return parseBenchmarkCsv(csvText);
}

export function loadBenchmarkData(): Promise<BenchmarkRow[]> {
  if (!benchmarkDataPromise) {
    benchmarkDataPromise = readBenchmarkData();
  }

  return benchmarkDataPromise;
}