import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MoveRight } from "lucide-react"
import React from "react"

const steps = [
    { title: "1. Data Sourcing", description: "Scans financial data platforms and company websites for key variables.", highlighted: false },
    { title: "2. Data Normalization", description: "Uses internal benchmark data to standardize and validate the sourced information.", highlighted: false },
    { title: "3. Revenue Projection", description: "Projects historical revenue to the current fiscal year using industry growth rates.", highlighted: true },
    { title: "4. Final Calculation", description: "Computes the final turnover prediction using a weighted, multi-variable equation.", highlighted: false },
]

export default function ModelingApproachSection() {
    return (
        <section id="modeling-approach" className="mb-24 scroll-mt-20">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-headline">Our Predictive Modeling Process</h2>
                <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
                    Our model uses a multi-step process that combines real-time data sourcing, benchmark normalization, and financial projection to generate a reliable turnover estimate.
                </p>
            </div>
            <div className="grid md:grid-cols-4 items-stretch justify-center gap-4">
                {steps.map((step, index) => (
                    <React.Fragment key={step.title}>
                        <Card className={`w-full text-center flex flex-col ${step.highlighted ? 'bg-primary/10 border-primary/50' : ''}`}>
                            <CardHeader className="pb-2">
                                <CardTitle className={`text-base font-semibold ${step.highlighted ? 'text-primary' : 'text-foreground'}`}>{step.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <CardDescription className={step.highlighted ? 'text-primary/80' : ''}>{step.description}</CardDescription>
                            </CardContent>
                        </Card>
                    </React.Fragment>
                ))}
            </div>
        </section>
    )
}
