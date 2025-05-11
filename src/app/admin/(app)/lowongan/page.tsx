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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axiosInstance from "@/lib/axios";

import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

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
}

export default function DashboardLowongan() {
  const [lowonganData, setLowonganData] = useState<Lowongan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLowongan = async () => {
      try {
        const response = await axiosInstance.get("/lowongan/getall");
        console.log(response.data);
        const data = response.data?.data || [];
        setLowonganData(data);
      } catch (error) {
        console.error("Gagal memuat data lowongan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLowongan();
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

  const handleEdit = (updatedLowongan: Lowongan) => {
    setLowonganData((prevData) =>
      prevData.map((lowongan) =>
        lowongan.id === updatedLowongan.id ? updatedLowongan : lowongan
      )
    );
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

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          {/* Tombol di kiri */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Button variant="default" size="sm">
              <FaPlus className="w-4 h-4" /> Tambah Pengguna
            </Button>
            <ImportButtonExcel onUpload={handleUpload} />
            <ExportButtonExcel onClick={handleExportExcel} />
          </div>

          {/* Search di kanan */}
          <div className="w-full md:w-1/3 md:text-right">
            <SearchInput value={searchTerm} onChange={setSearchTerm} />
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <TableCaption>
              Daftar lowongan pekerjaan yang tersedia.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
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
              {lowonganData
                .filter((lowongan) =>
                  lowongan.nama.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((lowongan) => (
                  <TableRow key={lowongan.id}>
                    <TableCell className="font-medium">
                      {highlightText(lowongan.nama, searchTerm)}
                    </TableCell>
                    <TableCell>{lowongan.ketentuan}</TableCell>
                    <TableCell>{lowongan.persyaratan}</TableCell>
                    <TableCell>{lowongan.jenisPekerjaan}</TableCell>
                    <TableCell>{lowongan.perusahaan.nama}</TableCell>
                    <TableCell>
                      {new Date(lowongan.dibuatPada).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {lowongan.expiredAt
                        ? new Date(lowongan.expiredAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <AiOutlineEye className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Lihat</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <AiOutlineEdit className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(lowongan.id)}
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
      </div>
    </TooltipProvider>
  );
}
