"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import axiosInstance from "@/lib/axios";
import CardJob from "@/components/CardJob";
import { FaArrowLeft } from "react-icons/fa";

interface Job {
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

interface CompanyDetail {
  id: number;
  nama: string;
  gambar: string;
  alamat: string;
  email: string;
  telepon: string;
  deskripsi: string;
  lowongan: Job[];
}

export default function PerusahaanDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axiosInstance.get(`/perusahaan/get/${id}`);
        setCompany(response.data.data);
      } catch (err) {
        setError("Gagal memuat data perusahaan.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Memuat data perusahaan...
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="text-center mt-10 text-destructive font-medium">
        {error || "Perusahaan tidak ditemukan."}
      </div>
    );
  }

  return (
    <main className="container mx-auto p-6">
      {/* Info Perusahaan */}
      <div className="flex items-center gap-4 w-full relative border-b-2">
        <button
          onClick={() => router.back()}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          aria-label="Kembali"
        >
          <FaArrowLeft className="text-gray-700 dark:text-gray-200 w-5 h-5" />
        </button>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 font-semibold text-lg text-gray-800 dark:text-gray-100">
          Detail Lowongan
        </h1>
      </div>
      <section className="mb-10 mt-10">
        <h1 className="text-3xl text-center font-bold mb-10 text-gray-900">{company.nama}</h1>
        <p className="mt-2 text-justify text-gray-700">{company.deskripsi}</p>
        <div className="mt-4 text-sm text-gray-600 space-y-6">
          <p>
            <strong>Alamat:</strong> {company.alamat}
          </p>
          <p>
            <strong>Email:</strong> {company.email}
          </p>
          <p>
            <strong>Telepon:</strong> {company.telepon}
          </p>
        </div>
      </section>

      {/* Lowongan */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Lowongan Pekerjaan
        </h2>

        {company.lowongan.length === 0 ? (
          <p className="text-muted-foreground">
            Tidak ada lowongan tersedia saat ini.
          </p>
        ) : (
          <div className="grid gap-6">
            {company.lowongan.map((job) => {
              const salaryNumber = parseInt(job.salary);
              const salaryFormatted =
                !isNaN(salaryNumber) && salaryNumber > 0
                  ? `Rp ${salaryNumber.toLocaleString("id-ID")}`
                  : "Gaji Tidak Tersedia";

              const requirements = job.persyaratan
                ? job.persyaratan
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                : [];

              return (
                <CardJob
                  key={job.id}
                  id={job.id}
                  title={job.nama}
                  description={job.ketentuan}
                  requirements={requirements}
                  company={company.nama}
                  salary={salaryFormatted}
                  positionLevel=""
                  dibuatPada={job.dibuatPada}
                  expiredAt={job.expiredAt}
                  categories={job.jenisPekerjaan ? [job.jenisPekerjaan] : []}
                  linkDaftar={job.linkPendaftaran}
                  alamatPerusahaan={company.alamat}
                />
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
