import { pgTable, text, serial, integer, boolean, timestamp, json, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  nama: text("nama").notNull(),
  role: text("role").notNull().default("staff"),
  rumahSakit: text("rumah_sakit").notNull(),
  active: boolean("active").notNull().default(true),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  nama: true,
  role: true,
  rumahSakit: true,
});

// Pasien table
export const pasien = pgTable("pasien", {
  id: serial("id").primaryKey(),
  nomorRM: text("nomor_rm").notNull().unique(),
  nik: text("nik").notNull().unique(),
  nama: text("nama").notNull(),
  jenisKelamin: text("jenis_kelamin").notNull(),
  tanggalLahir: timestamp("tanggal_lahir").notNull(),
  alamat: text("alamat").notNull(),
  telepon: text("telepon"),
  email: text("email"),
  golonganDarah: text("golongan_darah"),
  alergi: text("alergi"),
  catatanKhusus: text("catatan_khusus"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  satuSehatId: text("satu_sehat_id"),
  statusSinkronisasi: text("status_sinkronisasi").default("belum"),
});

export const insertPasienSchema = createInsertSchema(pasien).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  satuSehatId: true,
  statusSinkronisasi: true,
});

// Jadwal table
export const jadwal = pgTable("jadwal", {
  id: serial("id").primaryKey(),
  pasienId: integer("pasien_id").notNull(),
  dokterUserId: integer("dokter_user_id").notNull(),
  tanggal: timestamp("tanggal").notNull(),
  jenisPelayanan: text("jenis_pelayanan").notNull(), // poli, lab, radiologi
  namaLayanan: text("nama_layanan").notNull(), // nama poli, jenis lab, jenis radiologi
  status: text("status").notNull().default("menunggu"), // menunggu, konfirmasi, batal, selesai
  keterangan: text("keterangan"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertJadwalSchema = createInsertSchema(jadwal).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// RekamMedis table
export const rekamMedis = pgTable("rekam_medis", {
  id: serial("id").primaryKey(),
  pasienId: integer("pasien_id").notNull(),
  dokterUserId: integer("dokter_user_id").notNull(),
  tanggal: timestamp("tanggal").defaultNow().notNull(),
  keluhanUtama: text("keluhan_utama").notNull(),
  riwayatPenyakitSekarang: text("riwayat_penyakit_sekarang"),
  riwayatPenyakitDahulu: text("riwayat_penyakit_dahulu"),
  pemeriksaanFisik: json("pemeriksaan_fisik").notNull(),
  diagnosis: text("diagnosis").notNull(),
  tindakan: text("tindakan"),
  pengobatan: json("pengobatan"),
  catatanLain: text("catatan_lain"),
  jenisPelayanan: text("jenis_pelayanan").notNull(), // rawat jalan, rawat inap
  statusSinkronisasi: text("status_sinkronisasi").default("belum"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertRekamMedisSchema = createInsertSchema(rekamMedis).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  statusSinkronisasi: true,
});

// RawatInap table
export const rawatInap = pgTable("rawat_inap", {
  id: serial("id").primaryKey(),
  pasienId: integer("pasien_id").notNull(),
  rekamMedisId: integer("rekam_medis_id"),
  tanggalMasuk: timestamp("tanggal_masuk").notNull(),
  tanggalKeluar: timestamp("tanggal_keluar"),
  ruangan: text("ruangan").notNull(),
  nomorBed: text("nomor_bed").notNull(),
  dokterPenanggungJawab: integer("dokter_penanggung_jawab").notNull(),
  diagnosisAwal: text("diagnosis_awal").notNull(),
  diagnosisAkhir: text("diagnosis_akhir"),
  catatanPerawat: json("catatan_perawat"),
  status: text("status").notNull().default("aktif"), // aktif, selesai
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertRawatInapSchema = createInsertSchema(rawatInap).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  tanggalKeluar: true,
  diagnosisAkhir: true,
});

// Obat table
export const obat = pgTable("obat", {
  id: serial("id").primaryKey(),
  kode: text("kode").notNull().unique(),
  nama: text("nama").notNull(),
  kategori: text("kategori").notNull(),
  satuan: text("satuan").notNull(),
  harga: integer("harga").notNull(),
  stok: integer("stok").notNull().default(0),
  minimum_stok: integer("minimum_stok").notNull().default(10),
  deskripsi: text("deskripsi"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertObatSchema = createInsertSchema(obat).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Resep table
export const resep = pgTable("resep", {
  id: serial("id").primaryKey(),
  rekamMedisId: integer("rekam_medis_id").notNull(),
  tanggal: timestamp("tanggal").defaultNow().notNull(),
  status: text("status").notNull().default("menunggu"), // menunggu, diproses, selesai
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertResepSchema = createInsertSchema(resep).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// DetailResep table
export const detailResep = pgTable("detail_resep", {
  id: serial("id").primaryKey(),
  resepId: integer("resep_id").notNull(),
  obatId: integer("obat_id").notNull(),
  jumlah: integer("jumlah").notNull(),
  aturanPakai: text("aturan_pakai").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDetailResepSchema = createInsertSchema(detailResep).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Pemeriksaan Laboratorium
export const laboratorium = pgTable("laboratorium", {
  id: serial("id").primaryKey(),
  pasienId: integer("pasien_id").notNull(),
  dokterUserId: integer("dokter_user_id").notNull(),
  tanggal: timestamp("tanggal").defaultNow().notNull(),
  jenisPemeriksaan: text("jenis_pemeriksaan").notNull(),
  hasilPemeriksaan: json("hasil_pemeriksaan"),
  kesimpulan: text("kesimpulan"),
  status: text("status").notNull().default("menunggu"), // menunggu, diproses, selesai
  catatanDokter: text("catatan_dokter"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLaboratoriumSchema = createInsertSchema(laboratorium).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  hasilPemeriksaan: true,
  kesimpulan: true,
});

// Pemeriksaan Radiologi
export const radiologi = pgTable("radiologi", {
  id: serial("id").primaryKey(),
  pasienId: integer("pasien_id").notNull(),
  dokterUserId: integer("dokter_user_id").notNull(),
  tanggal: timestamp("tanggal").defaultNow().notNull(),
  jenisPemeriksaan: text("jenis_pemeriksaan").notNull(),
  hasilPemeriksaan: json("hasil_pemeriksaan"),
  kesimpulan: text("kesimpulan"),
  status: text("status").notNull().default("menunggu"), // menunggu, diproses, selesai
  catatanDokter: text("catatan_dokter"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertRadiologiSchema = createInsertSchema(radiologi).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  hasilPemeriksaan: true,
  kesimpulan: true,
});

// Aktivitas / Log
export const aktivitas = pgTable("aktivitas", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  pasienId: integer("pasien_id"),
  aktivitas: text("aktivitas").notNull(),
  keterangan: text("keterangan"),
  tanggal: timestamp("tanggal").defaultNow().notNull(),
  status: text("status"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAktivitasSchema = createInsertSchema(aktivitas).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Pasien = typeof pasien.$inferSelect;
export type InsertPasien = z.infer<typeof insertPasienSchema>;

export type Jadwal = typeof jadwal.$inferSelect;
export type InsertJadwal = z.infer<typeof insertJadwalSchema>;

export type RekamMedis = typeof rekamMedis.$inferSelect;
export type InsertRekamMedis = z.infer<typeof insertRekamMedisSchema>;

export type RawatInap = typeof rawatInap.$inferSelect;
export type InsertRawatInap = z.infer<typeof insertRawatInapSchema>;

export type Obat = typeof obat.$inferSelect;
export type InsertObat = z.infer<typeof insertObatSchema>;

export type Resep = typeof resep.$inferSelect;
export type InsertResep = z.infer<typeof insertResepSchema>;

export type DetailResep = typeof detailResep.$inferSelect;
export type InsertDetailResep = z.infer<typeof insertDetailResepSchema>;

export type Laboratorium = typeof laboratorium.$inferSelect;
export type InsertLaboratorium = z.infer<typeof insertLaboratoriumSchema>;

export type Radiologi = typeof radiologi.$inferSelect;
export type InsertRadiologi = z.infer<typeof insertRadiologiSchema>;

export type Aktivitas = typeof aktivitas.$inferSelect;
export type InsertAktivitas = z.infer<typeof insertAktivitasSchema>;
