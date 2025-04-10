import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import Header from "@/components/layout/header";
import QuickAccess from "@/components/dashboard/quick-access";
import StatsCards from "@/components/dashboard/stats-cards";
import TodaySchedule from "@/components/dashboard/today-schedule";
import IntegrationStatus from "@/components/dashboard/integration-status";
import RecentActivities from "@/components/dashboard/recent-activities";
import { Loader2 } from "lucide-react";
import { getSatuSehatStatus } from "@/lib/satu-sehat";

export default function Dashboard() {
  const { toast } = useToast();
  
  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });
  
  const { data: jadwalHariIni, isLoading: isLoadingJadwal } = useQuery({
    queryKey: ['/api/jadwal/hari-ini'],
  });
  
  const { data: aktivitasTerbaru, isLoading: isLoadingAktivitas } = useQuery({
    queryKey: ['/api/aktivitas?limit=5'],
  });
  
  const { data: satuSehatStatus, isLoading: isLoadingSatuSehat } = useQuery({
    queryKey: ['/api/satu-sehat/status'],
    queryFn: getSatuSehatStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const isLoading = isLoadingStats || isLoadingJadwal || isLoadingAktivitas || isLoadingSatuSehat;

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-lightest">
      <Sidebar />
      
      <div className="flex-1 md:ml-64 pt-5 pb-20 md:pb-5 overflow-y-auto">
        <Header title="Dashboard" subtitle="Selamat datang kembali" />
        
        {isLoading ? (
          <div className="flex items-center justify-center h-[80vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="px-4 md:px-6">
            <QuickAccess />
            <StatsCards stats={dashboardStats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                <TodaySchedule jadwal={jadwalHariIni} />
              </div>
              <div>
                <IntegrationStatus status={satuSehatStatus} />
              </div>
            </div>
            
            <div className="mt-6">
              <RecentActivities aktivitas={aktivitasTerbaru} />
            </div>
          </div>
        )}
      </div>
      
      <MobileNav />
    </div>
  );
}
