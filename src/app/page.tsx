'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import axiosInstance from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const [nisn, setNisn] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axiosInstance.post("/auth/login", {
        nisn,
        password,
      });

      const { token } = res.data;

      localStorage.setItem("token", token);
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Login gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-100 px-4 py-12">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl border-none">
        <CardHeader className="flex flex-col items-center gap-4">
          <Image
            src="/logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
          <CardTitle className="text-center text-2xl font-semibold text-gray-800">
            Selamat Datang Kembali!
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="nisn">NISN</Label>
              <Input
                id="nisn"
                type="text"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                placeholder="Masukkan NISN"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                required
              />
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Ingat saya</Label>
              </div>
              <a href="#" className="text-blue-600 hover:underline">Lupa kata sandi?</a>
            </div>

            {errorMsg && (
              <p className="text-sm text-red-600">{errorMsg}</p>
            )}

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <div className="text-sm text-center text-gray-600">Atau masuk dengan</div>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <FcGoogle className="text-xl" />
            Masuk dengan Google
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
