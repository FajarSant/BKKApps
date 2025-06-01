"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface Lowongan {
  id: number;
  nama: string;
  ketentuan: string;
  persyaratan: string;
  salary: string;
  jenisPekerjaan: string;
  expiredAt: string;
  linkPendaftaran: string;
  dibuatPada: string;
}

interface SavedLowongan {
  id: number;
  penggunaId: number;
  lowonganId: number;
  tanggal: string;
  lowongan: Lowongan;
}

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedLowongan[]>([]);
  const [loading, setLoading] = useState(true);
  const [penggunaId, setPenggunaId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<null | number>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const profileRes = await axiosInstance.get("/auth/profile");
        const userId = profileRes.data?.id;

        if (!userId) {
          toast.error("Gagal mendapatkan ID pengguna.");
          return;
        }

        setPenggunaId(userId);

        const res = await axiosInstance.get(`/lowongan-disimpan/${userId}`);
        setSavedJobs(res.data?.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat lowongan tersimpan.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleDelete = async (lowonganId: number) => {
    if (!penggunaId) return;

    try {
      await axiosInstance.delete(
        `/lowongan-disimpan/${penggunaId}/${lowonganId}`
      );
      setSavedJobs((prev) =>
        prev.filter((item) => item.lowonganId !== lowonganId)
      );
      toast.success("Lowongan berhasil dihapus dari daftar simpan.");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus lowongan.");
    } finally {
      setDeleteDialogOpen(null);
    }
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Lowongan Tersimpan
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-52 w-full rounded-lg" />
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          Anda belum menyimpan lowongan apa pun.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {savedJobs.map(({ id, tanggal, lowongan }) => (
            <Card
              key={id}
              className="border shadow-sm flex flex-col justify-between"
            >
              <CardHeader
                onClick={() => router.push(`/Id/lowongan/${lowongan.id}`)}
                className="cursor-pointer"
              >
                <CardTitle className="text-lg text-primary">
                  {lowongan.nama}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  {lowongan.jenisPekerjaan} • Rp {lowongan.salary}
                </p>
              </CardHeader>

              <CardContent className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <p>
                  <strong>Dibuat:</strong>{" "}
                  {new Date(lowongan.dibuatPada).toLocaleDateString("id-ID")}
                </p>
                <p>
                  <strong>Berlaku Hingga:</strong>{" "}
                  <span className="text-red-500">
                    {new Date(lowongan.expiredAt).toLocaleDateString("id-ID")}
                  </span>
                </p>
                <p>
                  <strong>Disimpan Pada:</strong>{" "}
                  {new Date(tanggal).toLocaleDateString("id-ID")}
                </p>
                <p>
                  <strong>Ketentuan:</strong>{" "}
                  {lowongan.ketentuan.split("\n")[0]}...
                </p>
                <p>
                  <strong>Persyaratan:</strong>{" "}
                  {lowongan.persyaratan.split("\n")[0]}...
                </p>

                <div className="pt-2">
                  <ConfirmDialog
                    open={deleteDialogOpen === lowongan.id}
                    onOpenChange={(open) =>
                      setDeleteDialogOpen(open ? lowongan.id : null)
                    }
                    title="Konfirmasi Hapus"
                    description="Apakah Anda yakin ingin menghapus lowongan ini dari daftar simpan?"
                    confirmText="Hapus"
                    cancelText="Batal"
                    onConfirm={() => handleDelete(lowongan.id)}
                    trigger={
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Hapus
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
