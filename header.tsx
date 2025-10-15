"use client";

import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Download, Mountain, Languages } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useReport } from '@/lib/report-context';


export function Header() {
  const { toast } = useToast();
  const { language, setLanguage, dictionary } = useLanguage();
  const { reportData, formData } = useReport();
  const d = dictionary;

  const handleDownload = () => {
    if (!reportData || !formData) {
      toast({
        variant: 'destructive',
        title: d.header.downloadToast.noDataTitle,
        description: d.header.downloadToast.noDataDescription,
      });
      return;
    }

    const reportLines = [
      `# ${d.header.title} - ${d.header.downloadButton}`,
      `Generated on: ${new Date().toLocaleString()}`,
      `\n## ${d.driveProfitDashboard.calculator.title}`,
      `--------------------------------`,
      `${d.driveProfitDashboard.mainForm.distance}: ${formData.distance} km`,
      `${d.driveProfitDashboard.mainForm.totalEarnings}: $${formData.totalEarnings.toFixed(2)}`,
      `${d.driveProfitDashboard.mainForm.drivingHours}: ${formData.drivingHours} hours`,
      `\n## ${d.driveProfitDashboard.advancedSettings.title}`,
      `--------------------------------`,
      `${d.driveProfitDashboard.settingsForm.fuelCostPerLiter}: $${formData.fuelCostPerLiter.toFixed(2)}`,
      `${d.driveProfitDashboard.settingsForm.avgConsumption}: ${formData.avgConsumption} km/l`,
      `${d.driveProfitDashboard.settingsForm.maintenanceCost}: $${formData.maintenanceCost.toFixed(2)}`,
      `${d.driveProfitDashboard.settingsForm.tireCost}: $${formData.tireCost.toFixed(2)}`,
      `${d.driveProfitDashboard.settingsForm.annualInsurance}: $${formData.annualInsurance.toFixed(2)}`,
      `${d.driveProfitDashboard.settingsForm.totalFees}: ${formData.totalFees}%`,
      `${d.driveProfitDashboard.settingsForm.taxRate}: ${formData.taxRate}%`,
      `\n## ${d.driveProfitDashboard.report.awaits.title}`,
      `--------------------------------`,
      `${d.driveProfitDashboard.summary.totalEarnings}: $${formData.totalEarnings.toFixed(2)}`,
      `${d.driveProfitDashboard.summary.totalCosts}: $${reportData.totalCosts.toFixed(2)}`,
      `${d.driveProfitDashboard.summary.netProfit}: $${reportData.netProfit.toFixed(2)}`,
      `${d.driveProfitDashboard.summary.earningsPerHour}: $${reportData.earningsPerHour.toFixed(2)}${d.driveProfitDashboard.summary.perHourSuffix}`,
      `${d.driveProfitDashboard.summary.profitPerHour}: $${reportData.profitPerHour.toFixed(2)}${d.driveProfitDashboard.summary.perHourSuffix}`,
      `${d.driveProfitDashboard.summary.earningsPerKm}: $${reportData.earningsPerKm.toFixed(2)}${d.driveProfitDashboard.summary.perKmSuffix}`,
      `${d.driveProfitDashboard.summary.profitPerKm}: $${reportData.profitPerKm.toFixed(2)}${d.driveProfitDashboard.summary.perKmSuffix}`,
      `\n## ${d.driveProfitDashboard.expenseBreakdown.title}`,
      `--------------------------------`,
      ...Object.entries(reportData.costs).map(([key, value]) => {
        const percentage = reportData.totalCosts > 0 ? ((value / reportData.totalCosts) * 100).toFixed(1) : '0.0';
        return `${d.driveProfitDashboard.expenseCategories[key as keyof typeof d.driveProfitDashboard.expenseCategories]}: $${value.toFixed(2)} (${percentage}%)`;
      }),
      `${d.driveProfitDashboard.expenseBreakdown.total}: $${reportData.totalCosts.toFixed(2)}`,
      `\n## ${d.driveProfitDashboard.breakEven.title}`,
      `--------------------------------`,
      `${d.driveProfitDashboard.breakEven.line1}`,
      `${d.driveProfitDashboard.breakEven.totalCosts}: $${reportData.totalCosts.toFixed(2)}`,
      `${d.driveProfitDashboard.breakEven.earningsPerKm}: $${reportData.breakEven.earningsPerKm.toFixed(2)}`,
      `Result: ${reportData.breakEven.km.toFixed(0)} km`,
      `${d.driveProfitDashboard.breakEven.line2}`,
    ];

    const reportText = reportLines.join('\n');
    
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'drive-profit-report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: d.header.downloadToast.title,
      description: d.header.downloadToast.description,
    });
  };

  return (
    <TooltipProvider>
      <header className="flex items-center justify-between p-2 sm:p-4 border-b bg-card sticky top-0 z-10">
        <div className="flex items-center gap-2 sm:gap-3">
          <Mountain className="w-6 h-6 text-primary" />
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            {dictionary.header.title}
          </h1>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-9 h-9 p-0 sm:w-auto sm:h-9 sm:px-3">
                      <Languages className="w-4 h-4" />
                      <span className="sr-only sm:not-sr-only sm:ml-2">{dictionary.header.language}</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent className="sm:hidden" side="bottom">
                  <p>{dictionary.header.language}</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(value as 'en' | 'es')}>
                  <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="es">Español</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleDownload} variant="default" size="sm" className="w-9 h-9 p-0 sm:w-auto sm:h-9 sm:px-3">
                <Download className="w-4 h-4" />
                <span className="sr-only sm:not-sr-only sm:ml-2">{dictionary.header.downloadButton}</span>
              </Button>
            </TooltipTrigger>
             <TooltipContent className="sm:hidden" side="bottom">
              <p>{dictionary.header.downloadButton}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  );
}
