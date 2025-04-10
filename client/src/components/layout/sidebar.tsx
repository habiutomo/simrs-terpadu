import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  Calendar,
  FileText,
  Clipboard,
  Bed,
  FlaskRound,
  Microscope,
  Stethoscope,
  BarChart2,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>("pasien"); // Default open for demo

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleSubmenu = (key: string) => {
    if (openSubmenu === key) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(key);
    }
  };

  return (
    <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 bg-primary text-white">
      <div className="p-4 flex items-center justify-center border-b border-primary-dark">
        <div className="h-10 w-10 mr-2 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">RS</div>
        <h1 className="text-xl font-nunito font-bold">SIMRS Terpadu</h1>
      </div>
      
      <div className="overflow-y-auto flex-grow">
        <nav className="mt-4 px-2">
          <div className="p-3 mb-4 bg-primary-dark rounded-lg">
            <div className="flex items-center mb-2">
              <div className="rounded-full h-8 w-8 mr-2 bg-white/10 flex items-center justify-center text-sm font-medium">
                {user?.nama?.charAt(0) || "U"}
              </div>
              <span className="font-medium text-sm">{user?.nama || "Pengguna"}</span>
            </div>
            <div className="text-xs opacity-80">{user?.rumahSakit || "Rumah Sakit"}</div>
          </div>
          
          <div className="space-y-1">
            <Link href="/">
              <a className={cn(
                "px-3 py-2 rounded-md flex items-center text-sm font-medium w-full",
                location === "/" ? "bg-primary-light" : "hover:bg-primary-light transition"
              )}>
                <span className="mr-3">
                  <Home className="h-5 w-5" />
                </span>
                Dashboard
              </a>
            </Link>
            
            <div className="nav-group">
              <button 
                className={cn(
                  "px-3 py-2 rounded-md flex items-center text-sm font-medium w-full justify-between",
                  openSubmenu === "pasien" ? "bg-primary-light" : "hover:bg-primary-light transition"
                )}
                onClick={() => toggleSubmenu("pasien")}
              >
                <span className="flex items-center">
                  <span className="mr-3">
                    <Users className="h-5 w-5" />
                  </span>
                  Pasien
                </span>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform",
                  openSubmenu === "pasien" ? "transform rotate-180" : ""
                )} />
              </button>
              <div className={cn(
                "ml-9 mt-1 space-y-1",
                openSubmenu === "pasien" ? "block" : "hidden"
              )}>
                <Link href="/pasien/pendaftaran">
                  <a className={cn(
                    "block px-3 py-2 text-sm rounded-md",
                    location === "/pasien/pendaftaran" ? "bg-primary-light" : "hover:bg-primary-light transition"
                  )}>
                    Pendaftaran
                  </a>
                </Link>
                <Link href="/pasien/data">
                  <a className={cn(
                    "block px-3 py-2 text-sm rounded-md",
                    location === "/pasien/data" ? "bg-primary-light" : "hover:bg-primary-light transition"
                  )}>
                    Data Pasien
                  </a>
                </Link>
                <Link href="/pasien">
                  <a className={cn(
                    "block px-3 py-2 text-sm rounded-md",
                    location === "/pasien" && location !== "/pasien/pendaftaran" && location !== "/pasien/data" 
                      ? "bg-primary-light" 
                      : "hover:bg-primary-light transition"
                  )}>
                    Riwayat Kunjungan
                  </a>
                </Link>
              </div>
            </div>
            
            <Link href="/jadwal">
              <a className={cn(
                "px-3 py-2 rounded-md flex items-center text-sm font-medium w-full",
                location === "/jadwal" ? "bg-primary-light" : "hover:bg-primary-light transition"
              )}>
                <span className="mr-3">
                  <Calendar className="h-5 w-5" />
                </span>
                Jadwal & Appointment
              </a>
            </Link>
            
            <Link href="/rekam-medis">
              <a className={cn(
                "px-3 py-2 rounded-md flex items-center text-sm font-medium w-full",
                location === "/rekam-medis" ? "bg-primary-light" : "hover:bg-primary-light transition"
              )}>
                <span className="mr-3">
                  <FileText className="h-5 w-5" />
                </span>
                Rekam Medis
              </a>
            </Link>
            
            <Link href="/rawat-jalan">
              <a className={cn(
                "px-3 py-2 rounded-md flex items-center text-sm font-medium w-full",
                location === "/rawat-jalan" ? "bg-primary-light" : "hover:bg-primary-light transition"
              )}>
                <span className="mr-3">
                  <Clipboard className="h-5 w-5" />
                </span>
                Rawat Jalan
              </a>
            </Link>
            
            <Link href="/rawat-inap">
              <a className={cn(
                "px-3 py-2 rounded-md flex items-center text-sm font-medium w-full",
                location === "/rawat-inap" ? "bg-primary-light" : "hover:bg-primary-light transition"
              )}>
                <span className="mr-3">
                  <Bed className="h-5 w-5" />
                </span>
                Rawat Inap
              </a>
            </Link>
            
            <Link href="/farmasi">
              <a className={cn(
                "px-3 py-2 rounded-md flex items-center text-sm font-medium w-full",
                location === "/farmasi" ? "bg-primary-light" : "hover:bg-primary-light transition"
              )}>
                <span className="mr-3">
                  <FlaskRound className="h-5 w-5" />
                </span>
                Farmasi
              </a>
            </Link>
            
            <Link href="/laboratorium">
              <a className={cn(
                "px-3 py-2 rounded-md flex items-center text-sm font-medium w-full",
                location === "/laboratorium" ? "bg-primary-light" : "hover:bg-primary-light transition"
              )}>
                <span className="mr-3">
                  <Microscope className="h-5 w-5" />
                </span>
                Laboratorium
              </a>
            </Link>
            
            <Link href="/radiologi">
              <a className={cn(
                "px-3 py-2 rounded-md flex items-center text-sm font-medium w-full",
                location === "/radiologi" ? "bg-primary-light" : "hover:bg-primary-light transition"
              )}>
                <span className="mr-3">
                  <Stethoscope className="h-5 w-5" />
                </span>
                Radiologi
              </a>
            </Link>
            
            <Link href="/laporan">
              <a className={cn(
                "px-3 py-2 rounded-md flex items-center text-sm font-medium w-full",
                location === "/laporan" ? "bg-primary-light" : "hover:bg-primary-light transition"
              )}>
                <span className="mr-3">
                  <BarChart2 className="h-5 w-5" />
                </span>
                Laporan
              </a>
            </Link>
            
            <Link href="/pengaturan">
              <a className={cn(
                "px-3 py-2 rounded-md flex items-center text-sm font-medium w-full",
                location === "/pengaturan" ? "bg-primary-light" : "hover:bg-primary-light transition"
              )}>
                <span className="mr-3">
                  <Settings className="h-5 w-5" />
                </span>
                Pengaturan
              </a>
            </Link>
            
            <div className="mt-4 pt-4 border-t border-primary-dark">
              <Link href="/bantuan">
                <a className={cn(
                  "px-3 py-2 rounded-md flex items-center text-sm font-medium w-full",
                  location === "/bantuan" ? "bg-primary-light" : "hover:bg-primary-light transition"
                )}>
                  <span className="mr-3">
                    <HelpCircle className="h-5 w-5" />
                  </span>
                  Bantuan
                </a>
              </Link>
              
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md flex items-center text-sm font-medium w-full hover:bg-primary-light transition"
                disabled={logoutMutation.isPending}
              >
                <span className="mr-3">
                  <LogOut className="h-5 w-5" />
                </span>
                {logoutMutation.isPending ? "Keluar..." : "Keluar"}
              </button>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}
