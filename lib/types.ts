import { z } from "zod";

export const formDataSchema = z.object({
  distance: z.coerce.number().min(0.1, "Distance must be greater than 0"),
  totalEarnings: z.coerce.number().min(0, "Earnings must be positive"),
  drivingHours: z.coerce.number().min(0, "Hours must be positive"),
  
  fuelCostPerLiter: z.coerce.number().min(0, "Fuel cost must be positive"),
  avgConsumption: z.coerce.number().min(0.1, "Consumption must be greater than 0"),
  maintenanceCost: z.coerce.number().min(0, "Maintenance cost must be positive"),
  tireCost: z.coerce.number().min(0, "Tire cost must be positive"),
  annualInsurance: z.coerce.number().min(0, "Insurance cost must be positive"),
  totalFees: z.coerce.number().min(0, "Fee must be non-negative").max(100, "Fee cannot exceed 100"),
  taxRate: z.coerce.number().min(0, "Tax rate must be non-negative").max(100, "Tax rate cannot exceed 100"),
});

export type FormData = z.infer<typeof formDataSchema>;

export type ReportData = {
  totalCosts: number;
  netProfit: number;
  profitPerHour: number;
  profitPerKm: number;
  earningsPerHour: number;
  earningsPerKm: number;
  costs: {
    fuel: number;
    maintenance: number;
    tires: number;
    insurance: number;
    fees: number;
    tax: number;
  };
  breakEven: {
    km: number;
    earningsPerKm: number;
  };
};

export type ExpenseBreakdown = {
  name: string;
  value: number;
  fill: string;
}[];
