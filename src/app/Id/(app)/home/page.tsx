"use client";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa"; 
import { Button } from "@/components/ui/button";
import CompanyCard from "@/components/CompanyCard";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import axiosInstance from "@/lib/axios";

interface User {
  id: number;
  nama: string;
  email: string;
  telepon?: string;
  alamat?: string;
  peran: string;
}

const companies = [
  {
    name: "Tech Corp",
    description:
      "Tech Corp adalah perusahaan teknologi terkemuka yang fokus pada pengembangan perangkat lunak dan aplikasi inovatif.",
    jobs: [
      {
        title: "Pengembang Web",
        location: "Jakarta, Indonesia",
        type: "Penuh Waktu",
      },
      {
        title: "Desainer UI/UX",
        location: "Bandung, Indonesia",
        type: "Paruh Waktu",
      },
    ],
    imageUrl: "https://placehold.co/600x400/png", 
  },
  {
    name: "Creative Agency",
    description:
      "Creative Agency adalah agensi kreatif yang mengkhususkan diri dalam desain grafis dan pemasaran digital.",
    jobs: [
      {
        title: "Desainer Grafis",
        location: "Surabaya, Indonesia",
        type: "Penuh Waktu",
      },
    ],
    imageUrl: "https://placehold.co/600x400/png", 
  },
  {
    name: "Business Solutions",
    description:
      "Business Solutions menyediakan solusi manajemen proyek dan konsultasi bisnis untuk perusahaan-perusahaan besar.",
    jobs: [
      {
        title: "Manajer Proyek",
        location: "Medan, Indonesia",
        type: "Penuh Waktu",
      },
    ],
    imageUrl: "https://placehold.co/600x400/png", 
  },
];

const HomePage: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/auth/profile"); 
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData(); 
  }, []); 

  return (
    <main className="container mx-auto p-6">
      {/* Kartu Informasi Pengguna */}
      {userData && (
        <Card className="mb-8 shadow-lg">
          <CardContent className="flex items-center space-x-6">
            {/* Avatar Ikon Pengguna */}
            <div className="flex-shrink-0">
              <FaUser className="w-24 h-24 text-gray-500 rounded-full border-2 border-gray-300 p-2" />
            </div>

            {/* Informasi Pengguna */}
            <div>
              <CardDescription>
                <h4 className="font-bold text-black text-2xl">{userData.nama}</h4>
                <p className="text-sm mt-2">Email: {userData.email}</p>
                <p className="text-sm mt-2">Telepon: {userData.telepon}</p>
                <p className="text-sm mt-2">Alamat: {userData.alamat}</p>
                <p className="text-sm mt-2">Status: {userData.peran}</p>
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tombol Lihat Kategori Pekerjaan */}
      <div className="mb-6">
        <Button
          size="lg"
          className="w-full"
          variant="default"
          onClick={() => {
            // Define an action for the button, e.g., navigate to a job categories page
            console.log("Lihat kategori pekerjaan");
          }}
        >
          Lihat Kategori Pekerjaan
        </Button>
      </div>

      {/* Menampilkan beberapa CompanyCard */}
      <div className="grid grid-cols-1 gap-6">
        {companies.map((company, index) => (
          <CompanyCard key={index} company={company} />
        ))}
      </div>
    </main>
  );
};

export default HomePage;
