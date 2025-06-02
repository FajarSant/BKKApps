"use client";

import { useEffect, useState } from "react";
import CompanyCard from "@/components/CompanyCard";
import axiosInstance from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

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
  imageUrl: string;
}

interface CompanyApiResponse {
  id: number;
  nama: string;
  alamat: string;
  email: string;
  telepon: string;
  gambar?: string;
  lowongan?: {
    nama: string;
    jenisPekerjaan: string;
  }[];
}

export default function PerusahaanPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axiosInstance.get("/perusahaan/getall");
        console.log("📦 Company API response:", response.data);

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data;

        if (!Array.isArray(data)) {
          throw new Error("Response bukan array perusahaan.");
        }

        const formattedCompanies: Company[] = data
          .map((company: CompanyApiResponse) => {
            const jobs =
              company.lowongan?.map((job) => ({
                title: job.nama,
                location: company.alamat,
                type: job.jenisPekerjaan,
              })) || [];

            return {
              id: company.id,
              name: company.nama,
              description: `Alamat: ${company.alamat} | Email: ${company.email} | Telepon: ${company.telepon}`,
              imageUrl: company.gambar?.trim()
                ? company.gambar
                : getRandomDefaultImage(),
              jobs,
            };
          })
          .filter((company) => company.jobs.length > 0);

        setCompanies(formattedCompanies);
      } catch (error) {
        console.error("Error fetching companies", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 w-full relative border-b-2">
        <button
          onClick={() => router.back()}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          aria-label="Kembali"
        >
          <FaArrowLeft className="text-gray-700 dark:text-gray-200 w-5 h-5" />
        </button>
        <h1 className="text-3xl text-center font-bold text-gray-900 dark:text-white mb-4">
          Daftar Perusahaan
        </h1>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-md" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
}

function getRandomDefaultImage(): string {
  const images = [
    "/images/default1.jpg",
    "/images/default2.jpg",
    "/images/default3.jpg",
  ];
  return images[Math.floor(Math.random() * images.length)];
}
