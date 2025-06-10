"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MdArrowBack, MdSave, MdEdit } from "react-icons/md";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface UserProfile {
  id: number;
  nama: string;
  email: string;
  peran: string;
  nisn: string;
  alamat: string | null;
  telepon: string | null;
  tanggalLahir: string | null;
  jenisKelamin: "laki_laki" | "perempuan" | null;
  dibuatPada: string;
  jurusan?: string | null;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [editableData, setEditableData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.get<UserProfile>("/auth/profile");
        const data = response.data;

        if (data.tanggalLahir) {
          data.tanggalLahir = new Date(data.tanggalLahir)
            .toISOString()
            .split("T")[0];
        }

        setProfileData(data);
        setEditableData(data);
      } catch (err: unknown) {
        console.error("❌ Error fetching profile data:", err);
        let message = "Gagal memuat data profil. Silakan coba lagi.";

        if (err instanceof AxiosError) {
          if (err.response) {
            message = err.response.data?.message || err.response.statusText;
            if (err.response.status === 401) {
              toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
              router.push("/login");
              return;
            }
          } else if (err.request) {
            message =
              "Tidak ada respons dari server. Periksa koneksi internet Anda.";
          } else {
            message = err.message;
          }
        } else if (err instanceof Error) {
          message = err.message;
        }

        setErrorMessage(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditableData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSelectChange = (value: string, id: keyof UserProfile) => {
    setEditableData((prevData) => ({
      ...prevData,
      [id]: value as "laki_laki" | "perempuan",
    }));
  };

  const handleSave = async () => {
    setErrorMessage(null);
    setLoading(true);

    if (
      !editableData.nama ||
      !editableData.email ||
      !editableData.alamat ||
      !editableData.telepon ||
      !editableData.tanggalLahir ||
      !editableData.jenisKelamin
    ) {
      setErrorMessage("Semua kolom wajib diisi.");
      toast.error("Mohon lengkapi semua data.");
      setLoading(false);
      return;
    }

    try {
      const dataToSend: Partial<UserProfile> = {
        nama: editableData.nama,
        email: editableData.email,
        alamat: editableData.alamat,
        telepon: editableData.telepon,
        jenisKelamin: editableData.jenisKelamin,
        jurusan: editableData.jurusan,
      };

      if (editableData.tanggalLahir) {
        dataToSend.tanggalLahir = new Date(
          editableData.tanggalLahir
        ).toISOString();
      }

      await axiosInstance.put<UserProfile>("/auth/profile", dataToSend);
      setProfileData(editableData as UserProfile);
      setIsEditing(false);
      toast.success("Profil berhasil diperbarui!");
    } catch (err: unknown) {
      console.error("❌ Error saving profile:", err);
      let message = "Gagal menyimpan profil. Coba lagi.";

      if (err instanceof AxiosError) {
        if (err.response) {
          message = Array.isArray(err.response.data?.message)
            ? err.response.data.message.join(", ")
            : err.response.data?.message || err.response.statusText;
        } else if (err.request) {
          message = "Tidak ada respons dari server saat menyimpan data.";
        } else {
          message = err.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex flex-col">
        <div className="flex items-center justify-between p-4 bg-white shadow-sm rounded-lg mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage && !profileData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6">
        <div className="text-center text-red-700 p-8 rounded-lg bg-white shadow-md">
          <p className="text-lg font-semibold mb-4">Terjadi Kesalahan</p>
          <p className="mb-6">{errorMessage}</p>
          <Button
            onClick={() => router.back()}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex flex-col">
      <div className="flex items-center justify-between p-4 bg-white shadow-sm rounded-lg mb-6">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="icon"
          aria-label="Kembali"
        >
          <MdArrowBack className="h-6 w-6 text-gray-700" />
        </Button>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Edit Profil
        </h1>

        {isEditing ? (
          <Button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
          >
            {loading ? (
              "Menyimpan..."
            ) : (
              <>
                <MdSave className="h-5 w-5" /> Simpan
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 flex items-center gap-1"
          >
            <MdEdit className="h-5 w-5" /> Edit
          </Button>
        )}
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg flex-grow overflow-y-auto">
        {errorMessage && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Lengkap</Label>
            <Input
              id="nama"
              value={editableData.nama || ""}
              onChange={handleChange}
              disabled={!isEditing || loading}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={editableData.email || ""}
              onChange={handleChange}
              disabled={!isEditing || loading}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nisn">NISN</Label>
            <Input
              id="nisn"
              value={editableData.nisn || ""}
              disabled
              className="bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {profileData?.jurusan !== undefined && (
            <div className="space-y-2">
              <Label htmlFor="jurusan">Jurusan</Label>
              <Input
                id="jurusan"
                value={editableData.jurusan || ""}
                onChange={handleChange}
                disabled={!isEditing || loading}
                className="bg-white"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat</Label>
            <Input
              id="alamat"
              value={editableData.alamat || ""}
              onChange={handleChange}
              disabled={!isEditing || loading}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telepon">Telepon</Label>
            <Input
              id="telepon"
              type="tel"
              value={editableData.telepon || ""}
              onChange={handleChange}
              disabled={!isEditing || loading}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
            <Input
              id="tanggalLahir"
              type="date"
              value={editableData.tanggalLahir || ""}
              onChange={handleChange}
              disabled={!isEditing || loading}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
            <Select
              value={editableData.jenisKelamin || ""}
              onValueChange={(value) =>
                handleSelectChange(value, "jenisKelamin")
              }
              disabled={!isEditing || loading}
            >
              <SelectTrigger id="jenisKelamin" className="w-full bg-white">
                <SelectValue placeholder="Pilih Jenis Kelamin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="laki_laki">Laki-Laki</SelectItem>
                <SelectItem value="perempuan">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </div>
    </div>
  );
}
