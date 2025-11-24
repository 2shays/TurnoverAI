"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronsUpDown, X } from "lucide-react"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useToast } from "@/hooks/use-toast";
import { getPrediction, type PredictionResult, type Source } from "@/app/actions";
import { industries } from "@/lib/industries";
import { cn, formatNumber, formatLargeNumber } from "@/lib/utils";
import SourceTable from "@/components/SourceTable";
import ReasoningDisplay from "../ReasoningDisplay";

const FormSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  employees: z.coerce.number().optional(),
  industry: z.string().optional(),
});


export default function InteractiveDemo() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [comboboxOpen, setComboboxOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: "",
      employees: undefined,
      industry: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (!data.url) {
        toast({
          variant: "destructive",
          title: "URL is required",
          description: "Please enter a company website URL to get a prediction.",
        });
        return;
    }
    setPrediction(null);
    startTransition(async () => {
      try {
        const result = await getPrediction(data.url!, data.employees, data.industry);
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

  const clearManualData = () => {
    form.setValue("employees", undefined);
    form.setValue("industry", "");
  }

  const getConfidenceColor = (score?: number) => {
    if (score === undefined) return "bg-accent";
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    if (score >= 25) return "bg-orange-500";
    return "bg-red-500";
  };
  
  const getOrderedSources = (): Source[] => {
    if (!prediction || !prediction.sources || !prediction.calculationBreakdown) {
      return [];
    }
  
    const orderedSourceNames = prediction.calculationBreakdown.map(item => {
        // This is a bit of a heuristic. It assumes the description maps to a source name.
        if (item.description.includes('revenue data')) return 'Most Recently Reported Revenue';
        if (item.description.includes('number of employees')) return 'Employee Count';
        if (item.description.includes('product lines')) return 'Product Line Count';
        if (item.description.includes('rent cost')) return 'Location Count';
        return '';
    }).filter(Boolean);
  
    const orderedSources = orderedSourceNames.map(name => 
      prediction.sources.find(source => source.name.includes(name))
    ).filter((s): s is Source => s !== undefined);
    
    // Add the remaining sources that weren't part of the calculation
    const remainingSources = prediction.sources.filter(source => 
      !orderedSources.some(os => os.name === source.name)
    );
  
    return [...orderedSources, ...remainingSources];
  };

  const orderedSources = getOrderedSources();


  return (
    <section id="demo" className="scroll-mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-headline">Turnover Prediction</h2>
        <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
          Enter a company's website address to have our AI perform real-time research and analysis. You can also provide manual data to refine the prediction.
        </p>
      </div>
      <Card className="p-8 shadow-lg">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <h3 className="text-xl font-semibold text-foreground mb-6 font-headline">Company Data</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., https://www.example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4 rounded-md border p-4 relative">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium">Provide Manual Data (Optional)</p>
                        {(form.getValues("employees") || form.getValues("industry")) && (
                            <Button variant="ghost" size="sm" onClick={clearManualData} className="text-xs h-7">
                                <X className="h-3 w-3 mr-1" />
                                Clear
                            </Button>
                        )}
                    </div>
                    <FormField
                      control={form.control}
                      name="employees"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Employee Count</FormLabel>
                          <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 50"
                                {...field}
                                value={field.value ?? ""}
                                onChange={event => {
                                  const value = event.target.value;
                                  field.onChange(value === '' ? undefined : +value);
                                }}
                              />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Industry</FormLabel>
                          <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <span className="truncate">
                                  {field.value
                                    ? industries.find(
                                        (industry) => industry.value === field.value
                                      )?.label ?? field.value
                                    : "Select or type an industry"}
                                  </span>
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search or type industry..."
                                  value={field.value}
                                  onValueChange={(value) => {
                                    form.setValue("industry", value)
                                  }}
                                />
                                <CommandList>
                                  <CommandEmpty>No industry found.</CommandEmpty>
                                  <CommandGroup>
                                    {industries.map((industry) => (
                                      <CommandItem
                                        value={industry.label}
                                        key={industry.value}
                                        onSelect={(currentValue) => {
                                          form.setValue("industry", industries.find(i => i.label.toLowerCase() === currentValue.toLowerCase())?.value ?? currentValue)
                                          setComboboxOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            industry.value === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {industry.label}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            You can type a custom industry if it's not in the list.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                
                <Button type="submit" className="w-full !mt-6" disabled={isPending}>
                  {isPending ? "Predicting..." : "Predict Turnover"}
                </Button>
              </form>
            </Form>
          </div>
          <div className="lg:col-span-8 flex flex-col justify-center items-center">
            <div className="text-center w-full">
              <h3 className="text-xl font-semibold text-foreground font-headline">Prediction Results</h3>
              <div className="flex flex-col items-center gap-4 mt-4">
                <div>
                  <p className="text-muted-foreground">Predicted Annual Turnover (FY25)</p>
                  {isPending ? (
                    <div className="flex items-center justify-center gap-2 h-10 mt-1">
                      <span className="text-muted-foreground">Calculating</span>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                    </div>
                  ) : <p className="text-4xl font-bold text-primary">{prediction ? formatNumber(prediction.predictedTurnover) : "₹--"}</p>}
                </div>
                <div className="w-full max-w-sm">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-muted-foreground">Confidence Score</p>
                    {isPending ? <Skeleton className="h-5 w-10" /> : <p className="text-lg font-bold text-foreground">{prediction ? `${prediction.confidence}%` : '--%'}</p>}
                  </div>
                  {isPending ? <Skeleton className="h-2.5 w-full mt-2" /> : <Progress value={prediction?.confidence || 0} className="h-2.5" indicatorClassName={getConfidenceColor(prediction?.confidence)} />}
                  {isPending ? <Skeleton className="h-4 w-full mt-2" /> : prediction?.confidenceReasoning && (
                    <p className="text-xs text-muted-foreground mt-2 text-center italic">
                      {prediction.confidenceReasoning}
                    </p>
                  )}
                </div>
              </div>
               <Card className="mt-6 bg-secondary/50 text-left">
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
                         <p className="text-sm text-muted-foreground italic">Enter a URL or manual data to see prediction results.</p>
                    )}
                </CardContent>
            </Card>
            {isPending ? (
              <Card className="mt-4 w-full bg-secondary/50 text-left">
                <CardContent className="p-4 space-y-2">
                  <p className="font-medium text-foreground">Calculation:</p>
                   <div className="space-y-2 pt-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/5" />
                    </div>
                </CardContent>
              </Card>
            ) : prediction?.calculationBreakdown && prediction.calculationBreakdown.length > 0 && (
              <Card className="mt-4 w-full bg-secondary/50 text-left">
                <CardContent className="p-4">
                    <ReasoningDisplay breakdown={prediction.calculationBreakdown} finalTurnover={prediction.predictedTurnover} />
                </CardContent>
              </Card>
            )}
            {isPending ? (
                 <Card className="mt-4 w-full bg-secondary/50 text-left">
                    <CardContent className="p-4 space-y-2">
                    <p className="font-medium text-foreground">Data Points:</p>
                    <div className="space-y-2 pt-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/5" />
                        </div>
                    </CardContent>
              </Card>
            ) : orderedSources.length > 0 && (
              <Card className="mt-4 w-full bg-secondary/50 text-left">
                <CardContent className="p-4">
                    <SourceTable sources={orderedSources} />
                </CardContent>
              </Card>
            )}
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
