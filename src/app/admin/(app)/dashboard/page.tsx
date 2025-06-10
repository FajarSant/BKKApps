import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import {
  FaBook,
  FaBriefcase,
  FaBuilding,
  FaCog,
  FaEnvelope,
  FaUsers,
} from "react-icons/fa";

const page = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-8">
      <div>
        <section className="mt-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-16 text-center">
            Informasi & Navigasi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition">
              <CardHeader className="flex items-center space-x-4">
                <div className="text-blue-600 text-2xl">
                  <FaBriefcase />
                </div>
                <div>
                  <CardTitle className="text-lg">Lowongan</CardTitle>
                  <CardDescription>
                    Kelola data lowongan pekerjaan.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Link
                  href="/admin/lowongan"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Kelola Lowongan →
                </Link>
              </CardContent>
            </Card>

            {/* Menu Pengguna */}
            <Card className="hover:shadow-lg transition">
              <CardHeader className="flex items-center space-x-4">
                <div className="text-purple-600 text-2xl">
                  <FaUsers />
                </div>
                <div>
                  <CardTitle className="text-lg">Pengguna</CardTitle>
                  <CardDescription>
                    Manajemen data pengguna platform.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Link
                  href="/admin/pengguna"
                  className="text-sm text-purple-500 hover:underline"
                >
                  Kelola Pengguna →
                </Link>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition">
              <CardHeader className="flex items-center space-x-4">
                <div className="text-yellow-600 text-2xl">
                  <FaBuilding />
                </div>
                <div>
                  <CardTitle className="text-lg">Pengguna</CardTitle>
                  <CardDescription>
                    Manajemen data perusahaan platform.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Link
                  href="/admin/pengguna"
                  className="text-sm text-yellow-500 hover:underline"
                >
                  Kelola Pengguna →
                </Link>
              </CardContent>
            </Card>

            {/* Menu Setting */}
            <Card className="hover:shadow-lg transition">
              <CardHeader className="flex items-center space-x-4">
                <div className="text-gray-600 text-2xl">
                  <FaCog />
                </div>
                <div>
                  <CardTitle className="text-lg">Setting</CardTitle>
                  <CardDescription>
                    Pengaturan platform & preferensi.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Link
                  href="/admin/setting"
                  className="text-sm text-gray-600 hover:underline"
                >
                  Buka Pengaturan →
                </Link>
              </CardContent>
            </Card>

            {/* Menu Panduan */}
            <Card className="hover:shadow-lg transition">
              <CardHeader className="flex items-center space-x-4">
                <div className="text-green-600 text-2xl">
                  <FaBook />
                </div>
                <div>
                  <CardTitle className="text-lg">Panduan</CardTitle>
                  <CardDescription>
                    Panduan penggunaan platform.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Link
                  href="#"
                  className="text-sm text-green-500 hover:underline"
                >
                  Lihat Panduan →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardHeader className="flex items-center space-x-4">
                <div className="text-red-600 text-2xl">
                  <FaEnvelope />
                </div>
                <div>
                  <CardTitle className="text-lg">Hubungi Developer</CardTitle>
                  <CardDescription>
                    Kontak developer jika ada pertanyaan atau masalah.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Link
                  href="#"
                  className="text-sm text-red-500 hover:underline"
                >
                  Kirim Email →
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
};

export default page;
