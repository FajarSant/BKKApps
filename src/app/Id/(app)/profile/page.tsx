"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import {
  MdOutlineEdit,
  MdOutlineLock,
  MdOutlineDescription,
  MdOutlineLogout,
  MdOutlineEmail,
  MdOutlinePerson,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

interface User {
  id: number;
  nama: string;
  peran: string;
  jurusan: string;
  email: string;
  alamat: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get<User>("/auth/profile");
        if (response.data) {
          setUserData(response.data);
        } else {
          setError("Data profil tidak valid.");
          toast.error("Data profil tidak valid.");
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            router.push("/login");
          } else {
            setError("Gagal memuat data profil. Silakan coba lagi.");
            toast.error("Gagal memuat data profil.");
          }
        } else {
          setError("Terjadi kesalahan yang tidak diketahui.");
          toast.error("Terjadi kesalahan yang tidak diketahui.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("siswa_token");
    localStorage.removeItem("alumni_token");

    toast.success("Anda telah berhasil logout.", {
      duration: 3000,
      position: "top-center",
      icon: "👋",
    });
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-start justify-center">
        <div className="w-full max-w-2xl space-y-8">
          <Card className="rounded-xl bg-white p-8 sm:p-10 flex flex-col items-center justify-center">
            <Skeleton className="mb-6 w-32 h-32 rounded-full" />
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-1" />
            <Skeleton className="h-6 w-2/3 mb-1" />
            <Skeleton className="h-6 w-full" />
          </Card>

          <Separator />

          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6">
        <div className="text-center text-red-700 p-8 rounded-lg bg-white shadow-md">
          <p className="text-lg font-semibold mb-4">Terjadi Kesalahan</p>
          <p className="mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="text-center text-gray-700 p-8 rounded-lg bg-white shadow-md">
          <p className="text-lg font-semibold mb-4">
            Data profil tidak ditemukan.
          </p>
          <p className="mb-6">
            Silakan coba muat ulang halaman atau hubungi dukungan.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Muat Ulang Halaman
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-start justify-center">
      <div className="w-full max-w-2xl space-y-8">
        <Card>
          <CardContent className="p-8 sm:p-10 flex flex-col items-center justify-center">
            <div className="mb-6 w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 bg-blue-50 flex items-center justify-center shadow-inner">
              <FaUser className="w-20 h-20 text-blue-400" />
            </div>
            <div className="flex flex-col items-center justify-center space-y-1 mt-2">
              <p className="text-base sm:text-lg text-gray-600 flex items-center gap-2">
                <MdOutlinePerson className="h-5 w-5 text-gray-500" />
                {userData.peran}
                {userData.jurusan && (
                  <span className="font-semibold text-gray-700 ml-1">
                    • {userData.jurusan}
                  </span>
                )}
              </p>
              <p className="text-base sm:text-lg text-gray-600 flex items-center gap-2">
                <MdOutlineEmail className="h-5 w-5 text-gray-500" />
                {userData.email}
              </p>
            </div>
          </CardContent>
        </Card>

        <Separator />
        <div className="space-y-4">
          <Link href="/Id/profile/edit-profile" passHref>
            <Button
              className="w-full mb-4 justify-start text-base sm:text-lg px-6 py-3 h-auto shadow-sm hover:shadow-md transition-shadow duration-200"
              variant="outline"
            >
              <MdOutlineEdit className="mr-3 h-5 w-5" /> Edit Profil
            </Button>
          </Link>
          <Link href="/Id/profile/change-password" passHref>
            <Button
              className="w-full mb-4 justify-start text-base sm:text-lg px-6 py-3 h-auto shadow-sm hover:shadow-md transition-shadow duration-200"
              variant="outline"
            >
              <MdOutlineLock className="mr-3 h-5 w-5" /> Ganti Kata Sandi
            </Button>
          </Link>
          {userData.peran === "Siswa" && (
            <Link href="/Id/profile/buat-cv" passHref>
              <Button
                className="w-full mb-4 justify-start text-base sm:text-lg px-6 py-3 h-auto shadow-sm hover:shadow-md transition-shadow duration-200"
                variant="outline"
              >
                <MdOutlineDescription className="mr-3 h-5 w-5" /> Buat CV
              </Button>
            </Link>
          )}
          <Button
            onClick={handleLogout}
            className="w-full mb-4 justify-start text-base sm:text-lg px-6 py-3 h-auto bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md transition-shadow duration-200"
            variant="destructive"
          >
            <MdOutlineLogout className="mr-3 h-5 w-5" /> Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
