"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getPrediction, type PredictionResult } from "@/app/actions";
import { formatNumber } from "@/lib/utils";
import { formatLargeNumber } from "@/lib/utils";


const FormSchema = z.object({
  url: z.string().min(4, {
    message: "Please enter a valid website address.",
  }),
});


export default function InteractiveDemo() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: "www.turnoverai.com",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    startTransition(async () => {
      try {
        const result = await getPrediction(data.url);
        setPrediction(result);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Prediction Failed",
          description: error instanceof Error ? error.message : "An unknown error occurred.",
        });
      }
    });
  };

  useEffect(() => {
    // Initial prediction on load
    onSubmit({ url: "www.turnoverai.com" });
  }, []);

  return (
    <section id="demo" className="scroll-mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-headline">Turnover Prediction</h2>
        <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
          Enter a company's website address below. Our AI will infer the industry and operational scale, then provide a turnover prediction benchmarked against relevant public companies.
        </p>
      </div>
      <Card className="p-8 shadow-lg">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <h3 className="text-xl font-semibold text-foreground mb-6 font-headline">Input Company Web Address</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., www.example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Predicting..." : "Predict Turnover"}
                </Button>
              </form>
            </Form>
            <Card className="mt-6 bg-secondary/50">
                <CardContent className="p-4 space-y-2">
                    <p className="font-medium text-foreground">Inferred Data:</p>
                    {isPending ? (
                      <div className="space-y-2 pt-1">
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-3/5" />
                      </div>
                    ) : prediction ? (
                      <>
                        <p className="text-sm text-muted-foreground">Industry: <span className="font-bold text-primary">{prediction.inferredIndustry}</span></p>
                        <p className="text-sm text-muted-foreground">Employees: <span className="font-bold text-foreground">{formatLargeNumber(prediction.inferredEmployees)}</span></p>
                      </>
                    ) : (
                         <p className="text-sm text-muted-foreground italic">Enter a URL to see inferred data.</p>
                    )}
                </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-8 flex flex-col justify-center items-center">
            <div className="text-center w-full">
              <h3 className="text-xl font-semibold text-foreground font-headline">Prediction Results</h3>
              <div className="flex flex-col items-center gap-4 mt-4">
                <div>
                  <p className="text-muted-foreground">Predicted Annual Turnover</p>
                  {isPending ? <Skeleton className="h-10 w-40 mt-1" /> : <p className="text-4xl font-bold text-primary">{prediction ? formatNumber(prediction.predictedTurnover) : "₹--"}</p>}
                </div>
                <div className="w-full max-w-sm">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-muted-foreground">Confidence Score</p>
                    {isPending ? <Skeleton className="h-5 w-10" /> : <p className="text-lg font-bold text-accent">{prediction ? `${prediction.confidence}%` : '--%'}</p>}
                  </div>
                  {isPending ? <Skeleton className="h-2.5 w-full mt-2" /> : <Progress value={prediction?.confidence || 0} className="h-2.5" indicatorClassName="bg-accent" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
