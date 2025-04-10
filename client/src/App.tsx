import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import { ProtectedRoute } from "./lib/protected-route";
import PasienPage from "@/pages/pasien";
import PendaftaranPasien from "@/pages/pasien/pendaftaran";
import DataPasien from "@/pages/pasien/data-pasien";
import JadwalPage from "@/pages/jadwal";
import RekamMedisPage from "@/pages/rekam-medis";
import RawatJalanPage from "@/pages/rawat-jalan";
import RawatInapPage from "@/pages/rawat-inap";
import FarmasiPage from "@/pages/farmasi";
import LaboratoriumPage from "@/pages/laboratorium";
import RadiologiPage from "@/pages/radiologi";
import LaporanPage from "@/pages/laporan";
import PengaturanPage from "@/pages/pengaturan";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/pasien" component={PasienPage} />
      <ProtectedRoute path="/pasien/pendaftaran" component={PendaftaranPasien} />
      <ProtectedRoute path="/pasien/data" component={DataPasien} />
      <ProtectedRoute path="/jadwal" component={JadwalPage} />
      <ProtectedRoute path="/rekam-medis" component={RekamMedisPage} />
      <ProtectedRoute path="/rawat-jalan" component={RawatJalanPage} />
      <ProtectedRoute path="/rawat-inap" component={RawatInapPage} />
      <ProtectedRoute path="/farmasi" component={FarmasiPage} />
      <ProtectedRoute path="/laboratorium" component={LaboratoriumPage} />
      <ProtectedRoute path="/radiologi" component={RadiologiPage} />
      <ProtectedRoute path="/laporan" component={LaporanPage} />
      <ProtectedRoute path="/pengaturan" component={PengaturanPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
