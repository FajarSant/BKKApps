"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import axios from "axios";
import Image from "next/image";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

export default function LoginPage() {
  const router = useRouter();
  const [nisn, setNisn] = useState("");
  const [katasandi, setKatasandi] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(""); // Reset previous error messages

    if (!nisn || !katasandi) {
      setErrorMessage("NISN dan Kata Sandi harus diisi.");
      return;
    }

    setLoading(true);

    try {
      console.log("🔸 Mengirim data login:", { nisn, katasandi });

      const response = await axiosInstance.post("/auth/login", {
        nisn,
        katasandi,
      });

      console.log("✅ Respons dari API /auth/login:", response.data);

      // Check if response contains token
      const token = response.data?.aksesToken;
      if (token) {
        console.log("✅ Token diterima dan disimpan:", token);
        localStorage.setItem("bkk_token", token);

        toast.success(response.data.message || "Login berhasil!", {
          duration: 3000,
          position: "top-center",
          icon: "✔️",
        });

        router.push("/home");
      } else {
        setErrorMessage("Token tidak ditemukan, login gagal.");
        toast.error("Token tidak ditemukan, login gagal.", {
          duration: 5000,
          position: "top-center",
          icon: "❌",
          style: {
            backgroundColor: "#FFEBEB",
            color: "#D32F2F",
            borderLeft: "4px solid #D32F2F",
          },
        });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("❌ Error dari server /auth/login:", err.response?.data);

        const errorMessage =
          err.response?.data?.message || "Terjadi kesalahan, coba lagi.";
        setErrorMessage(errorMessage);

        toast.error(errorMessage, {
          duration: 5000,
          position: "top-center",
          icon: "❌",
          style: {
            backgroundColor: "#FFEBEB",
            color: "#D32F2F",
            borderLeft: "4px solid #D32F2F",
          },
        });
      } else {
        console.error("❌ Error jaringan:", err);

        toast.error("Jaringan bermasalah, silakan coba lagi.", {
          duration: 5000,
          position: "top-center",
          icon: "❌",
          style: {
            backgroundColor: "#FFEBEB",
            color: "#D32F2F",
            borderLeft: "4px solid #D32F2F",
          },
        });
      }
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-100 px-4 py-12">
      <div className="w-full max-w-md shadow-2xl border-none bg-white rounded-lg">
        <div className="flex flex-col items-center gap-4 py-6">
          <Image
            src="/logo.png"
            alt="Logo Aplikasi"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
          <div className="text-center text-2xl font-semibold text-gray-800">
            Selamat Datang Kembali!
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nisn">NISN</Label>
              <Input
                id="nisn"
                type="text"
                placeholder="Masukkan NISN"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                required
                className={errorMessage ? "border-red-500" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="katasandi">Kata Sandi</Label>
              <div className="relative">
                <Input
                  id="katasandi"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  value={katasandi}
                  onChange={(e) => setKatasandi(e.target.value)}
                  required
                  className={errorMessage ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={24} />
                  ) : (
                    <AiOutlineEye size={24} />
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
            )}

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Memuat..." : "Masuk"}
            </Button>
          </form>
        </div>

        <div className="text-sm text-center text-gray-600 mt-4 pb-6">
          Belum punya akun?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Daftar
          </a>
        </div>
      </div>
    </main>
  );
}
