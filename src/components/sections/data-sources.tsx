import { Banknote, BarChartBig, BrainCircuit, Globe, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const alternativeData = [
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: 'Auto-Inferred Industry',
    description: 'Model infers the industry (e.g., Tech, Retail) based on domain name and content analysis.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Inferred Employee Count',
    description: 'Estimated based on website complexity, assumed growth signals, and domain reputation.',
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    title: 'Estimated Web Traffic & Scale',
    description: 'Proxies for market reach and engagement derived from web address analysis.',
  },
];

const referenceData = [
  {
    icon: <Banknote className="h-8 w-8 text-primary" />,
    title: 'Financial Statements',
    description: 'Verified annual turnover, revenue, and profit margins.',
  },
  {
    icon: <BarChartBig className="h-8 w-8 text-primary" />,
    title: 'Operational Metrics',
    description: 'Revenue per employee, market cap, and other key ratios.',
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: 'Industry Benchmarks',
    description: 'Average growth rates and financial profiles for the inferred sector.',
  },
];

const DataCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-background p-6 rounded-lg shadow-md border flex items-center space-x-4">
        {icon}
        <div>
            <h4 className="font-semibold text-foreground font-headline">{title}</h4>
            <p className="text-muted-foreground">{description}</p>
        </div>
    </div>
);


export default function DataSourcesSection() {
  return (
    <section id="data-sources" className="mb-24 scroll-mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-headline">The Data Behind the Prediction</h2>
        <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
          Our model's accuracy stems from its ability to synthesize two distinct categories of data. We automatically infer the company's industry and key metrics from the provided URL, then cross-reference them with comprehensive data from public market equivalents.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center font-headline">Alternative Data (Private Company)</h3>
          <div className="space-y-6">
            {alternativeData.map(item => <DataCard key={item.title} {...item} />)}
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center font-headline">Reference Data (Public Companies)</h3>
          <div className="space-y-6">
            {referenceData.map(item => <DataCard key={item.title} {...item} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
