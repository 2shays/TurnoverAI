import { BrainCircuit, Combine, Scaling } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: <Combine className="h-8 w-8 text-primary mb-3" />,
    title: 'Creative Data Integration',
    description: 'Utilizes non-traditional data points inferred from web presence to build a holistic company profile.',
  },
  {
    icon: <Scaling className="h-8 w-8 text-primary mb-3" />,
    title: 'Public Company Benchmarking',
    description: 'Improves accuracy by comparing the target company to thousands of similar public companies in our database.',
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary mb-3" />,
    title: 'Dynamic AI Model',
    description: 'The underlying model constantly learns and adapts as new data becomes available, refining its predictive power.',
  },
];

export default function OverviewSection() {
  return (
    <section id="overview" className="mb-24 text-center scroll-mt-20">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-headline">Predicting Private Company Turnover</h2>
      <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-12">
        This AI-powered tool addresses the challenge of estimating the annual turnover of private companies, for which financial data is often unavailable. By leveraging creative alternative data sources and a powerful backend reference database, we can generate reliable predictions.
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
