import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Aktivitas, Pasien, User } from "@shared/schema";

interface RecentActivitiesProps {
  aktivitas?: Aktivitas[];
}

export default function RecentActivities({ aktivitas }: RecentActivitiesProps) {
  const { data: pasien } = useQuery<Pasien[]>({
    queryKey: ['/api/pasien'],
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return null;
    
    switch (status.toLowerCase()) {
      case "selesai":
        return <Badge className="bg-status-success">Selesai</Badge>;
      case "menunggu":
        return <Badge variant="outline" className="bg-status-warning/10 text-status-warning border-status-warning">Menunggu</Badge>;
      case "batal":
        return <Badge variant="outline" className="bg-status-error/10 text-status-error border-status-error">Batal</Badge>;
      case "diproses":
        return <Badge variant="outline" className="bg-status-info/10 text-status-info border-status-info">Diproses</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatTanggal = (date: Date) => {
    return new Date(date).toLocaleString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader className="p-4 border-b border-neutral-light flex justify-between items-center">
        <CardTitle className="font-nunito font-bold text-neutral-darkest">Aktivitas Terbaru</CardTitle>
        <Link href="/aktivitas">
          <a className="text-primary hover:text-primary-dark text-sm font-medium">Lihat Semua</a>
        </Link>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Pasien</TableHead>
                <TableHead>Aktivitas</TableHead>
                <TableHead>Petugas</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aktivitas && aktivitas.length > 0 ? (
                aktivitas.map((activity) => {
                  const pasienData = activity.pasienId ? pasien?.find(p => p.id === activity.pasienId) : undefined;
                  const userData = users?.find(u => u.id === activity.userId);
                  
                  return (
                    <TableRow key={activity.id}>
                      <TableCell className="text-sm text-neutral-dark">
                        {pasienData ? `#${pasienData.nomorRM}` : `-`}
                      </TableCell>
                      <TableCell>
                        {pasienData ? (
                          <>
                            <div className="font-medium text-neutral-darkest">{pasienData.nama}</div>
                            <div className="text-xs text-neutral-medium">
                              {new Date(pasienData.tanggalLahir).getFullYear() ? 
                                `${new Date().getFullYear() - new Date(pasienData.tanggalLahir).getFullYear()} Tahun` : ''}, 
                              {pasienData.jenisKelamin}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-neutral-medium">-</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-neutral-dark">{activity.aktivitas}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-neutral-dark">{userData?.nama || "-"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-neutral-dark">{formatTanggal(activity.tanggal)}</div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(activity.status)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {activity.pasienId && (
                          <Link href={`/pasien/detail/${activity.pasienId}`}>
                            <a className="text-primary hover:text-primary-dark">Detail</a>
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-neutral-medium">
                    Belum ada aktivitas yang tercatat
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
