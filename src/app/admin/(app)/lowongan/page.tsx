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

const data = [
  {
    id: 1,
    nama: "Software Engineer",
    ketentuan: "Full-time, remote, fleksibel",
    persyaratan: "Pengalaman React, Node.js",
    jenisPekerjaan: "Full-Time",
    perusahaan: {
      id: 1,
      nama: "PT Teknologi Inovatif",
    },
    dibuatPada: "2025-05-01T10:00:00Z",
    expiredAt: "2025-06-01T10:00:00Z",
  },
];

export default function DashboardLowongan() {
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    await axiosInstance.post("/api/dashboard-upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };
  const handleExportExcel = async () => {
    try {
      const response = await axiosInstance.get("/export/excel", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data-export.xlsx");
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
    }).then((result) => {
      if (result.isConfirmed) {
        // TODO: Call delete function here
        Swal.fire("Dihapus!", "Lowongan telah dihapus.", "success");
      }
    });
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
            <SearchInput />
          </div>
        </div>

        <Table>
          <TableCaption>Daftar lowongan pekerjaan yang tersedia.</TableCaption>
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
            {data.map((lowongan) => (
              <TableRow key={lowongan.id}>
                <TableCell className="font-medium">{lowongan.nama}</TableCell>
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
      </div>
    </TooltipProvider>
  );
}
