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
import ImportButtonExcel from "@/components/Import-Button-Excel";
import ExportButtonExcel from "@/components/Export-Button-Excel";
import SearchInput from "@/components/SearchInput";
import BtnTambahPengguna from "@/components/BtnTambahPengguna";

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
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/perusahaan/getall");
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        if (Array.isArray(data)) {
          setPerusahaan(data);
        } else {
          throw new Error("Format data tidak valid.");
        }
      } catch (error) {
        console.error("Gagal mengambil data perusahaan:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (formData: FormData) => {
    try {
      const data = {
        nama: formData.get("nama"),
        email: formData.get("email"),
      };

      const response = await axiosInstance.post("/perusahaan/create", data);
      setPerusahaan((prev) => [...prev, response.data]);

      Swal.fire("Berhasil", "Perusahaan berhasil ditambahkan.", "success");
    } catch (error) {
      console.error("Tambah perusahaan error:", error);
      Swal.fire("Gagal", "Tidak dapat menambah data.", "error");
    }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axiosInstance.post("/perusahaan/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const res = await axiosInstance.get("/perusahaan/getall");
      const data = Array.isArray(res.data) ? res.data : res.data.data;
      setPerusahaan(data);

      Swal.fire("Berhasil", "Data berhasil diimpor.", "success");
    } catch (error) {
      console.error("Import perusahaan error:", error);
      Swal.fire("Gagal", "Import data gagal.", "error");
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await axiosInstance.get("/perusahaan/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Data-Perusahaan.xlsx");
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
      title: "Hapus perusahaan?",
      text: "Data perusahaan ini akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/perusahaan/delete/${id}`);
          setPerusahaan((prev) => prev.filter((p) => p.id !== id));
          Swal.fire("Berhasil!", "Data perusahaan dihapus.", "success");
        } catch (error) {
          Swal.fire("Gagal", "Tidak dapat menghapus data.", "error");
        }
      }
    });
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

  const formFields = [
    { label: "Nama", name: "nama", placeholder: "Masukkan nama" },
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Masukkan email",
    },
  ];

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <BtnTambahPengguna
              formFields={formFields}
              onSubmit={handleSubmit}
            />
            <ImportButtonExcel onUpload={handleUpload} />
            <ExportButtonExcel onClick={handleExportExcel} />
          </div>
          <div className="w-full md:w-1/3 md:text-right">
            <SearchInput value={searchTerm} onChange={setSearchTerm} />
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
            {perusahaan
              .filter((p) =>
                p.nama.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    {highlightText(p.nama, searchTerm)}
                  </TableCell>
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
