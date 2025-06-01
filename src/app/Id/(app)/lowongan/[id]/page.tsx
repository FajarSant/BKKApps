"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Bookmark } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { AxiosError } from "axios";

interface ApiResponse {
  status: string;
  message?: string;
  data?: unknown;
}

interface ErrorResponse {
  message: string;
}

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
  const [openDialog, setOpenDialog] = useState(false);
  const [openApplyDialog, setOpenApplyDialog] = useState(false);

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
        setSaved(savedList.some((item) => item.lowonganId === lowonganId));
      } catch (err) {
        console.error("Gagal mengecek simpanan:", err);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSave = async () => {
    if (saving || saved || !job || !userId) return;

    setSaving(true);
    try {
      const res = await axiosInstance.post<ApiResponse>("/lowongan-disimpan", {
        lowonganId: job.id,
        penggunaId: userId,
      });

      const message = res.data.message || "Lowongan berhasil disimpan.";

      if (res.data.status === "success") {
        setSaved(true);
        toast.success(message, { id: "toast-simpan-lowongan" });
      } else {
        toast.error(message, { id: "toast-simpan-lowongan" });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Terjadi kesalahan saat menyimpan.";
      toast.error(errorMessage, { id: "toast-simpan-lowongan" });
    } finally {
      setSaving(false);
      setOpenDialog(false);
    }
  };

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen && !saving) 
    setOpenDialog(isOpen);
  };

  const handleApplyClick = () => {
    if (job?.linkPendaftaran) {
      window.open(job.linkPendaftaran, "_blank");
      setOpenApplyDialog(false);
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
          <p>
            <strong>Perusahaan:</strong> {job.perusahaan?.nama}
          </p>
          <p>{job.perusahaan?.deskripsi}</p>
          <p>
            <strong>Alamat:</strong> {job.perusahaan?.alamat}
          </p>
          <p>
            <strong>Email:</strong> {job.perusahaan?.email}
          </p>
        </div>
      </section>

      <section className="space-y-4 mt-10 mb-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Ketentuan
        </h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
          {job.ketentuan.split("\n").map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 mb-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Persyaratan
        </h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
          {job.persyaratan.split("\n").map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="pt-4 border-t dark:border-gray-700 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Dialog Pendaftaran */}
          <ConfirmDialog
            open={openApplyDialog}
            onOpenChange={setOpenApplyDialog}
            title="Konfirmasi Pendaftaran"
            description="Apakah Anda yakin ingin melanjutkan ke halaman pendaftaran?"
            onConfirm={handleApplyClick}
            trigger={
              <Button
                size="lg"
                variant="success"
                className="w-full sm:w-auto"
                disabled={!job.linkPendaftaran}
                onClick={() => setOpenApplyDialog(true)}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                {job.linkPendaftaran
                  ? "Daftar Sekarang"
                  : "Pendaftaran Tidak Tersedia"}
              </Button>
            }
          />

          {/* Dialog Simpan */}
          <ConfirmDialog
            open={openDialog}
            onOpenChange={handleDialogClose}
            title="Konfirmasi Simpan Lowongan"
            description="Apakah Anda yakin ingin menyimpan lowongan pekerjaan ini?"
            onConfirm={handleSave}
            confirmText={saving ? "Menyimpan..." : "Simpan"}
            confirmDisabled={saving}
            trigger={
              <Button
                variant={saved ? "secondary" : "default"}
                size="lg"
                className="w-full sm:w-auto"
                disabled={saving || saved}
                onClick={() => setOpenDialog(true)}
              >
                <Bookmark className="w-4 h-4 mr-2" />
                {saving ? "Menyimpan..." : saved ? "Tersimpan" : "Simpan"}
              </Button>
            }
          />
        </div>
      </section>
    </main>
  );
}
