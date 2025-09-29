import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MoveRight } from "lucide-react"

const steps = [
    { title: "1. URL Analysis", description: "Infer industry and extract/infer scale data.", highlighted: false },
    { title: "2. Company Matching", description: "Identify similar public companies based on inferred industry and scale.", highlighted: false },
    { title: "3. Model Application", description: "Apply AI model trained on public data to the target's inferred data.", highlighted: true },
    { title: "4. Prediction & Scoring", description: "Generate turnover estimate and a confidence score.", highlighted: false },
]

export default function ModelingApproachSection() {
    return (
        <section id="modeling-approach" className="mb-24 scroll-mt-20">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-headline">Our Predictive Modeling Process</h2>
                <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
                    The model follows a systematic process to transform a company's web address into a reliable turnover prediction. It uses the URL to infer industry and scale, finds comparable public companies, and then generates and validates the final estimate.
                </p>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                {steps.map((step, index) => (
                    <>
                        <Card key={step.title} className={`w-full md:w-52 text-center ${step.highlighted ? 'bg-primary/10 border-primary/50' : ''}`}>
                            <CardHeader className="pb-2">
                                <CardTitle className={`text-base font-semibold ${step.highlighted ? 'text-primary' : 'text-foreground'}`}>{step.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className={step.highlighted ? 'text-primary/80' : ''}>{step.description}</CardDescription>
                            </CardContent>
                        </Card>
                        {index < steps.length - 1 && (
                            <MoveRight className="text-muted-foreground/50 h-8 w-8 shrink-0 md:rotate-0 rotate-90" />
                        )}
                    </>
                ))}
            </div>
        </section>
    )
}
