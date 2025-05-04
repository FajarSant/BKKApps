import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import { FaBook, FaBriefcase, FaBuilding, FaCog, FaEnvelope, FaUsers, FaUserShield } from "react-icons/fa";

const cardData = [
  {
    title: "Jumlah Lowongan",
    count: 100,
    icon: <FaBriefcase />,
    color: "text-blue-600",
  },
  {
    title: "Jumlah Perusahaan",
    count: 100,
    icon: <FaBuilding />,
    color: "text-green-600",
  },
  {
    title: "Jumlah Pengguna",
    count: 100,
    icon: <FaUsers />,
    color: "text-purple-600",
  },
  {
    title: "Jumlah Admin",
    count: 100,
    icon: <FaUserShield />,
    color: "text-red-600",
  },
];
const page = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {cardData.map((card, index) => (
          <Card
            key={index}
            className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition duration-300 bg-white border border-gray-200"
          >
            {/* Background Icon Centered */}
            <div
              className={`absolute inset-0 flex items-center justify-center ${card.color} opacity-20`}
            >
              <div className={`text-[6rem]`}>{card.icon}</div>
            </div>

            {/* Content Layer */}
            <CardHeader className="relative z-10 flex flex-col items-center justify-center text-center p-2 space-y-1">
              <CardTitle className="text-2xl font-medium text-gray-800">
                {card.title}
              </CardTitle>
              <CardDescription className={`text-4xl font-bold ${card.color}`}>
                {card.count}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div>
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Informasi & Navigasi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Menu Lowongan */}
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
                  href="/panduan"
                  className="text-sm text-green-500 hover:underline"
                >
                  Lihat Panduan →
                </Link>
              </CardContent>
            </Card>

            {/* Hubungi Developer */}
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
                  href="mailto:dev@example.com"
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
