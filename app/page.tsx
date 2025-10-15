import { Header } from '@/components/header';
import { DriveProfitDashboard } from '@/components/drive-profit-dashboard';
import { ReportProvider } from '@/lib/report-context';


export const runtime = "experimental-edge";
export default function Home() {
  return (
    <ReportProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto p-2 sm:p-4 md:p-6 lg:p-8">
          <DriveProfitDashboard />
        </main>
      </div>
    </ReportProvider>
  );
}
