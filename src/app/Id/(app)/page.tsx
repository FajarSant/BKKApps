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

interface Job {
  title: string;
  location: string;
  type: string;
}

interface Company {
  id: number;
  name: string;
  description: string;
  jobs: Job[];
}

interface JobApiResponse {
  id: number;
  nama: string;
  ketentuan: string;
  persyaratan: string;
  salary: string;
  jenisPekerjaan: string;
  perusahaanId: number;
  dibuatPada: string;
  expiredAt: string;
  linkPendaftaran: string;
}

interface CompanyApiResponse {
  id: number;
  nama: string;
  gambar: string;
  alamat: string;
  email: string;
  telepon: string;
  deskripsi: string;
  lowongan: JobApiResponse[];
}

const HomePage: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get<User>("/auth/profile");
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await axiosInstance.get("/perusahaan/getall");

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data;

        if (!Array.isArray(data)) {
          throw new Error("Response bukan array perusahaan.");
        }

        const allJobs: {
          job: JobApiResponse;
          company: CompanyApiResponse;
        }[] = [];

        data.forEach((company: CompanyApiResponse) => {
          company.lowongan?.forEach((job: JobApiResponse) => {
            allJobs.push({ job, company });
          });
        });

        // Urutkan berdasarkan tanggal dibuat terbaru
        const sortedJobs = allJobs.sort(
          (a, b) =>
            new Date(b.job.dibuatPada).getTime() -
            new Date(a.job.dibuatPada).getTime()
        );

        // Ambil 5 lowongan terbaru
        const latestFive = sortedJobs.slice(0, 5);

        // Format jadi array perusahaan dengan satu lowongan per perusahaan
        const formattedCompanies: Company[] = latestFive.map(
          ({ job, company }) => ({
            id: company.id,
            name: company.nama,
            description: `Alamat: ${company.alamat} | Email: ${company.email} | Telepon: ${company.telepon}`,

            jobs: [
              {
                title: job.nama,
                location: company.alamat,
                type: job.jenisPekerjaan,
              },
            ],
          })
        );

        setCompanies(formattedCompanies);
      } catch (error) {
        console.error("Error fetching companies", error);
      }
    };

    fetchUserData();
    fetchCompanies();
  }, []);

  return (
    <main className="container mx-auto p-6">
      {userData && (
        <Card className="mb-8 shadow-lg">
          <CardContent className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <FaUser className="w-24 h-24 text-gray-500 rounded-full border-2 border-gray-300 p-2" />
            </div>
            <div>
              <CardDescription>
                <h4 className="font-bold text-black text-2xl">
                  {userData.nama}
                </h4>
                <p className="text-sm mt-2">Email: {userData.email}</p>
                <p className="text-sm mt-2">Telepon: {userData.telepon}</p>
                <p className="text-sm mt-2">Alamat: {userData.alamat}</p>
                <p className="text-sm mt-2">Status: {userData.peran}</p>
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="grid grid-cols-1 gap-6">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
      <div className="mb-6">
        <Button
          size="lg"
          className="w-full mt-4"
          variant="default"
          onClick={() => {
            window.location.href = "/Id/perusahaan"; // atau pakai <Link>
          }}
        >
          🔍 Lihat Semua Perusahaan
        </Button>
      </div>
    </main>
  );
};

export default HomePage;
