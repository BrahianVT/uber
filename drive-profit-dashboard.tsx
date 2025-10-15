"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FormData, ReportData } from "@/lib/types";
import { formDataSchema } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DollarSign, Gauge, Fuel, Clock, Wrench, CircleDot, Shield, Car, BarChart, PieChart, Target, Percent, Receipt, SlidersHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/lib/i18n/language-provider";
import { useReport } from "@/lib/report-context";


export function DriveProfitDashboard() {
  const { reportData, setReportData, setFormData } = useReport();
  const [isLoading, setIsLoading] = useState(false);
  const { dictionary } = useLanguage();

  const d = dictionary.driveProfitDashboard;

  const mainFormFields = [
    { name: "distance", label: d.mainForm.distance, icon: Car, placeholder: "e.g., 2500" },
    { name: "totalEarnings", label: d.mainForm.totalEarnings, icon: DollarSign, placeholder: "e.g., 2000" },
    { name: "drivingHours", label: d.mainForm.drivingHours, icon: Clock, placeholder: "e.g., 80" },
  ] as const;

  const settingsFormFields = [
    { name: "fuelCostPerLiter", label: d.settingsForm.fuelCostPerLiter, icon: Fuel, placeholder: "e.g., 1.50" },
    { name: "avgConsumption", label: d.settingsForm.avgConsumption, icon: Gauge, placeholder: "e.g., 12" },
    { name: "maintenanceCost", label: d.settingsForm.maintenanceCost, icon: Wrench, placeholder: "e.g., 150" },
    { name: "tireCost", label: d.settingsForm.tireCost, icon: CircleDot, placeholder: "e.g., 600" },
    { name: "annualInsurance", label: d.settingsForm.annualInsurance, icon: Shield, placeholder: "e.g., 1200" },
    { name: "totalFees", label: d.settingsForm.totalFees, icon: Percent, placeholder: "e.g., 10" },
    { name: "taxRate", label: d.settingsForm.taxRate, icon: Receipt, placeholder: "e.g., 15" },
  ] as const;

  const form = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    defaultValues: {
      distance: 50000,
      totalEarnings: 300000,
      drivingHours: 2817,
      fuelCostPerLiter: 22,
      avgConsumption: 11,
      maintenanceCost: 1000,
      tireCost: 10000,
      annualInsurance: 25000,
      totalFees: 10,
      taxRate: 10,
    },
  });

  const onSubmit = (data: FormData) => {
    setIsLoading(true);
    setReportData(null);
    setFormData(data);

    // Simulate calculation delay
    setTimeout(() => {
      const { distance, fuelCostPerLiter, avgConsumption, totalEarnings, drivingHours, maintenanceCost, tireCost, annualInsurance, totalFees, taxRate } = data;
      
      const fuelCostPerKm = (1 / avgConsumption) * fuelCostPerLiter;
      const maintenanceCostPerKm = maintenanceCost / 10000;
      const tireCostPerKm = tireCost / 50000;
      
      const totalFuelCost = distance * fuelCostPerKm;
      const totalMaintenanceCost = distance * maintenanceCostPerKm;
      const totalTireCost = distance * tireCostPerKm;
      
      const platformFees = totalEarnings * (totalFees / 100);

      const totalOperatingCosts = totalFuelCost + totalMaintenanceCost + totalTireCost + annualInsurance + platformFees;
      const preTaxProfit = totalEarnings - totalOperatingCosts;
      const tax = preTaxProfit > 0 ? preTaxProfit * (taxRate / 100) : 0;
      
      const totalCosts = totalOperatingCosts + tax;
      const netProfit = totalEarnings - totalCosts;

      const profitPerHour = drivingHours > 0 ? netProfit / drivingHours : 0;
      const profitPerKm = distance > 0 ? netProfit / distance : 0;
      
      const earningsPerKm = distance > 0 ? totalEarnings / distance : 0;
      const earningsPerHour = drivingHours > 0 ? totalEarnings / drivingHours : 0;
      const breakEvenKm = earningsPerKm > 0 ? totalCosts / earningsPerKm : 0;


      setReportData({
        totalCosts,
        netProfit,
        profitPerHour,
        profitPerKm,
        earningsPerHour,
        earningsPerKm,
        costs: {
          fuel: totalFuelCost,
          maintenance: totalMaintenanceCost,
          tires: totalTireCost,
          insurance: annualInsurance,
          fees: platformFees,
          tax: tax,
        },
        breakEven: {
          km: isFinite(breakEvenKm) ? breakEvenKm : 0,
          earningsPerKm,
        },
      });
      setIsLoading(false);
    }, 1000);
  };

  const InfoCard = ({ title, value, icon: Icon, prefix = "$", suffix = "", precision = 2, isLoading, color = "" }: { title: string, value: number, icon: React.ElementType, prefix?: string, suffix?: string, precision?: number, isLoading: boolean, color?: string }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? <Skeleton className="h-8 w-3/4" /> : (
          <div className={`text-2xl font-bold ${color}`}>
            {prefix}{value.toFixed(precision)}{suffix}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-8 items-start">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{d.calculator.title}</CardTitle>
          <CardDescription>{d.calculator.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {mainFormFields.map(({ name, label, icon: Icon, placeholder }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" /> {label}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" step="any" placeholder={placeholder} {...field} onChange={event => field.onChange(event.target.valueAsNumber || 0)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="settings">
                  <AccordionTrigger>
                    <h3 className="flex items-center gap-2 font-semibold">
                      <SlidersHorizontal className="h-4 w-4" />
                      {d.advancedSettings.title}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-4">
                    {settingsFormFields.map(({ name, label, icon: Icon, placeholder }) => (
                       <FormField
                        key={name}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm">
                              <Icon className="h-4 w-4 text-muted-foreground" /> {label}
                            </FormLabel>
                            <FormControl>
                              <Input type="number" step="any" placeholder={placeholder} {...field} onChange={event => field.onChange(event.target.valueAsNumber || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? d.calculator.calculatingButton : d.calculator.calculateButton}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="lg:col-span-3 space-y-4 lg:space-y-8">
        {!reportData && !isLoading && (
          <Card className="flex flex-col items-center justify-center text-center p-8 h-full">
            <BarChart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">{d.report.awaits.title}</h3>
            <p className="text-muted-foreground mt-2">{d.report.awaits.description}</p>
          </Card>
        )}
        
        {(reportData || isLoading) && (
          <>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-2">
              <InfoCard title={d.summary.totalEarnings} value={Number(form.getValues("totalEarnings")) || 0} icon={DollarSign} isLoading={isLoading} color="text-green-600" />
              <InfoCard title={d.summary.totalCosts} value={reportData?.totalCosts ?? 0} icon={DollarSign} isLoading={isLoading} color="text-red-600" />
              <InfoCard title={d.summary.netProfit} value={reportData?.netProfit ?? 0} icon={DollarSign} isLoading={isLoading} color={reportData && reportData.netProfit >= 0 ? "text-green-600" : "text-red-600"} />
              <InfoCard title={d.summary.earningsPerHour} value={reportData?.earningsPerHour ?? 0} icon={Clock} isLoading={isLoading} suffix={d.summary.perHourSuffix} />
              <InfoCard title={d.summary.profitPerHour} value={reportData?.profitPerHour ?? 0} icon={Clock} isLoading={isLoading} suffix={d.summary.perHourSuffix} />
              <InfoCard title={d.summary.earningsPerKm} value={reportData?.earningsPerKm ?? 0} icon={Car} isLoading={isLoading} suffix={d.summary.perKmSuffix} />
              <InfoCard title={d.summary.profitPerKm} value={reportData?.profitPerKm ?? 0} icon={Car} isLoading={isLoading} suffix={d.summary.perKmSuffix} />
            </div>

            <div className="grid gap-4 md:grid-cols-1">
              <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-primary" /> {d.expenseBreakdown.title}
                    </CardTitle>
                    <CardDescription>{d.expenseBreakdown.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-[200px] w-full" />
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{d.expenseBreakdown.category}</TableHead>
                            <TableHead className="text-right">{d.expenseBreakdown.amount}</TableHead>
                            <TableHead className="text-right">{d.expenseBreakdown.percentage}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {reportData?.costs && Object.entries(reportData.costs).map(([key, value]) => (
                            <TableRow key={key}>
                              <TableCell className="capitalize font-medium">{d.expenseCategories[key as keyof typeof d.expenseCategories] || key}</TableCell>
                              <TableCell className="text-right">${value.toFixed(2)}</TableCell>
                              <TableCell className="text-right">
                                {reportData.totalCosts > 0 ? ((value / reportData.totalCosts) * 100).toFixed(1) : '0.0'}%
                              </TableCell>
                            </TableRow>
                          ))}
                           <TableRow className="font-bold bg-muted/50">
                              <TableCell>{d.expenseBreakdown.total}</TableCell>
                              <TableCell className="text-right">${reportData?.totalCosts.toFixed(2)}</TableCell>
                              <TableCell className="text-right">100%</TableCell>
                            </TableRow>
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" /> {d.breakEven.title}
                  </CardTitle>
                  <CardDescription>{d.breakEven.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   {isLoading ? <Skeleton className="h-24 w-full" /> : (
                     <div className="text-center p-4 rounded-lg bg-muted/50">
                        <p className="text-muted-foreground">{d.breakEven.line1}</p>
                        <div className="text-2xl font-bold text-primary my-2 flex items-center justify-center flex-wrap gap-x-2">
                           <div className="flex flex-col items-center">
                              <span>${reportData?.totalCosts.toFixed(2)}</span>
                              <span className="text-xs font-normal text-muted-foreground">({d.breakEven.totalCosts})</span>
                           </div>
                           <span>/</span>
                           <div className="flex flex-col items-center">
                              <span>${reportData?.breakEven?.earningsPerKm?.toFixed(2)}</span>
                              <span className="text-xs font-normal text-muted-foreground">({d.breakEven.earningsPerKm})</span>
                           </div>
                            <span>=</span>
                           <span className="text-3xl">{reportData?.breakEven?.km?.toFixed(0) ?? '...'} km</span>
                        </div>
                        <p className="text-muted-foreground mt-2">{d.breakEven.line2}</p>
                    </div>
                   )}
                </CardContent>
              </Card>
          </>
        )}
      </div>
    </div>
  );
}

    
