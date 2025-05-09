"use client";

import { useEffect, useState } from "react";
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

import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import axiosInstance from "@/lib/axios"; // Pastikan path sesuai struktur proyekmu

interface Pengguna {
  id: number;
  nama: string;
  email: string;
  peran: string;
  nisn: string;
  alamat?: string;
  telepon?: string;
  tanggalLahir?: string;
  jenisKelamin?: string;
  dibuatPada: string;
}

export default function DashboardPengguna() {
  const [data, setData] = useState<Pengguna[]>([]);
  const [loading, setLoading] = useState(true);

  // Fungsi ambil data
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/pengguna/getall");
      setData(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi import
  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      await axiosInstance.post("/pengguna/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Berhasil!", "Data pengguna berhasil diimpor.", "success");
      fetchData(); // Refresh data setelah import
    } catch (error) {
      Swal.fire("Gagal!", "Gagal mengimpor data.", "error");
    }
  };

  // Fungsi export
  const handleExportExcel = async () => {
    try {
      const response = await axiosInstance.get("/pengguna/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data-pengguna.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export gagal:", error);
    }
  };

  // Fungsi hapus
  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Pengguna ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/pengguna/delete/${id}`);
          Swal.fire("Dihapus!", "Pengguna telah dihapus.", "success");
          fetchData(); // Refresh data setelah hapus
        } catch (error) {
          Swal.fire("Gagal!", "Gagal menghapus pengguna.", "error");
        }
      }
    });
  };

  // Fungsi tambah (dummy contoh)
  const handleAdd = async () => {
    try {
      await axiosInstance.post("/pengguna/create", {
        nama: "Pengguna Baru",
        email: "baru@example.com",
        peran: "siswa",
        nisn: "0000000000",
      });

      Swal.fire("Berhasil!", "Pengguna baru ditambahkan.", "success");
      fetchData(); // Refresh data setelah tambah
    } catch (error) {
      Swal.fire("Gagal!", "Gagal menambahkan pengguna.", "error");
    }
  };

  // Fungsi edit (dummy contoh)
  const handleEdit = async (id: number) => {
    try {
      await axiosInstance.put(`/pengguna/update/${id}`, {
        nama: "Nama Diedit",
      });

      Swal.fire("Berhasil!", "Data pengguna berhasil diedit.", "success");
      fetchData(); // Refresh data setelah edit
    } catch (error) {
      Swal.fire("Gagal!", "Gagal mengedit data pengguna.", "error");
    }
  };

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Button variant="default" size="sm" onClick={handleAdd}>
              <FaPlus className="w-4 h-4 mr-1" /> Tambah Pengguna
            </Button>
            <ImportButtonExcel onUpload={handleUpload} />
            <ExportButtonExcel onClick={handleExportExcel} />
          </div>

          <div className="w-full md:w-1/3 md:text-right">
            <SearchInput />
          </div>
        </div>

        {loading ? (
          <p>Memuat data pengguna...</p>
        ) : (
          <Table>
            <TableCaption>Daftar pengguna yang terdaftar.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>NISN</TableHead>
                <TableHead>Jenis Kelamin</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Tanggal Lahir</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((pengguna) => (
                <TableRow key={pengguna.id}>
                  <TableCell className="font-medium">{pengguna.nama}</TableCell>
                  <TableCell>{pengguna.email}</TableCell>
                  <TableCell>{pengguna.peran}</TableCell>
                  <TableCell>{pengguna.nisn}</TableCell>
                  <TableCell>{pengguna.jenisKelamin || "-"}</TableCell>
                  <TableCell>{pengguna.telepon || "-"}</TableCell>
                  <TableCell>
                    {pengguna.tanggalLahir
                      ? new Date(pengguna.tanggalLahir).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {new Date(pengguna.dibuatPada).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(pengguna.id)}
                        >
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
                          onClick={() => handleDelete(pengguna.id)}
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
