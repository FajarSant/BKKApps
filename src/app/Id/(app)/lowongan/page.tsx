"use client";

import React, { useState, useEffect } from "react";
import CardJob from "@/components/CardJob";
import axiosInstance from "@/lib/axios";

interface Lowongan {
  id: number;
  nama: string;
  ketentuan: string;
  persyaratan: string;
  salary: string;
  dibuatPada: string;
  expiredAt: string;
  jenisPekerjaan: string;
  linkPendaftaran?: string;
  perusahaan: {
    nama: string;
    alamat: string;
  };
}

const SkeletonJobCard = () => (
  <div className="w-full shadow rounded-lg p-6 border animate-pulse bg-white dark:bg-gray-900">
    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
    </div>
  </div>
);

const Page = () => {
  const [jobs, setJobs] = useState<Lowongan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/lowongan/getall");
        const jobsData = Array.isArray(res.data?.data) ? res.data.data : [];
        setJobs(jobsData);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          Temukan Pekerjaan Impian Anda
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
          Jelajahi berbagai lowongan pekerjaan dari berbagai perusahaan terbaik.
        </p>
      </header>

      {/* Content */}
      <section className="space-y-6 mx-8">
        {loading &&
          [...Array(3)].map((_, idx) => <SkeletonJobCard key={idx} />)}

        {!loading && jobs.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Tidak ada lowongan tersedia saat ini.
          </p>
        )}

        {!loading &&
          jobs.map((job) => {
            const salaryNumber = parseInt(job.salary);
            const salaryFormatted =
              !isNaN(salaryNumber) && salaryNumber > 0
                ? `Rp ${salaryNumber.toLocaleString("id-ID")}`
                : "Gaji Tidak Tersedia";

            const requirements = job.persyaratan
              ? job.persyaratan
                  .split("\n")
                  .map((req) => req.trim())
                  .filter(Boolean)
              : [];

            return (
              <CardJob
                key={job.id}
                id={job.id}
                title={job.nama}
                company={job.perusahaan?.nama || "-"}
                description={job.ketentuan || "-"}
                salary={salaryFormatted}
                requirements={requirements}
                positionLevel=""
                categories={job.jenisPekerjaan ? [job.jenisPekerjaan] : []}
                dibuatPada={job.dibuatPada}
                expiredAt={job.expiredAt}
                linkDaftar={job.linkPendaftaran}
                alamatPerusahaan={job.perusahaan.alamat}
              />
            );
          })}
      </section>
    </main>
  );
};

export default Page;
