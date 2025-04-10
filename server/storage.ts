import {
  users, type User, type InsertUser,
  pasien, type Pasien, type InsertPasien,
  jadwal, type Jadwal, type InsertJadwal,
  rekamMedis, type RekamMedis, type InsertRekamMedis,
  rawatInap, type RawatInap, type InsertRawatInap,
  obat, type Obat, type InsertObat,
  resep, type Resep, type InsertResep,
  detailResep, type DetailResep, type InsertDetailResep,
  laboratorium, type Laboratorium, type InsertLaboratorium,
  radiologi, type Radiologi, type InsertRadiologi,
  aktivitas, type Aktivitas, type InsertAktivitas
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Pasien methods
  getPasien(id: number): Promise<Pasien | undefined>;
  getPasienByNomorRM(nomorRM: string): Promise<Pasien | undefined>;
  getPasienByNIK(nik: string): Promise<Pasien | undefined>;
  createPasien(pasien: InsertPasien): Promise<Pasien>;
  updatePasien(id: number, pasien: Partial<Pasien>): Promise<Pasien | undefined>;
  deletePasien(id: number): Promise<boolean>;
  getAllPasien(): Promise<Pasien[]>;
  
  // Jadwal methods
  getJadwal(id: number): Promise<Jadwal | undefined>;
  createJadwal(jadwal: InsertJadwal): Promise<Jadwal>;
  updateJadwal(id: number, jadwal: Partial<Jadwal>): Promise<Jadwal | undefined>;
  deleteJadwal(id: number): Promise<boolean>;
  getJadwalByPasien(pasienId: number): Promise<Jadwal[]>;
  getJadwalByDokter(dokterUserId: number): Promise<Jadwal[]>;
  getJadwalByTanggal(tanggal: Date): Promise<Jadwal[]>;
  getAllJadwal(): Promise<Jadwal[]>;
  
  // RekamMedis methods
  getRekamMedis(id: number): Promise<RekamMedis | undefined>;
  createRekamMedis(rekamMedis: InsertRekamMedis): Promise<RekamMedis>;
  updateRekamMedis(id: number, rekamMedis: Partial<RekamMedis>): Promise<RekamMedis | undefined>;
  getRekamMedisByPasien(pasienId: number): Promise<RekamMedis[]>;
  getAllRekamMedis(): Promise<RekamMedis[]>;
  
  // RawatInap methods
  getRawatInap(id: number): Promise<RawatInap | undefined>;
  createRawatInap(rawatInap: InsertRawatInap): Promise<RawatInap>;
  updateRawatInap(id: number, rawatInap: Partial<RawatInap>): Promise<RawatInap | undefined>;
  getRawatInapByPasien(pasienId: number): Promise<RawatInap[]>;
  getRawatInapAktif(): Promise<RawatInap[]>;
  getAllRawatInap(): Promise<RawatInap[]>;
  
  // Obat methods
  getObat(id: number): Promise<Obat | undefined>;
  getObatByKode(kode: string): Promise<Obat | undefined>;
  createObat(obat: InsertObat): Promise<Obat>;
  updateObat(id: number, obat: Partial<Obat>): Promise<Obat | undefined>;
  deleteObat(id: number): Promise<boolean>;
  getAllObat(): Promise<Obat[]>;
  
  // Resep methods
  getResep(id: number): Promise<Resep | undefined>;
  createResep(resep: InsertResep): Promise<Resep>;
  updateResep(id: number, resep: Partial<Resep>): Promise<Resep | undefined>;
  getResepByRekamMedis(rekamMedisId: number): Promise<Resep | undefined>;
  getAllResep(): Promise<Resep[]>;
  
  // DetailResep methods
  getDetailResep(id: number): Promise<DetailResep | undefined>;
  createDetailResep(detailResep: InsertDetailResep): Promise<DetailResep>;
  updateDetailResep(id: number, detailResep: Partial<DetailResep>): Promise<DetailResep | undefined>;
  getDetailResepByResep(resepId: number): Promise<DetailResep[]>;
  
  // Laboratorium methods
  getLaboratorium(id: number): Promise<Laboratorium | undefined>;
  createLaboratorium(laboratorium: InsertLaboratorium): Promise<Laboratorium>;
  updateLaboratorium(id: number, laboratorium: Partial<Laboratorium>): Promise<Laboratorium | undefined>;
  getLaboratoriumByPasien(pasienId: number): Promise<Laboratorium[]>;
  getAllLaboratorium(): Promise<Laboratorium[]>;
  
  // Radiologi methods
  getRadiologi(id: number): Promise<Radiologi | undefined>;
  createRadiologi(radiologi: InsertRadiologi): Promise<Radiologi>;
  updateRadiologi(id: number, radiologi: Partial<Radiologi>): Promise<Radiologi | undefined>;
  getRadiologiByPasien(pasienId: number): Promise<Radiologi[]>;
  getAllRadiologi(): Promise<Radiologi[]>;
  
  // Aktivitas methods
  getAktivitas(id: number): Promise<Aktivitas | undefined>;
  createAktivitas(aktivitas: InsertAktivitas): Promise<Aktivitas>;
  getAktivitasByUser(userId: number): Promise<Aktivitas[]>;
  getAktivitasByPasien(pasienId: number): Promise<Aktivitas[]>;
  getAktivitasTerbaru(limit: number): Promise<Aktivitas[]>;
  getAllAktivitas(): Promise<Aktivitas[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pasien: Map<number, Pasien>;
  private jadwal: Map<number, Jadwal>;
  private rekamMedis: Map<number, RekamMedis>;
  private rawatInap: Map<number, RawatInap>;
  private obat: Map<number, Obat>;
  private resep: Map<number, Resep>;
  private detailResep: Map<number, DetailResep>;
  private laboratorium: Map<number, Laboratorium>;
  private radiologi: Map<number, Radiologi>;
  private aktivitas: Map<number, Aktivitas>;
  
  sessionStore: session.SessionStore;
  
  private userId: number = 1;
  private pasienId: number = 1;
  private jadwalId: number = 1;
  private rekamMedisId: number = 1;
  private rawatInapId: number = 1;
  private obatId: number = 1;
  private resepId: number = 1;
  private detailResepId: number = 1;
  private laboratoriumId: number = 1;
  private radiologiId: number = 1;
  private aktivitasId: number = 1;

  constructor() {
    this.users = new Map();
    this.pasien = new Map();
    this.jadwal = new Map();
    this.rekamMedis = new Map();
    this.rawatInap = new Map();
    this.obat = new Map();
    this.resep = new Map();
    this.detailResep = new Map();
    this.laboratorium = new Map();
    this.radiologi = new Map();
    this.aktivitas = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // one day
    });
    
    // Create default admin user with pre-hashed password
    // Use a consistent salt/hash for demo purposes
    const adminUser: User = {
      id: this.userId++,
      username: "admin",
      password: "5417d890182f61c0b67614542a143cc9b0526c4cf15e31d0fdb65d736e3a52d1ab38bbdb7e8adcf51b09e5e63aa58c43480e469eaa8702fdb0090bb15907dd25.cc82b02c8204efdfb46bd4aab4c2eab5",
      nama: "Administrator",
      role: "admin",
      rumahSakit: "RSUD Harapan Bunda",
      active: true
    };
    this.users.set(adminUser.id, adminUser);
    
    // Create example doctor user with pre-hashed password
    const doctorUser: User = {
      id: this.userId++,
      username: "dokter",
      password: "5b8ca59f99c923887691effdfc67a108dcad5b9f6b630a4799eb008dfda7a1ba9b5fc94cd49573c26fe6bb3ae2cf8da2deafd49ee1e14b5bd29a27c9ba92d9c3.93bb484c267a9cf5f9e4f35b815904d2",
      nama: "dr. Budi Santoso",
      role: "dokter",
      rumahSakit: "RSUD Harapan Bunda",
      active: true
    };
    this.users.set(doctorUser.id, doctorUser);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { ...user, id, active: true };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Pasien methods
  async getPasien(id: number): Promise<Pasien | undefined> {
    return this.pasien.get(id);
  }
  
  async getPasienByNomorRM(nomorRM: string): Promise<Pasien | undefined> {
    return Array.from(this.pasien.values()).find(
      (pasien) => pasien.nomorRM === nomorRM
    );
  }
  
  async getPasienByNIK(nik: string): Promise<Pasien | undefined> {
    return Array.from(this.pasien.values()).find(
      (pasien) => pasien.nik === nik
    );
  }
  
  async createPasien(pasienData: InsertPasien): Promise<Pasien> {
    const id = this.pasienId++;
    const now = new Date();
    
    // Generate Nomor RM if not provided
    if (!pasienData.nomorRM) {
      const yearMonth = now.getFullYear().toString().substr(-2) + 
                      (now.getMonth() + 1).toString().padStart(2, '0');
      pasienData.nomorRM = `RM${yearMonth}${id.toString().padStart(4, '0')}`;
    }
    
    const newPasien: Pasien = { 
      ...pasienData, 
      id, 
      createdAt: now,
      updatedAt: now,
      statusSinkronisasi: "belum",
      satuSehatId: null
    };
    
    this.pasien.set(id, newPasien);
    return newPasien;
  }
  
  async updatePasien(id: number, pasienData: Partial<Pasien>): Promise<Pasien | undefined> {
    const pasien = await this.getPasien(id);
    if (!pasien) return undefined;
    
    const updatedPasien = { 
      ...pasien, 
      ...pasienData, 
      updatedAt: new Date() 
    };
    
    this.pasien.set(id, updatedPasien);
    return updatedPasien;
  }
  
  async deletePasien(id: number): Promise<boolean> {
    return this.pasien.delete(id);
  }
  
  async getAllPasien(): Promise<Pasien[]> {
    return Array.from(this.pasien.values());
  }

  // Jadwal methods
  async getJadwal(id: number): Promise<Jadwal | undefined> {
    return this.jadwal.get(id);
  }
  
  async createJadwal(jadwalData: InsertJadwal): Promise<Jadwal> {
    const id = this.jadwalId++;
    const now = new Date();
    
    const newJadwal: Jadwal = { 
      ...jadwalData, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    
    this.jadwal.set(id, newJadwal);
    return newJadwal;
  }
  
  async updateJadwal(id: number, jadwalData: Partial<Jadwal>): Promise<Jadwal | undefined> {
    const jadwal = await this.getJadwal(id);
    if (!jadwal) return undefined;
    
    const updatedJadwal = { 
      ...jadwal, 
      ...jadwalData, 
      updatedAt: new Date() 
    };
    
    this.jadwal.set(id, updatedJadwal);
    return updatedJadwal;
  }
  
  async deleteJadwal(id: number): Promise<boolean> {
    return this.jadwal.delete(id);
  }
  
  async getJadwalByPasien(pasienId: number): Promise<Jadwal[]> {
    return Array.from(this.jadwal.values()).filter(
      (jadwal) => jadwal.pasienId === pasienId
    );
  }
  
  async getJadwalByDokter(dokterUserId: number): Promise<Jadwal[]> {
    return Array.from(this.jadwal.values()).filter(
      (jadwal) => jadwal.dokterUserId === dokterUserId
    );
  }
  
  async getJadwalByTanggal(tanggal: Date): Promise<Jadwal[]> {
    const targetDate = new Date(tanggal.setHours(0, 0, 0, 0));
    
    return Array.from(this.jadwal.values()).filter(jadwal => {
      const jadwalDate = new Date(jadwal.tanggal);
      jadwalDate.setHours(0, 0, 0, 0);
      return jadwalDate.getTime() === targetDate.getTime();
    });
  }
  
  async getAllJadwal(): Promise<Jadwal[]> {
    return Array.from(this.jadwal.values());
  }

  // RekamMedis methods
  async getRekamMedis(id: number): Promise<RekamMedis | undefined> {
    return this.rekamMedis.get(id);
  }
  
  async createRekamMedis(rekamMedisData: InsertRekamMedis): Promise<RekamMedis> {
    const id = this.rekamMedisId++;
    const now = new Date();
    
    const newRekamMedis: RekamMedis = { 
      ...rekamMedisData, 
      id, 
      createdAt: now,
      updatedAt: now,
      statusSinkronisasi: "belum"
    };
    
    this.rekamMedis.set(id, newRekamMedis);
    return newRekamMedis;
  }
  
  async updateRekamMedis(id: number, rekamMedisData: Partial<RekamMedis>): Promise<RekamMedis | undefined> {
    const rekamMedis = await this.getRekamMedis(id);
    if (!rekamMedis) return undefined;
    
    const updatedRekamMedis = { 
      ...rekamMedis, 
      ...rekamMedisData, 
      updatedAt: new Date() 
    };
    
    this.rekamMedis.set(id, updatedRekamMedis);
    return updatedRekamMedis;
  }
  
  async getRekamMedisByPasien(pasienId: number): Promise<RekamMedis[]> {
    return Array.from(this.rekamMedis.values()).filter(
      (rekamMedis) => rekamMedis.pasienId === pasienId
    );
  }
  
  async getAllRekamMedis(): Promise<RekamMedis[]> {
    return Array.from(this.rekamMedis.values());
  }

  // RawatInap methods
  async getRawatInap(id: number): Promise<RawatInap | undefined> {
    return this.rawatInap.get(id);
  }
  
  async createRawatInap(rawatInapData: InsertRawatInap): Promise<RawatInap> {
    const id = this.rawatInapId++;
    const now = new Date();
    
    const newRawatInap: RawatInap = { 
      ...rawatInapData, 
      id, 
      createdAt: now,
      updatedAt: now,
      tanggalKeluar: null,
      diagnosisAkhir: null
    };
    
    this.rawatInap.set(id, newRawatInap);
    return newRawatInap;
  }
  
  async updateRawatInap(id: number, rawatInapData: Partial<RawatInap>): Promise<RawatInap | undefined> {
    const rawatInap = await this.getRawatInap(id);
    if (!rawatInap) return undefined;
    
    const updatedRawatInap = { 
      ...rawatInap, 
      ...rawatInapData, 
      updatedAt: new Date() 
    };
    
    this.rawatInap.set(id, updatedRawatInap);
    return updatedRawatInap;
  }
  
  async getRawatInapByPasien(pasienId: number): Promise<RawatInap[]> {
    return Array.from(this.rawatInap.values()).filter(
      (rawatInap) => rawatInap.pasienId === pasienId
    );
  }
  
  async getRawatInapAktif(): Promise<RawatInap[]> {
    return Array.from(this.rawatInap.values()).filter(
      (rawatInap) => rawatInap.status === "aktif"
    );
  }
  
  async getAllRawatInap(): Promise<RawatInap[]> {
    return Array.from(this.rawatInap.values());
  }

  // Obat methods
  async getObat(id: number): Promise<Obat | undefined> {
    return this.obat.get(id);
  }
  
  async getObatByKode(kode: string): Promise<Obat | undefined> {
    return Array.from(this.obat.values()).find(
      (obat) => obat.kode === kode
    );
  }
  
  async createObat(obatData: InsertObat): Promise<Obat> {
    const id = this.obatId++;
    const now = new Date();
    
    const newObat: Obat = { 
      ...obatData, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    
    this.obat.set(id, newObat);
    return newObat;
  }
  
  async updateObat(id: number, obatData: Partial<Obat>): Promise<Obat | undefined> {
    const obat = await this.getObat(id);
    if (!obat) return undefined;
    
    const updatedObat = { 
      ...obat, 
      ...obatData, 
      updatedAt: new Date() 
    };
    
    this.obat.set(id, updatedObat);
    return updatedObat;
  }
  
  async deleteObat(id: number): Promise<boolean> {
    return this.obat.delete(id);
  }
  
  async getAllObat(): Promise<Obat[]> {
    return Array.from(this.obat.values());
  }

  // Resep methods
  async getResep(id: number): Promise<Resep | undefined> {
    return this.resep.get(id);
  }
  
  async createResep(resepData: InsertResep): Promise<Resep> {
    const id = this.resepId++;
    const now = new Date();
    
    const newResep: Resep = { 
      ...resepData, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    
    this.resep.set(id, newResep);
    return newResep;
  }
  
  async updateResep(id: number, resepData: Partial<Resep>): Promise<Resep | undefined> {
    const resep = await this.getResep(id);
    if (!resep) return undefined;
    
    const updatedResep = { 
      ...resep, 
      ...resepData, 
      updatedAt: new Date() 
    };
    
    this.resep.set(id, updatedResep);
    return updatedResep;
  }
  
  async getResepByRekamMedis(rekamMedisId: number): Promise<Resep | undefined> {
    return Array.from(this.resep.values()).find(
      (resep) => resep.rekamMedisId === rekamMedisId
    );
  }
  
  async getAllResep(): Promise<Resep[]> {
    return Array.from(this.resep.values());
  }

  // DetailResep methods
  async getDetailResep(id: number): Promise<DetailResep | undefined> {
    return this.detailResep.get(id);
  }
  
  async createDetailResep(detailResepData: InsertDetailResep): Promise<DetailResep> {
    const id = this.detailResepId++;
    const now = new Date();
    
    const newDetailResep: DetailResep = { 
      ...detailResepData, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    
    this.detailResep.set(id, newDetailResep);
    return newDetailResep;
  }
  
  async updateDetailResep(id: number, detailResepData: Partial<DetailResep>): Promise<DetailResep | undefined> {
    const detailResep = await this.getDetailResep(id);
    if (!detailResep) return undefined;
    
    const updatedDetailResep = { 
      ...detailResep, 
      ...detailResepData, 
      updatedAt: new Date() 
    };
    
    this.detailResep.set(id, updatedDetailResep);
    return updatedDetailResep;
  }
  
  async getDetailResepByResep(resepId: number): Promise<DetailResep[]> {
    return Array.from(this.detailResep.values()).filter(
      (detailResep) => detailResep.resepId === resepId
    );
  }

  // Laboratorium methods
  async getLaboratorium(id: number): Promise<Laboratorium | undefined> {
    return this.laboratorium.get(id);
  }
  
  async createLaboratorium(laboratoriumData: InsertLaboratorium): Promise<Laboratorium> {
    const id = this.laboratoriumId++;
    const now = new Date();
    
    const newLaboratorium: Laboratorium = { 
      ...laboratoriumData, 
      id, 
      hasilPemeriksaan: null,
      kesimpulan: null,
      createdAt: now,
      updatedAt: now
    };
    
    this.laboratorium.set(id, newLaboratorium);
    return newLaboratorium;
  }
  
  async updateLaboratorium(id: number, laboratoriumData: Partial<Laboratorium>): Promise<Laboratorium | undefined> {
    const laboratorium = await this.getLaboratorium(id);
    if (!laboratorium) return undefined;
    
    const updatedLaboratorium = { 
      ...laboratorium, 
      ...laboratoriumData, 
      updatedAt: new Date() 
    };
    
    this.laboratorium.set(id, updatedLaboratorium);
    return updatedLaboratorium;
  }
  
  async getLaboratoriumByPasien(pasienId: number): Promise<Laboratorium[]> {
    return Array.from(this.laboratorium.values()).filter(
      (lab) => lab.pasienId === pasienId
    );
  }
  
  async getAllLaboratorium(): Promise<Laboratorium[]> {
    return Array.from(this.laboratorium.values());
  }

  // Radiologi methods
  async getRadiologi(id: number): Promise<Radiologi | undefined> {
    return this.radiologi.get(id);
  }
  
  async createRadiologi(radiologiData: InsertRadiologi): Promise<Radiologi> {
    const id = this.radiologiId++;
    const now = new Date();
    
    const newRadiologi: Radiologi = { 
      ...radiologiData, 
      id, 
      hasilPemeriksaan: null,
      kesimpulan: null,
      createdAt: now,
      updatedAt: now
    };
    
    this.radiologi.set(id, newRadiologi);
    return newRadiologi;
  }
  
  async updateRadiologi(id: number, radiologiData: Partial<Radiologi>): Promise<Radiologi | undefined> {
    const radiologi = await this.getRadiologi(id);
    if (!radiologi) return undefined;
    
    const updatedRadiologi = { 
      ...radiologi, 
      ...radiologiData, 
      updatedAt: new Date() 
    };
    
    this.radiologi.set(id, updatedRadiologi);
    return updatedRadiologi;
  }
  
  async getRadiologiByPasien(pasienId: number): Promise<Radiologi[]> {
    return Array.from(this.radiologi.values()).filter(
      (rad) => rad.pasienId === pasienId
    );
  }
  
  async getAllRadiologi(): Promise<Radiologi[]> {
    return Array.from(this.radiologi.values());
  }

  // Aktivitas methods
  async getAktivitas(id: number): Promise<Aktivitas | undefined> {
    return this.aktivitas.get(id);
  }
  
  async createAktivitas(aktivitasData: InsertAktivitas): Promise<Aktivitas> {
    const id = this.aktivitasId++;
    const now = new Date();
    
    const newAktivitas: Aktivitas = { 
      ...aktivitasData, 
      id, 
      createdAt: now
    };
    
    this.aktivitas.set(id, newAktivitas);
    return newAktivitas;
  }
  
  async getAktivitasByUser(userId: number): Promise<Aktivitas[]> {
    return Array.from(this.aktivitas.values())
      .filter(akt => akt.userId === userId)
      .sort((a, b) => b.tanggal.getTime() - a.tanggal.getTime());
  }
  
  async getAktivitasByPasien(pasienId: number): Promise<Aktivitas[]> {
    return Array.from(this.aktivitas.values())
      .filter(akt => akt.pasienId === pasienId)
      .sort((a, b) => b.tanggal.getTime() - a.tanggal.getTime());
  }
  
  async getAktivitasTerbaru(limit: number): Promise<Aktivitas[]> {
    return Array.from(this.aktivitas.values())
      .sort((a, b) => b.tanggal.getTime() - a.tanggal.getTime())
      .slice(0, limit);
  }
  
  async getAllAktivitas(): Promise<Aktivitas[]> {
    return Array.from(this.aktivitas.values())
      .sort((a, b) => b.tanggal.getTime() - a.tanggal.getTime());
  }
}

export const storage = new MemStorage();
