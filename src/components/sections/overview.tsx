import { BrainCircuit, Database, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: <Search className="h-8 w-8 text-primary mb-3" />,
    title: 'Live Web-Sourced Data',
    description: 'Performs real-time searches across financial data platforms like Tracxn and Tofler for the latest company information.',
  },
  {
    icon: <Database className="h-8 w-8 text-primary mb-3" />,
    title: 'Curated Benchmark Data',
    description: 'Cross-references findings with an internal database of public companies to normalize data and improve accuracy.',
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary mb-3" />,
    title: 'Multi-Variable AI Model',
    description: 'The AI uses a weighted equation, considering reported revenue, employee count, product lines, and locations.',
  },
];

export default function OverviewSection() {
  return (
    <section id="overview" className="mb-24 text-center scroll-mt-20">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-headline">AI-Powered Private Company Turnover Prediction</h2>
      <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-12">
        This tool leverages a sophisticated AI model to provide reliable turnover estimates for private companies. It synthesizes real-time web research with curated benchmark data to overcome the challenge of unavailable financial information.
      </p>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Card key={feature.title} className="text-left">
            <CardHeader>
              {feature.icon}
              <CardTitle className="font-headline">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
