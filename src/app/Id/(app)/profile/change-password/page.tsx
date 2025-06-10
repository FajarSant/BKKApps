"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

export default function GantiKataSandi() {
  const router = useRouter();
  const [katasandilama, setKataSandiLama] = useState("");
  const [katasandibaru, setKataSandiBaru] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (katasandibaru !== konfirmasi) {
      toast.error("Kata sandi baru dan konfirmasi tidak sama.");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.patch("/auth/change-password", {
        katasandilama,
        katasandibaru,
      });

      toast.success("Kata sandi berhasil diubah.");
      setKataSandiLama("");
      setKataSandiBaru("");
      setKonfirmasi("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // error.response?.data?.message bisa jadi string atau undefined
        const message =
          typeof error.response?.data?.message === "string"
            ? error.response.data.message
            : "Gagal mengubah kata sandi.";
        toast.error(message);
      } else {
        toast.error("Gagal mengubah kata sandi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 p-4 flex flex-col">
      {/* Topbar */}
      <header className="flex items-center justify-center relative bg-white shadow-sm rounded-lg p-4 mb-6">
        <button
          onClick={() => router.back()}
          aria-label="Kembali"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-900"
          disabled={loading}
        >
          <MdArrowBack className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-semibold">Ganti Kata Sandi</h2>
      </header>

      {/* Form Card */}
      <div className="w-full bg-white rounded-lg shadow-md p-8 mx-auto flex-grow">
        {loading ? (
          <div className="space-y-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-4 w-1/3 rounded" />
                <Skeleton className="h-10 rounded" />
              </div>
            ))}
            <Skeleton className="h-10 rounded w-full mt-4" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col space-y-1">
              <Label
                htmlFor="katasandilama"
                className="text-sm font-medium text-gray-700"
              >
                Kata Sandi Lama
              </Label>
              <Input
                id="katasandilama"
                type="password"
                placeholder="Masukkan kata sandi lama"
                value={katasandilama}
                onChange={(e) => setKataSandiLama(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <Label
                htmlFor="katasandibaru"
                className="text-sm font-medium text-gray-700"
              >
                Kata Sandi Baru
              </Label>
              <Input
                id="katasandibaru"
                type="password"
                placeholder="Masukkan kata sandi baru"
                value={katasandibaru}
                onChange={(e) => setKataSandiBaru(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <Label
                htmlFor="konfirmasi"
                className="text-sm font-medium text-gray-700"
              >
                Konfirmasi Kata Sandi
              </Label>
              <Input
                id="konfirmasi"
                type="password"
                placeholder="Konfirmasi kata sandi baru"
                value={konfirmasi}
                onChange={(e) => setKonfirmasi(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Mengubah..." : "Ubah Kata Sandi"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
