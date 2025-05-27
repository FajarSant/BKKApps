"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaArrowLeft } from "react-icons/fa";

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
  };
}

export default function LowonganDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axiosInstance.get(`/lowongan/get/${id}`);
        setJob(response.data.data);
      } catch (err) {
        setError("Gagal memuat detail lowongan.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJob();
  }, [id]);

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
      {/* ✅ Topbar */}
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

      {/* ✅ Informasi utama */}
      <section className="space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
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
        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1 pt-2">
          <p>
            <strong>Perusahaan:</strong> {job.perusahaan?.nama}
          </p>
          <p>
            <strong>Alamat:</strong> {job.perusahaan?.alamat}
          </p>
        </div>
      </section>

      {/* ✅ Ketentuan */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Ketentuan
        </h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
          {job.ketentuan.split("\n").map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>

      {/* ✅ Persyaratan */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Persyaratan
        </h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
          {job.persyaratan.split("\n").map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>

      {/* ✅ Tombol Daftar */}
      <section className="pt-4 border-t dark:border-gray-700">
        {job.linkPendaftaran ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="mt-4 w-full sm:w-auto">
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
                  onClick={() => {
                    window.open(job.linkPendaftaran, "_blank");
                  }}
                >
                  Lanjutkan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Button disabled className="mt-4 w-full sm:w-auto">
            <ArrowRight className="w-4 h-4 mr-2" />
            Pendaftaran Tidak Tersedia
          </Button>
        )}
      </section>
    </main>
  );
}
