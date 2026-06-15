import { Banknote, Building, FileText, Globe, Search, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const primaryData = [
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: 'Financial Data Platforms',
    description: 'Scans Tracxn, Tofler, and Zauba Corp for reported revenue, financials, and company details.',
  },
  {
    icon: <Building className="h-8 w-8 text-primary" />,
    title: 'Credit Rating Agencies',
    description: 'Searches CRISIL, ICRA, and CARE for official reports on financial health and performance.',
  },
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: 'Website & Public Data',
    description: 'Analyzes the company website for product lines, team size, and location information.',
  },
];

const referenceData = [
  {
    icon: <Banknote className="h-8 w-8 text-primary" />,
    title: 'Curated Revenue Data',
    description: 'Uses the local turnover_rows.csv benchmark sheet of public companies as a baseline for revenue estimates.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Revenue Per Employee',
    description: 'Calculates industry-specific Revenue Per Employee averages from benchmark data.',
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: 'Industry Growth Rates',
    description: 'Researches the average annual growth rate for the target company\'s specific industry.',
  },
];

const DataCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-background p-6 rounded-lg shadow-md border flex flex-col h-full">
        <div className="flex items-center space-x-4 mb-4">
            {icon}
            <h4 className="font-semibold text-foreground font-headline text-lg">{title}</h4>
        </div>
        <p className="text-muted-foreground flex-grow">{description}</p>
    </div>
);


export default function DataSourcesSection() {
  return (
    <section id="data-sources" className="mb-24 scroll-mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-headline">The Data Behind the Prediction</h2>
        <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
          Our model's accuracy stems from a dual-source approach, combining real-time web research with curated benchmark data to create a robust financial profile.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center font-headline">Primary Data Sources</h3>
          <div className="grid grid-cols-1 gap-6">
            {primaryData.map(item => <DataCard key={item.title} {...item} />)}
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center font-headline">Benchmark & Reference Data</h3>
          <div className="grid grid-cols-1 gap-6">
            {referenceData.map(item => <DataCard key={item.title} {...item} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
