import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import * as z from "zod";
import { 
  insertPasienSchema, 
  insertJadwalSchema, 
  insertRekamMedisSchema,
  insertRawatInapSchema,
  insertObatSchema,
  insertResepSchema,
  insertDetailResepSchema,
  insertLaboratoriumSchema,
  insertRadiologiSchema,
  insertAktivitasSchema
} from "@shared/schema";

// Middleware to check authentication
const requireAuth = (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  setupAuth(app);

  // API routes
  const apiRouter = app.use("/api", requireAuth);

  // Pasien routes
  app.get("/api/pasien", async (req, res) => {
    try {
      const pasien = await storage.getAllPasien();
      res.json(pasien);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data pasien" });
    }
  });

  app.get("/api/pasien/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pasien = await storage.getPasien(id);
      if (!pasien) {
        return res.status(404).json({ message: "Pasien tidak ditemukan" });
      }
      res.json(pasien);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data pasien" });
    }
  });

  app.post("/api/pasien", async (req, res) => {
    try {
      const validatedData = insertPasienSchema.parse(req.body);
      
      // Check duplicate NIK
      const existingNik = await storage.getPasienByNIK(validatedData.nik);
      if (existingNik) {
        return res.status(400).json({ message: "NIK sudah terdaftar" });
      }
      
      const pasien = await storage.createPasien(validatedData);
      
      // Log activity
      await storage.createAktivitas({
        userId: req.user!.id,
        pasienId: pasien.id,
        aktivitas: "Pendaftaran Pasien",
        keterangan: `Pasien ${pasien.nama} berhasil didaftarkan`,
        tanggal: new Date(),
        status: "Selesai"
      });
      
      res.status(201).json(pasien);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Data pasien tidak valid", errors: error.errors });
      }
      res.status(500).json({ message: "Terjadi kesalahan saat membuat data pasien" });
    }
  });

  app.put("/api/pasien/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPasienSchema.partial().parse(req.body);
      const updatedPasien = await storage.updatePasien(id, validatedData);
      
      if (!updatedPasien) {
        return res.status(404).json({ message: "Pasien tidak ditemukan" });
      }
      
      // Log activity
      await storage.createAktivitas({
        userId: req.user!.id,
        pasienId: updatedPasien.id,
        aktivitas: "Update Data Pasien",
        keterangan: `Data pasien ${updatedPasien.nama} berhasil diperbarui`,
        tanggal: new Date(),
        status: "Selesai"
      });
      
      res.json(updatedPasien);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Data pasien tidak valid", errors: error.errors });
      }
      res.status(500).json({ message: "Terjadi kesalahan saat memperbarui data pasien" });
    }
  });

  app.delete("/api/pasien/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pasien = await storage.getPasien(id);
      
      if (!pasien) {
        return res.status(404).json({ message: "Pasien tidak ditemukan" });
      }
      
      const success = await storage.deletePasien(id);
      
      if (success) {
        // Log activity
        await storage.createAktivitas({
          userId: req.user!.id,
          aktivitas: "Hapus Data Pasien",
          keterangan: `Data pasien ${pasien.nama} berhasil dihapus`,
          tanggal: new Date(),
          status: "Selesai"
        });
        
        return res.status(200).json({ message: "Pasien berhasil dihapus" });
      } else {
        return res.status(500).json({ message: "Gagal menghapus pasien" });
      }
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat menghapus data pasien" });
    }
  });

  // Jadwal routes
  app.get("/api/jadwal", async (req, res) => {
    try {
      const jadwal = await storage.getAllJadwal();
      res.json(jadwal);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data jadwal" });
    }
  });

  app.get("/api/jadwal/hari-ini", async (req, res) => {
    try {
      const todayJadwal = await storage.getJadwalByTanggal(new Date());
      res.json(todayJadwal);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil jadwal hari ini" });
    }
  });

  app.get("/api/jadwal/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const jadwal = await storage.getJadwal(id);
      if (!jadwal) {
        return res.status(404).json({ message: "Jadwal tidak ditemukan" });
      }
      res.json(jadwal);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data jadwal" });
    }
  });

  app.post("/api/jadwal", async (req, res) => {
    try {
      const validatedData = insertJadwalSchema.parse(req.body);
      const jadwal = await storage.createJadwal(validatedData);
      
      // Log activity
      const pasien = await storage.getPasien(jadwal.pasienId);
      await storage.createAktivitas({
        userId: req.user!.id,
        pasienId: jadwal.pasienId,
        aktivitas: "Penjadwalan",
        keterangan: `Jadwal baru untuk ${pasien?.nama || 'pasien'} berhasil dibuat`,
        tanggal: new Date(),
        status: "Selesai"
      });
      
      res.status(201).json(jadwal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Data jadwal tidak valid", errors: error.errors });
      }
      res.status(500).json({ message: "Terjadi kesalahan saat membuat jadwal" });
    }
  });

  app.put("/api/jadwal/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertJadwalSchema.partial().parse(req.body);
      const updatedJadwal = await storage.updateJadwal(id, validatedData);
      
      if (!updatedJadwal) {
        return res.status(404).json({ message: "Jadwal tidak ditemukan" });
      }
      
      // Log activity
      const pasien = await storage.getPasien(updatedJadwal.pasienId);
      await storage.createAktivitas({
        userId: req.user!.id,
        pasienId: updatedJadwal.pasienId,
        aktivitas: "Update Jadwal",
        keterangan: `Jadwal untuk ${pasien?.nama || 'pasien'} berhasil diperbarui`,
        tanggal: new Date(),
        status: "Selesai"
      });
      
      res.json(updatedJadwal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Data jadwal tidak valid", errors: error.errors });
      }
      res.status(500).json({ message: "Terjadi kesalahan saat memperbarui jadwal" });
    }
  });

  app.delete("/api/jadwal/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const jadwal = await storage.getJadwal(id);
      
      if (!jadwal) {
        return res.status(404).json({ message: "Jadwal tidak ditemukan" });
      }
      
      const success = await storage.deleteJadwal(id);
      
      if (success) {
        // Log activity
        const pasien = await storage.getPasien(jadwal.pasienId);
        await storage.createAktivitas({
          userId: req.user!.id,
          pasienId: jadwal.pasienId,
          aktivitas: "Hapus Jadwal",
          keterangan: `Jadwal untuk ${pasien?.nama || 'pasien'} berhasil dihapus`,
          tanggal: new Date(),
          status: "Selesai"
        });
        
        return res.status(200).json({ message: "Jadwal berhasil dihapus" });
      } else {
        return res.status(500).json({ message: "Gagal menghapus jadwal" });
      }
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat menghapus jadwal" });
    }
  });

  // Rekam Medis routes
  app.get("/api/rekam-medis", async (req, res) => {
    try {
      const rekamMedis = await storage.getAllRekamMedis();
      res.json(rekamMedis);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data rekam medis" });
    }
  });

  app.get("/api/rekam-medis/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const rekamMedis = await storage.getRekamMedis(id);
      if (!rekamMedis) {
        return res.status(404).json({ message: "Rekam medis tidak ditemukan" });
      }
      res.json(rekamMedis);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data rekam medis" });
    }
  });

  app.get("/api/rekam-medis/pasien/:pasienId", async (req, res) => {
    try {
      const pasienId = parseInt(req.params.pasienId);
      const rekamMedis = await storage.getRekamMedisByPasien(pasienId);
      res.json(rekamMedis);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data rekam medis pasien" });
    }
  });

  app.post("/api/rekam-medis", async (req, res) => {
    try {
      const validatedData = insertRekamMedisSchema.parse(req.body);
      const rekamMedis = await storage.createRekamMedis(validatedData);
      
      // Log activity
      const pasien = await storage.getPasien(rekamMedis.pasienId);
      await storage.createAktivitas({
        userId: req.user!.id,
        pasienId: rekamMedis.pasienId,
        aktivitas: "Pembuatan Rekam Medis",
        keterangan: `Rekam medis baru untuk ${pasien?.nama || 'pasien'} berhasil dibuat`,
        tanggal: new Date(),
        status: "Selesai"
      });
      
      res.status(201).json(rekamMedis);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Data rekam medis tidak valid", errors: error.errors });
      }
      res.status(500).json({ message: "Terjadi kesalahan saat membuat rekam medis" });
    }
  });

  app.put("/api/rekam-medis/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertRekamMedisSchema.partial().parse(req.body);
      const updatedRekamMedis = await storage.updateRekamMedis(id, validatedData);
      
      if (!updatedRekamMedis) {
        return res.status(404).json({ message: "Rekam medis tidak ditemukan" });
      }
      
      // Log activity
      const pasien = await storage.getPasien(updatedRekamMedis.pasienId);
      await storage.createAktivitas({
        userId: req.user!.id,
        pasienId: updatedRekamMedis.pasienId,
        aktivitas: "Update Rekam Medis",
        keterangan: `Rekam medis untuk ${pasien?.nama || 'pasien'} berhasil diperbarui`,
        tanggal: new Date(),
        status: "Selesai"
      });
      
      res.json(updatedRekamMedis);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Data rekam medis tidak valid", errors: error.errors });
      }
      res.status(500).json({ message: "Terjadi kesalahan saat memperbarui rekam medis" });
    }
  });

  // Rawat Inap routes
  app.get("/api/rawat-inap", async (req, res) => {
    try {
      const rawatInap = await storage.getAllRawatInap();
      res.json(rawatInap);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data rawat inap" });
    }
  });

  app.get("/api/rawat-inap/aktif", async (req, res) => {
    try {
      const rawatInapAktif = await storage.getRawatInapAktif();
      res.json(rawatInapAktif);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data rawat inap aktif" });
    }
  });

  app.get("/api/rawat-inap/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const rawatInap = await storage.getRawatInap(id);
      if (!rawatInap) {
        return res.status(404).json({ message: "Data rawat inap tidak ditemukan" });
      }
      res.json(rawatInap);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data rawat inap" });
    }
  });

  app.post("/api/rawat-inap", async (req, res) => {
    try {
      const validatedData = insertRawatInapSchema.parse(req.body);
      const rawatInap = await storage.createRawatInap(validatedData);
      
      // Log activity
      const pasien = await storage.getPasien(rawatInap.pasienId);
      await storage.createAktivitas({
        userId: req.user!.id,
        pasienId: rawatInap.pasienId,
        aktivitas: "Pendaftaran Rawat Inap",
        keterangan: `${pasien?.nama || 'Pasien'} terdaftar untuk rawat inap di ruangan ${rawatInap.ruangan}`,
        tanggal: new Date(),
        status: "Aktif"
      });
      
      res.status(201).json(rawatInap);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Data rawat inap tidak valid", errors: error.errors });
      }
      res.status(500).json({ message: "Terjadi kesalahan saat membuat data rawat inap" });
    }
  });

  app.put("/api/rawat-inap/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertRawatInapSchema.partial().parse(req.body);
      const updatedRawatInap = await storage.updateRawatInap(id, validatedData);
      
      if (!updatedRawatInap) {
        return res.status(404).json({ message: "Data rawat inap tidak ditemukan" });
      }
      
      // Log activity
      const pasien = await storage.getPasien(updatedRawatInap.pasienId);
      await storage.createAktivitas({
        userId: req.user!.id,
        pasienId: updatedRawatInap.pasienId,
        aktivitas: "Update Rawat Inap",
        keterangan: `Data rawat inap ${pasien?.nama || 'pasien'} berhasil diperbarui`,
        tanggal: new Date(),
        status: updatedRawatInap.status
      });
      
      res.json(updatedRawatInap);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Data rawat inap tidak valid", errors: error.errors });
      }
      res.status(500).json({ message: "Terjadi kesalahan saat memperbarui data rawat inap" });
    }
  });

  // Obat routes
  app.get("/api/obat", async (req, res) => {
    try {
      const obat = await storage.getAllObat();
      res.json(obat);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data obat" });
    }
  });

  app.get("/api/obat/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const obat = await storage.getObat(id);
      if (!obat) {
        return res.status(404).json({ message: "Obat tidak ditemukan" });
      }
      res.json(obat);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data obat" });
    }
  });

  app.post("/api/obat", async (req, res) => {
    try {
      const validatedData = insertObatSchema.parse(req.body);
      
      // Check duplicate kode
      const existingObat = await storage.getObatByKode(validatedData.kode);
      if (existingObat) {
        return res.status(400).json({ message: "Kode obat sudah terdaftar" });
      }
      
      const obat = await storage.createObat(validatedData);
      
      // Log activity
      await storage.createAktivitas({
        userId: req.user!.id,
        aktivitas: "Tambah Obat",
        keterangan: `Obat ${obat.nama} berhasil ditambahkan`,
        tanggal: new Date(),
        status: "Selesai"
      });
      
      res.status(201).json(obat);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Data obat tidak valid", errors: error.errors });
      }
      res.status(500).json({ message: "Terjadi kesalahan saat menambahkan obat" });
    }
  });

  app.put("/api/obat/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertObatSchema.partial().parse(req.body);
      const updatedObat = await storage.updateObat(id, validatedData);
      
      if (!updatedObat) {
        return res.status(404).json({ message: "Obat tidak ditemukan" });
      }
      
      // Log activity
      await storage.createAktivitas({
        userId: req.user!.id,
        aktivitas: "Update Obat",
        keterangan: `Obat ${updatedObat.nama} berhasil diperbarui`,
        tanggal: new Date(),
        status: "Selesai"
      });
      
      res.json(updatedObat);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Data obat tidak valid", errors: error.errors });
      }
      res.status(500).json({ message: "Terjadi kesalahan saat memperbarui obat" });
    }
  });

  app.delete("/api/obat/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const obat = await storage.getObat(id);
      
      if (!obat) {
        return res.status(404).json({ message: "Obat tidak ditemukan" });
      }
      
      const success = await storage.deleteObat(id);
      
      if (success) {
        // Log activity
        await storage.createAktivitas({
          userId: req.user!.id,
          aktivitas: "Hapus Obat",
          keterangan: `Obat ${obat.nama} berhasil dihapus`,
          tanggal: new Date(),
          status: "Selesai"
        });
        
        return res.status(200).json({ message: "Obat berhasil dihapus" });
      } else {
        return res.status(500).json({ message: "Gagal menghapus obat" });
      }
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat menghapus obat" });
    }
  });

  // Resep routes
  app.get("/api/resep", async (req, res) => {
    try {
      const resep = await storage.getAllResep();
      res.json(resep);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data resep" });
    }
  });

  app.get("/api/resep/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const resep = await storage.getResep(id);
      if (!resep) {
        return res.status(404).json({ message: "Resep tidak ditemukan" });
      }
      
      // Get detail resep
      const detailResep = await storage.getDetailResepByResep(id);
      
      res.json({ ...resep, detail: detailResep });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data resep" });
    }
  });

  app.post("/api/resep", async (req, res) => {
    try {
      const { resep, detail } = req.body;
      
      const validatedResep = insertResepSchema.parse(resep);
      const createdResep = await storage.createResep(validatedResep);
      
      const detailResepItems = [];
      
      // Create detail resep
      if (Array.isArray(detail) && detail.length > 0) {
        for (const item of detail) {
          const validatedDetail = insertDetailResepSchema.parse({
            ...item,
            resepId: createdResep.id
          });
          
          const detailResep = await storage.createDetailResep(validatedDetail);
          detailResepItems.push(detailResep);
          
          // Update stock
          const obat = await storage.getObat(validatedDetail.obatId);
          if (obat) {
            await storage.updateObat(obat.id, {
              stok: obat.stok - validatedDetail.jumlah
            });
          }
        }
      }
      
      // Log activity
      const rekamMedis = await storage.getRekamMedis(createdResep.rekamMedisId);
      if (rekamMedis) {
        const pasien = await storage.getPasien(rekamMedis.pasienId);
        await storage.createAktivitas({
          userId: req.user!.id,
          pasienId: rekamMedis.pasienId,
          aktivitas: "Pembuatan Resep",
          keterangan: `Resep dibuat untuk ${pasien?.nama || 'pasien'}`,
          tanggal: new Date(),
          status: "Menunggu"
        });
      }
      
      res.status(201).json({ ...createdResep, detail: detailResepItems });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Data resep tidak valid", errors: error.errors });
      }
      res.status(500).json({ message: "Terjadi kesalahan saat membuat resep" });
    }
  });

  app.put("/api/resep/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertResepSchema.partial().parse(req.body);
      const updatedResep = await storage.updateResep(id, validatedData);
      
      if (!updatedResep) {
        return res.status(404).json({ message: "Resep tidak ditemukan" });
      }
      
      // Log activity
      const rekamMedis = await storage.getRekamMedis(updatedResep.rekamMedisId);
      if (rekamMedis) {
        const pasien = await storage.getPasien(rekamMedis.pasienId);
        await storage.createAktivitas({
          userId: req.user!.id,
          pasienId: rekamMedis.pasienId,
          aktivitas: "Update Status Resep",
          keterangan: `Status resep untuk ${pasien?.nama || 'pasien'} diubah menjadi ${updatedResep.status}`,
          tanggal: new Date(),
          status: updatedResep.status
        });
      }
      
      res.json(updatedResep);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Data resep tidak valid", errors: error.errors });
      }
      res.status(500).json({ message: "Terjadi kesalahan saat memperbarui resep" });
    }
  });

  // Laboratorium routes
  app.get("/api/laboratorium", async (req, res) => {
    try {
      const laboratorium = await storage.getAllLaboratorium();
      res.json(laboratorium);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data laboratorium" });
    }
  });

  app.get("/api/laboratorium/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const laboratorium = await storage.getLaboratorium(id);
      if (!laboratorium) {
        return res.status(404).json({ message: "Data laboratorium tidak ditemukan" });
      }
      res.json(laboratorium);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data laboratorium" });
    }
  });

  app.post("/api/laboratorium", async (req, res) => {
    try {
      const validatedData = insertLaboratoriumSchema.parse(req.body);
      const laboratorium = await storage.createLaboratorium(validatedData);
      
      // Log activity
      const pasien = await storage.getPasien(laboratorium.pasienId);
      await storage.createAktivitas({
        userId: req.user!.id,
        pasienId: laboratorium.pasienId,
        aktivitas: "Pemeriksaan Laboratorium",
        keterangan: `Pemeriksaan lab ${laboratorium.jenisPemeriksaan} untuk ${pasien?.nama || 'pasien'}`,
        tanggal: new Date(),
        status: "Menunggu"
      });
      
      res.status(201).json(laboratorium);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Data laboratorium tidak valid", errors: error.errors });
      }
      res.status(500).json({ message: "Terjadi kesalahan saat membuat data laboratorium" });
    }
  });

  app.put("/api/laboratorium/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertLaboratoriumSchema.partial().parse(req.body);
      const updatedLaboratorium = await storage.updateLaboratorium(id, validatedData);
      
      if (!updatedLaboratorium) {
        return res.status(404).json({ message: "Data laboratorium tidak ditemukan" });
      }
      
      // Log activity
      const pasien = await storage.getPasien(updatedLaboratorium.pasienId);
      await storage.createAktivitas({
        userId: req.user!.id,
        pasienId: updatedLaboratorium.pasienId,
        aktivitas: "Update Pemeriksaan Laboratorium",
        keterangan: `Update pemeriksaan lab ${updatedLaboratorium.jenisPemeriksaan} untuk ${pasien?.nama || 'pasien'}`,
        tanggal: new Date(),
        status: updatedLaboratorium.status
      });
      
      res.json(updatedLaboratorium);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Data laboratorium tidak valid", errors: error.errors });
      }
      res.status(500).json({ message: "Terjadi kesalahan saat memperbarui data laboratorium" });
    }
  });

  // Radiologi routes
  app.get("/api/radiologi", async (req, res) => {
    try {
      const radiologi = await storage.getAllRadiologi();
      res.json(radiologi);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data radiologi" });
    }
  });

  app.get("/api/radiologi/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const radiologi = await storage.getRadiologi(id);
      if (!radiologi) {
        return res.status(404).json({ message: "Data radiologi tidak ditemukan" });
      }
      res.json(radiologi);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data radiologi" });
    }
  });

  app.post("/api/radiologi", async (req, res) => {
    try {
      const validatedData = insertRadiologiSchema.parse(req.body);
      const radiologi = await storage.createRadiologi(validatedData);
      
      // Log activity
      const pasien = await storage.getPasien(radiologi.pasienId);
      await storage.createAktivitas({
        userId: req.user!.id,
        pasienId: radiologi.pasienId,
        aktivitas: "Pemeriksaan Radiologi",
        keterangan: `Pemeriksaan radiologi ${radiologi.jenisPemeriksaan} untuk ${pasien?.nama || 'pasien'}`,
        tanggal: new Date(),
        status: "Menunggu"
      });
      
      res.status(201).json(radiologi);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Data radiologi tidak valid", errors: error.errors });
      }
      res.status(500).json({ message: "Terjadi kesalahan saat membuat data radiologi" });
    }
  });

  app.put("/api/radiologi/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertRadiologiSchema.partial().parse(req.body);
      const updatedRadiologi = await storage.updateRadiologi(id, validatedData);
      
      if (!updatedRadiologi) {
        return res.status(404).json({ message: "Data radiologi tidak ditemukan" });
      }
      
      // Log activity
      const pasien = await storage.getPasien(updatedRadiologi.pasienId);
      await storage.createAktivitas({
        userId: req.user!.id,
        pasienId: updatedRadiologi.pasienId,
        aktivitas: "Update Pemeriksaan Radiologi",
        keterangan: `Update pemeriksaan radiologi ${updatedRadiologi.jenisPemeriksaan} untuk ${pasien?.nama || 'pasien'}`,
        tanggal: new Date(),
        status: updatedRadiologi.status
      });
      
      res.json(updatedRadiologi);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Data radiologi tidak valid", errors: error.errors });
      }
      res.status(500).json({ message: "Terjadi kesalahan saat memperbarui data radiologi" });
    }
  });

  // Aktivitas routes
  app.get("/api/aktivitas", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 0;
      
      let aktivitas;
      if (limit > 0) {
        aktivitas = await storage.getAktivitasTerbaru(limit);
      } else {
        aktivitas = await storage.getAllAktivitas();
      }
      
      res.json(aktivitas);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data aktivitas" });
    }
  });

  // User management routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove password field for security
      const sanitizedUsers = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(sanitizedUsers);
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat mengambil data pengguna" });
    }
  });

  // Satu Sehat Integration routes
  app.get("/api/satu-sehat/status", (req, res) => {
    // Simulated response for Satu Sehat integration status
    res.json({
      status: "terhubung",
      dataSync: {
        total: 2547,
        synced: 2345,
        percentage: 92
      },
      fhirResources: {
        total: 16,
        available: 16,
        percentage: 100
      },
      connection: {
        status: "terhubung",
        responseTime: "280ms",
        uptime: "99.8%"
      },
      validation: {
        total: 2547,
        validated: 1986,
        percentage: 78
      },
      lastSync: new Date(Date.now() - 7200000) // 2 hours ago
    });
  });

  app.post("/api/satu-sehat/sync", (req, res) => {
    // Simulated Satu Sehat synchronization
    setTimeout(() => {
      res.json({
        success: true,
        message: "Sinkronisasi berhasil",
        syncTime: new Date()
      });
    }, 1500);
  });

  app.get("/api/dashboard/stats", (req, res) => {
    // Simulated dashboard stats
    res.json({
      todayPatients: 42,
      newRegistrations: 17,
      outpatients: 36,
      inpatients: 24,
      totalPatients: 2547,
      totalDoctors: 36,
      bedOccupancy: 72
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
