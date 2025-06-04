"use client";

import ExportButtonExcel from "@/components/Export-Button-Excel";
import ImportButtonExcel from "@/components/Import-Button-Excel";
import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FiBriefcase,
  FiClock,
  FiUser,
  FiUserCheck,
  FiCalendar,
} from "react-icons/fi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axiosInstance from "@/lib/axios";

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number | string;
};

import { AiOutlineDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import EditButton from "@/components/Edit-Button";
import BtnTambahPengguna from "@/components/ButtonTambah";
import { FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Lowongan {
  id: number;
  nama: string;
  ketentuan: string;
  persyaratan: string;
  salary?: string;
  jenisPekerjaan: string;
  perusahaan: {
    id: number;
    nama: string;
  };
  dibuatPada: string;
  expiredAt?: string;
  linkPendaftaran?: string;
  [key: string]: unknown;
}
interface Perusahaan {
  id: number;
  nama: string;
}

export default function DashboardLowongan() {
  const [lowonganData, setLowonganData] = useState<Lowongan[]>([]);
  const [perusahaanData, setPerusahaanData] = useState<Perusahaan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortNamaDir, setSortNamaDir] = useState<"asc" | "desc">("asc");
  const totalLowongan = lowonganData.length;
  const jenisCounts = {
    magang: lowonganData.filter((l) => l.jenisPekerjaan === "magang").length,
    paruh_waktu: lowonganData.filter((l) => l.jenisPekerjaan === "paruh_waktu")
      .length,
    penuh_waktu: lowonganData.filter((l) => l.jenisPekerjaan === "penuh_waktu")
      .length,
    freelance: lowonganData.filter((l) => l.jenisPekerjaan === "freelance")
      .length,
    kontrak: lowonganData.filter((l) => l.jenisPekerjaan === "kontrak").length,
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLowongan = async () => {
      try {
        const response = await axiosInstance.get("/lowongan/getall");
        const data = response.data?.data || [];
        setLowonganData(data);
      } catch (error) {
        console.error("Gagal memuat data lowongan:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPerusahaan = async () => {
      try {
        const response = await axiosInstance.get("/perusahaan/getall");
        setPerusahaanData(response.data?.data || []);
      } catch (error) {
        console.error("Gagal memuat data perusahaan:", error);
      }
    };

    fetchLowongan();
    fetchPerusahaan();
  }, []);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axiosInstance.post("/lowongan/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const response = await axiosInstance.get("/lowongan/getall");
      setLowonganData(response.data?.data || []);
    } catch (error) {
      console.error("Gagal mengimpor data:", error);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await axiosInstance.get("/lowongan/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data-Lowongan.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export gagal:", error);
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Lowongan ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(`/lowongan/delete/${id}`);
          if (response.status === 200) {
            Swal.fire("Dihapus!", "Lowongan telah dihapus.", "success");
            setLowonganData((prevData) =>
              prevData.filter((lowongan) => lowongan.id !== id)
            );
          } else {
            Swal.fire("Gagal!", "Gagal menghapus lowongan.", "error");
          }
        } catch (error) {
          Swal.fire(
            "Gagal!",
            "Terjadi kesalahan saat menghapus lowongan.",
            "error"
          );
          console.error("Error deleting lowongan:", error);
        }
      }
    });
  };

  const handleEdit = async (id: number, data: FormData) => {
    const updatedLowongan = {
      nama: data.get("nama") as string,
      ketentuan: data.get("ketentuan") as string,
      persyaratan: data.get("persyaratan") as string,
      jenisPekerjaan: data.get("jenisPekerjaan") as string,
      perusahaanId: Number(data.get("perusahaanId")),
      expiredAt: data.get("expiredAt") as string,
      salary: data.get("salary") as string,
      linkPendaftaran: data.get("linkPendaftaran") as string,
    };

    try {
      const response = await axiosInstance.put(
        `/lowongan/update/${id}`,
        updatedLowongan
      );

      if (response.status === 200) {
        Swal.fire("Berhasil", "Lowongan berhasil diperbarui.", "success");
        const perusahaan = perusahaanData.find(
          (p) => p.id === updatedLowongan.perusahaanId
        );
        setLowonganData((prevData) =>
          prevData.map((lowongan) =>
            lowongan.id === id
              ? {
                  ...lowongan,
                  ...updatedLowongan,
                  perusahaan: perusahaan
                    ? { id: perusahaan.id, nama: perusahaan.nama }
                    : {
                        id: updatedLowongan.perusahaanId,
                        nama: "Tidak diketahui",
                      },
                }
              : lowongan
          )
        );
      } else {
        Swal.fire("Gagal", "Gagal memperbarui lowongan.", "error");
      }
    } catch (error) {
      Swal.fire(
        "Gagal",
        "Terjadi kesalahan saat memperbarui lowongan.",
        "error"
      );
      console.error("Error updating lowongan:", error);
    }
  };

  const handleAdd = async (formData: FormData) => {
    const perusahaanId = Number(formData.get("perusahaanId"));

    if (isNaN(perusahaanId)) {
      Swal.fire("Gagal", "Perusahaan ID harus berupa angka!", "error");
      return;
    }

    const newLowongan = {
      nama: formData.get("nama") as string,
      ketentuan: formData.get("ketentuan") as string,
      persyaratan: formData.get("persyaratan") as string,
      salary: formData.get("salary") as string,
      jenisPekerjaan: formData.get("jenisPekerjaan") as string,
      perusahaanId: perusahaanId,
      linkPendaftaran: formData.get("linkPendaftaran") as string,
      expiredAt: formData.get("expiredAt") as string,
    };

    try {
      const response = await axiosInstance.post(
        "/lowongan/create",
        newLowongan
      );
      const created = response.data?.data;

      if (created) {
        const perusahaan = perusahaanData.find((p) => p.id === perusahaanId);

        const formattedLowongan: Lowongan = {
          id: created.id,
          nama: created.nama,
          ketentuan: created.ketentuan,
          persyaratan: created.persyaratan,
          salary: created.salary,
          jenisPekerjaan: created.jenisPekerjaan,
          linkPendaftaran: created.linkPendaftaran,
          dibuatPada: created.dibuatPada,
          expiredAt: created.expiredAt,
          perusahaan: {
            id: perusahaanId,
            nama: perusahaan?.nama || "Tidak diketahui",
          },
        };

        setLowonganData((prevData) => [formattedLowongan, ...prevData]);
        Swal.fire("Berhasil", "Lowongan berhasil ditambahkan", "success");
      }
    } catch (error) {
      console.error("Gagal menambahkan lowongan:", error);
      Swal.fire("Gagal", "Terjadi kesalahan, coba lagi.", "error");
    }
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleSortNama = () => {
    const newDirection = sortNamaDir === "asc" ? "desc" : "asc";
    const sorted = [...lowonganData].sort((a, b) =>
      newDirection === "asc"
        ? a.nama.localeCompare(b.nama)
        : b.nama.localeCompare(a.nama)
    );
    setLowonganData(sorted);
    setSortNamaDir(newDirection);
  };

  enum JenisPekerjaan {
    MAGANG = "magang",
    PARUH_WAKTU = "paruh_waktu",
    PENUH_WAKTU = "penuh_waktu",
    FREELANCE = "freelance",
    KONTRAK = "kontrak",
  }

  const jenisPekerjaanOptions = Object.values(JenisPekerjaan).map((value) => ({
    value,
    label: value.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
  }));

  const formFieldsLowongan = [
    {
      label: "Nama Lowongan",
      name: "nama",
      placeholder: "Masukkan nama lowongan",
      required: true,
    },
    {
      label: "Ketentuan",
      name: "ketentuan",
      type: "textarea",
      placeholder: "Masukkan ketentuan lowongan",
      required: true,
    },
    {
      label: "Persyaratan",
      name: "persyaratan",
      type: "textarea",
      placeholder: "Masukkan persyaratan lowongan",
      required: true,
    },
    {
      label: "Jenis Pekerjaan",
      name: "jenisPekerjaan",
      type: "select",
      required: true,
      options: jenisPekerjaanOptions,
      placeholder: "Pilih jenis pekerjaan",
    },
    {
      label: "Perusahaan",
      name: "perusahaanId",
      type: "select",
      required: true,
      options:
        perusahaanData?.map((perusahaan) => ({
          value: perusahaan.id.toString(),
          label: perusahaan.nama,
        })) || [],
      placeholder: "Pilih perusahaan",
    },
    {
      label: "Gaji",
      name: "salary",
      placeholder: "Masukkan gaji jika ada",
    },
    {
      label: "Tanggal Expired",
      name: "expiredAt",
      type: "date",
      placeholder: "Pilih tanggal expired",
    },
    {
      label: "Link Pendaftaran",
      name: "linkPendaftaran",
      type: "url",
      placeholder: "Masukkan link pendaftaran",
    },
  ];

  const filteredData = lowonganData.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg shadow hover:shadow-md transition-shadow duration-300">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-xl font-bold text-gray-800">{value}</div>
    </div>
  );

  return (
    <TooltipProvider>
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Lowongan</CardTitle>
            <CardDescription>
              Kelola dan pantau semua data lowongan perusahaan di sini.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Statistik */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard
                icon={
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FiBriefcase className="text-blue-600" />
                  </div>
                }
                label="Total Lowongan"
                value={totalLowongan}
              />
              <StatCard
                icon={
                  <div className="bg-orange-100 p-2 rounded-full">
                    <FiClock className="text-orange-500" />
                  </div>
                }
                label="Magang"
                value={jenisCounts.magang}
              />
              <StatCard
                icon={
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <FiUser className="text-yellow-600" />
                  </div>
                }
                label="Paruh Waktu"
                value={jenisCounts.paruh_waktu}
              />
              <StatCard
                icon={
                  <div className="bg-green-100 p-2 rounded-full">
                    <FiUserCheck className="text-green-600" />
                  </div>
                }
                label="Penuh Waktu"
                value={jenisCounts.penuh_waktu}
              />
              <StatCard
                icon={
                  <div className="bg-purple-100 p-2 rounded-full">
                    <FiUser className="text-purple-600" />
                  </div>
                }
                label="Freelance"
                value={jenisCounts.freelance}
              />
              <StatCard
                icon={
                  <div className="bg-red-100 p-2 rounded-full">
                    <FiCalendar className="text-red-600" />
                  </div>
                }
                label="Kontrak"
                value={jenisCounts.kontrak}
              />
            </div>

            {/* Aksi dan Search */}
            <div className="grid gap-4 lg:grid-cols-2 lg:items-center">
              <div className="flex flex-wrap gap-3">
                <BtnTambahPengguna
                  formFields={formFieldsLowongan}
                  onSubmit={handleAdd}
                />
                <ImportButtonExcel onUpload={handleUpload} />
                <ExportButtonExcel onClick={handleExportExcel} />
              </div>
              <div className="w-full lg:w-full">
                <SearchInput value={searchTerm} onChange={setSearchTerm} />
              </div>
            </div>

            {/* Tabel Lowongan */}
            {loading ? (
              <div className="text-center py-10 text-muted-foreground">
                Memuat data...
              </div>
            ) : (
              <Table>
                <TableCaption className="text-sm py-2 text-muted-foreground">
                  Daftar lowongan pekerjaan yang tersedia.
                </TableCaption>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead
                      onClick={handleSortNama}
                      className="cursor-pointer select-none flex items-center gap-2"
                    >
                      <span>Nama</span>
                      {sortNamaDir === "asc" ? (
                        <FaSortAlphaDown className="h-4 w-4" />
                      ) : (
                        <FaSortAlphaDownAlt className="h-4 w-4" />
                      )}
                    </TableHead>
                    <TableHead>Ketentuan</TableHead>
                    <TableHead>Persyaratan</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Perusahaan</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead>Expired</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {highlightText(item.nama, searchTerm)}
                      </TableCell>
                      <TableCell>{item.ketentuan}</TableCell>
                      <TableCell>{item.persyaratan}</TableCell>
                      <TableCell>{item.jenisPekerjaan}</TableCell>
                      <TableCell>{item.perusahaan.nama}</TableCell>
                      <TableCell>
                        {new Date(item.dibuatPada).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {item.expiredAt
                          ? new Date(item.expiredAt).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <EditButton
                          formFields={formFieldsLowongan}
                          onSubmit={handleEdit}
                          editData={item}
                        />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(item.id)}
                              className="hover:bg-red-100"
                            >
                              <AiOutlineDelete className="h-5 w-5 text-red-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Hapus</TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {!loading && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 gap-2">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {paginatedData.length} dari {filteredData.length}{" "}
                  data
                </div>
                <Pagination>
                  <PaginationContent className="flex-wrap justify-center sm:justify-end">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, index) => (
                      <PaginationItem key={index}>
                        <button
                          onClick={() => setCurrentPage(index + 1)}
                          className={`px-3 py-1 rounded-md text-sm ${
                            currentPage === index + 1
                              ? "bg-primary text-white"
                              : "hover:bg-muted text-gray-700"
                          }`}
                        >
                          {index + 1}
                        </button>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </TooltipProvider>
  );
}
