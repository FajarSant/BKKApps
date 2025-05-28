"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Bookmark } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Job {
  id: number;
  nama: string;
  ketentuan: string;
  persyaratan: string;
  salary: string;
  jenisPekerjaan: string;
  perusahaanId: number;
  dibuatPada: string;
  expiredAt: string;
  linkPendaftaran: string;
  perusahaan: {
    nama: string;
    alamat: string;
    email: string;
    deskripsi: string;
  };
}

interface SavedJob {
  lowonganId: number;
  penggunaId: number;
}

export default function LowonganDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, userRes] = await Promise.all([
          axiosInstance.get(`/lowongan/get/${id}`),
          axiosInstance.get("/auth/profile"),
        ]);
        setJob(jobRes.data.data);
        const user = userRes.data?.data || userRes.data;
        if (user?.id) {
          setUserId(user.id);
          checkIfSaved(user.id, Number(id));
        }
      } catch (err) {
        setError("Gagal memuat detail lowongan.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const checkIfSaved = async (penggunaId: number, lowonganId: number) => {
      try {
        const res = await axiosInstance.get(`/lowongan-disimpan/${penggunaId}`);
        const savedList: SavedJob[] = res.data?.data || [];
        const isSaved = savedList.some((item) => item.lowonganId === lowonganId);
        setSaved(isSaved);
      } catch (err) {
        console.error("Gagal mengecek simpanan:", err);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleConfirmSave = async () => {
    if (!job || !userId) {
      toast.error("Data tidak lengkap.");
      return;
    }

    setSaving(true);

    try {
      const res = await axiosInstance.post("/lowongan-disimpan", {
        lowonganId: job.id,
        penggunaId: userId,
      });

      if (res.data.status === "success") {
        setSaved(true);
        toast.success("Lowongan berhasil disimpan.");
        setOpenSaveDialog(false);
      } else {
        toast.error(res.data.message || "Gagal menyimpan lowongan.");
      }
    } catch (err: unknown) {
      console.error(err);
      const message =
        typeof err === "object" && err !== null && "response" in err
          ? (err as any).response?.data?.message || "Terjadi kesalahan."
          : "Gagal menyimpan lowongan.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="container max-w-3xl px-4 py-10 sm:px-6 lg:px-8 mx-auto space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="space-y-4 mt-8">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <Skeleton className="h-10 w-36 mt-6" />
      </main>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center mt-10 text-destructive font-medium">
        {error || "Lowongan tidak ditemukan."}
      </div>
    );
  }

  return (
    <main className="container mx-auto p-6">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b dark:border-gray-700 flex items-center h-14 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="flex items-center gap-4 w-full relative">
          <button
            onClick={() => router.push("/Id/lowongan")}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Kembali"
          >
            <FaArrowLeft className="text-gray-700 dark:text-gray-200 w-5 h-5" />
          </button>
          <h1 className="absolute left-1/2 transform -translate-x-1/2 font-semibold text-lg text-gray-800 dark:text-gray-100">
            Detail Lowongan
          </h1>
        </div>
      </header>

      {/* Job Info */}
      <section className="space-y-3 mt-10">
        <h1 className="text-2xl md:text-3xl text-center mb-10 font-bold text-gray-900 dark:text-white">
          {job.nama}
        </h1>
        <p className="text-base text-gray-700 dark:text-gray-300">
          {job.jenisPekerjaan} •{" "}
          <span className="text-green-600 font-semibold">Rp {job.salary}</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Dibuat: {new Date(job.dibuatPada).toLocaleDateString("id-ID")} •
          Berlaku hingga {new Date(job.expiredAt).toLocaleDateString("id-ID")}
        </p>
        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-4 pt-2">
          <p><strong>Perusahaan:</strong> {job.perusahaan?.nama}</p>
          <p>{job.perusahaan?.deskripsi}</p>
          <p><strong>Alamat:</strong> {job.perusahaan?.alamat}</p>
          <p><strong>Email:</strong> {job.perusahaan?.email}</p>
        </div>
      </section>

      {/* Ketentuan & Persyaratan */}
      <section className="space-y-4 mt-10 mb-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ketentuan</h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
          {job.ketentuan.split("\n").map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>
      <section className="space-y-4 mb-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Persyaratan</h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
          {job.persyaratan.split("\n").map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>

      {/* Actions */}
      <section className="pt-4 border-t dark:border-gray-700 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Tombol Daftar */}
          {job.linkPendaftaran ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" variant="success" className="w-full sm:w-auto">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Daftar Sekarang
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Konfirmasi Pendaftaran</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  Anda akan diarahkan ke halaman pendaftaran eksternal. Lanjutkan?
                </p>
                <DialogFooter className="mt-4 flex justify-end gap-2">
                  <DialogTrigger asChild>
                    <Button variant="outline">Batal</Button>
                  </DialogTrigger>
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={() => window.open(job.linkPendaftaran, "_blank")}
                  >
                    Lanjutkan
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Button disabled className="w-full sm:w-auto">
              <ArrowRight className="w-4 h-4 mr-2" />
              Pendaftaran Tidak Tersedia
            </Button>
          )}

          {/* Tombol Simpan */}
          <Dialog open={openSaveDialog} onOpenChange={setOpenSaveDialog}>
            <DialogTrigger asChild>
              <Button
                variant={saved ? "secondary" : "default"}
                size="lg"
                className="w-full sm:w-auto"
                disabled={saving || saved}
              >
                <Bookmark className="w-4 h-4 mr-2" />
                {saving ? "Menyimpan..." : saved ? "Tersimpan" : "Simpan"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Konfirmasi Simpan Lowongan</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                Apakah Anda yakin ingin menyimpan lowongan ini?
              </p>
              <DialogFooter className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOpenSaveDialog(false)}
                  disabled={saving}
                >
                  Batal
                </Button>
                <Button
                  size="lg"
                  variant="default"
                  onClick={handleConfirmSave}
                  disabled={saving}
                >
                  {saving ? "Menyimpan..." : "Ya, Simpan"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </main>
  );
}
