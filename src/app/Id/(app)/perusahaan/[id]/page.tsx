"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark, ArrowRight, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Info Perusahaan */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">{company.nama}</h1>
        <p className="mt-2 text-gray-700">{company.deskripsi}</p>
        <div className="mt-4 text-sm text-gray-600 space-y-1">
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
            {company.lowongan.map((job) => (
              <Card
                key={job.id}
                className="hover:border-blue-600 transition-all"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {job.nama}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {job.jenisPekerjaan} • Rp {job.salary}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Dibuat: {new Date(job.dibuatPada).toLocaleDateString()}
                    </Badge>
                  </div>

                  <div className="text-sm space-y-2 text-gray-700">
                    <div>
                      <strong>Ketentuan:</strong>
                      <ul className="list-disc list-inside ml-2">
                        {job.ketentuan.split("\n").map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <strong>Persyaratan:</strong>
                      <ul className="list-disc list-inside ml-2">
                        {job.persyaratan.split("\n").map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      Berlaku hingga{" "}
                      {new Date(job.expiredAt).toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline">
                        <Bookmark className="w-4 h-4 mr-1" /> Simpan
                      </Button>

                      <Link href={`/lowongan/${job.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" /> Lihat Detail
                        </Button>
                      </Link>

                      {job.linkPendaftaran ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <ArrowRight className="w-4 h-4 mr-1" /> Daftar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Konfirmasi Pendaftaran</DialogTitle>
                            </DialogHeader>
                            <p className="text-sm text-muted-foreground">
                              Anda akan diarahkan ke halaman pendaftaran
                              eksternal. Apakah Anda yakin ingin melanjutkan?
                            </p>
                            <DialogFooter className="mt-4 flex justify-end gap-2">
                              <DialogTrigger asChild>
                                <Button variant="outline">Batal</Button>
                              </DialogTrigger>
                              <Button
                                onClick={() => {
                                  window.open(job.linkPendaftaran, "_blank");
                                }}
                              >
                                Lanjutkan
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Button size="sm" disabled>
                          <ArrowRight className="w-4 h-4 mr-1" /> Tidak Tersedia
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
