import { useLocation, Link } from "wouter";
import { Bell, Settings, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  subtitle?: string;
  backButton?: boolean;
  backButtonLink?: string;
}

export default function Header({ title, subtitle, backButton = false, backButtonLink = "/" }: HeaderProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <header className="px-4 md:px-6 mb-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {backButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-3 text-neutral-dark hover:bg-neutral-light transition"
              asChild
            >
              <Link href={backButtonLink}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-nunito font-bold text-neutral-darkest">{title}</h1>
            <p className="text-neutral-dark text-sm">
              {subtitle || (user ? `Selamat datang kembali, ${user.nama.split(' ')[0]}` : '')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Button variant="ghost" size="icon" className="p-2 rounded-full bg-white text-neutral-dark hover:bg-neutral-light transition">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-secondary rounded-full flex items-center justify-center text-white text-xs">3</span>
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden md:flex p-2 rounded-full text-neutral-dark hover:bg-neutral-light transition"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="mt-6 bg-white rounded-lg shadow-sm p-4 flex items-center">
        <div className="flex-1">
          <div className="flex items-center text-sm text-neutral-dark mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Status Integrasi Satu Sehat
          </div>
          <div className="text-sm font-medium text-status-success">Terhubung</div>
        </div>
        
        <Link href="/pengaturan">
          <a className="text-primary hover:text-primary-dark text-sm font-medium">Konfigurasi</a>
        </Link>
      </div>
    </header>
  );
}
