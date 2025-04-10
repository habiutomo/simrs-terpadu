import { Link } from "wouter";
import { UserPlus, Calendar, FileText, BarChart2 } from "lucide-react";

export default function QuickAccess() {
  const quickAccessItems = [
    {
      icon: <UserPlus className="h-6 w-6 text-primary" />,
      title: "Pendaftaran Pasien Baru",
      link: "/pasien/pendaftaran"
    },
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      title: "Jadwalkan Kunjungan",
      link: "/jadwal"
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Rekam Medis",
      link: "/rekam-medis"
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-primary" />,
      title: "Laporan",
      link: "/laporan"
    }
  ];

  return (
    <section className="mb-8">
      <h2 className="text-lg font-nunito font-bold mb-4 text-neutral-darkest">Akses Cepat</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickAccessItems.map((item, index) => (
          <Link key={index} href={item.link}>
            <a className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center justify-center hover:shadow-md transition">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <span className="text-neutral-darkest text-sm font-medium text-center">{item.title}</span>
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
}
