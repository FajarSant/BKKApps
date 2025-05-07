"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
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

import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";
import ImportButtonExcel from "@/components/Import-Button-Excel";
import ExportButtonExcel from "@/components/Export-Button-Excel";
import SearchInput from "@/components/SearchInput";
import Modal from "@/components/Modal";

interface Perusahaan {
  id: number;
  nama: string;
  gambar?: string;
  alamat: string;
  email: string;
  telepon?: string;
  deskripsi?: string;
}

export default function DashboardPerusahaan() {
  const [perusahaan, setPerusahaan] = useState<Perusahaan[]>([]);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    await axiosInstance.post("/api/dashboard-upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/perusahaan");
        console.log("Response perusahaan:", res.data); // ⬅️ Log dulu
        if (Array.isArray(res.data)) {
          setPerusahaan(res.data);
        } else if (Array.isArray(res.data.data)) {
          setPerusahaan(res.data.data);
        } else {
          console.error("Data perusahaan bukan array:", res.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data perusahaan:", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Hapus perusahaan?",
      text: "Data perusahaan ini akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/perusahaan/${id}`);
          setPerusahaan((prev) => prev.filter((p) => p.id !== id));
          Swal.fire("Berhasil!", "Data perusahaan dihapus.", "success");
        } catch (error) {
          Swal.fire("Gagal", "Tidak dapat menghapus data.", "error");
        }
      }
    });
  };

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Button variant="default" size="sm">
              <FaPlus className="w-4 h-4 mr-1" /> Tambah Pengguna
            </Button>
            <ImportButtonExcel onUpload={handleUpload} />
            <Modal />
            <ExportButtonExcel />
          </div>

          <div className="w-full md:w-1/3 md:text-right">
            <SearchInput />
          </div>
        </div>

        <Table>
          <TableCaption>Daftar perusahaan terdaftar.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {perusahaan.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.nama}</TableCell>
                <TableCell>{p.email}</TableCell>
                <TableCell>{p.telepon ?? "-"}</TableCell>
                <TableCell>{p.alamat}</TableCell>
                <TableCell>
                  {p.deskripsi
                    ? p.deskripsi.length > 50
                      ? p.deskripsi.substring(0, 50) + "..."
                      : p.deskripsi
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
                        onClick={() => handleDelete(p.id)}
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
