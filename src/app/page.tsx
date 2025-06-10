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
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [nisn, setNisn] = useState("");
  const [katasandi, setKatasandi] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!nisn || !katasandi) {
      setErrorMessage("NISN dan Kata Sandi harus diisi.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", {
        nisn,
        katasandi,
      });

      const token = response.data?.accessToken;
      const redirectTo = response.data?.redirectTo || "/id/home";
      const tokenName = response.data?.tokenName;

      if (token && tokenName) {
        localStorage.setItem(tokenName, token);

        toast.success("Login berhasil!", {
          duration: 3000,
          position: "top-center",
          icon: "✔️",
        });

        router.push(redirectTo);
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
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        backgroundImage: "url('/images/SMK.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md bg-white/50 backdrop-blur-md  rounded-lg">
        <div className="flex flex-col items-center gap-4 py-6">
          <Image
            src="/images/LogoSMK.png"
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
      </div>
    </main>
  );
}
