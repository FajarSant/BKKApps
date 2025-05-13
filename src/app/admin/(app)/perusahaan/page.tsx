"use client";

import { useEffect, useState, useCallback } from "react";
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
import EditButton from "@/components/Edit-Button";

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
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data perusahaan
  const fetchData = useCallback(async () => {
    if (isLoading) return; // Menghindari multiple requests
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/perusahaan/getall");
      const data = Array.isArray(res.data) ? res.data : res.data.data;

      if (Array.isArray(data)) {
        const sortedData = data.sort((a, b) => a.nama.localeCompare(b.nama));
        setPerusahaan(sortedData);
      } else {
        throw new Error("Format data tidak valid.");
      }
    } catch (error) {
      console.error("Gagal mengambil data perusahaan:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Menambah data perusahaan baru
  const handleAdd = async (formData: FormData) => {
    const nama = formData.get("nama") as string;
    const email = formData.get("email") as string;
    const alamat = formData.get("alamat") as string;
    const gambar = formData.get("gambar") as string;

    // Validasi form
    if (!nama || !email || !alamat || !gambar) {
      Swal.fire(
        "Gagal",
        "Nama, Email, dan Alamat, Gambar harus diisi.",
        "error"
      );
      return;
    }

    // Validasi format email
    if (!/\S+@\S+\.\S+/.test(email)) {
      Swal.fire("Gagal", "Format email tidak valid.", "error");
      return;
    }

    const data = {
      nama,
      email,
      gambar: formData.get("gambar") || "",
      telepon: formData.get("telepon") ? formData.get("telepon") : "",
      alamat,
      deskripsi: formData.get("deskripsi") || "",
    };

    try {
      const response = await axiosInstance.post("/perusahaan/create", data);
      if (response.data) {
        await fetchData(); // Memanggil fetchData untuk mengupdate data dari server
        Swal.fire("Berhasil", "Perusahaan berhasil ditambahkan.", "success");
      } else {
        throw new Error("Data yang diterima tidak valid.");
      }
    } catch (error) {
      console.error("Tambah perusahaan error:", error);
      Swal.fire(
        "Gagal",
        "Tidak dapat menambah data perusahaan. Coba lagi.",
        "error"
      );
    }
  };

  // Mengimpor data perusahaan dari file
  const handleImport = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true); // Set loading state
    try {
      await axiosInstance.post("/perusahaan/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchData(); // Fetch data setelah import
      Swal.fire("Berhasil", "Data berhasil diimpor.", "success");
    } catch (error) {
      console.error("Import perusahaan error:", error);
      Swal.fire("Gagal", "Import data gagal.", "error");
    } finally {
      setIsLoading(false); // Set loading false setelah selesai
    }
  };

  // Mengekspor data perusahaan ke file Excel
  const handleExportExcel = async () => {
    setIsLoading(true);
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

      Swal.fire("Berhasil", "Data berhasil diekspor.", "success");
    } catch (error) {
      console.error("Export gagal:", error);
      Swal.fire("Gagal", "Gagal mengekspor data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Mengedit data perusahaan
  const handleEdit = async (id: number, formData: FormData) => {
    const data = {
      nama: formData.get("nama") as string,
      email: formData.get("email") as string,
      gambar: formData.get("gambar") as string,
      telepon: formData.get("telepon") as string,
      alamat: formData.get("alamat") as string,
      deskripsi: formData.get("deskripsi") as string,
    };

    try {
      await axiosInstance.put(`/perusahaan/update/${id}`, data);

      setPerusahaan((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data } : item))
      );

      Swal.fire("Berhasil", "Data perusahaan berhasil diperbarui.", "success");
    } catch (error) {
      console.error("Update perusahaan error:", error);
      Swal.fire("Gagal", "Tidak dapat memperbarui data.", "error");
    }
  };

  // Menghapus data perusahaan
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
          setPerusahaan((prev) => prev.filter((p) => p.id !== id)); // Menghapus perusahaan dari state
          Swal.fire("Berhasil!", "Data perusahaan dihapus.", "success");
        } catch (error) {
          Swal.fire("Gagal", "Tidak dapat menghapus data.", "error");
        }
      }
    });
  };

  // Menyoroti teks pada pencarian
  const highlightText = useCallback((text: string, highlight: string) => {
    if (!text || !highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={`highlight-${i}`} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : (
        <span key={`normal-${i}`}>{part}</span>
      )
    );
  }, []);

  const formFields = [
    { label: "Nama", name: "nama", placeholder: "Masukkan nama" },
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Masukkan email",
    },
    {
      label: "Gambar",
      name: "gambar",
      placeholder: "Masukkan Url Gambar Jika Ada",
    },

    {
      label: "Telepon",
      name: "telepon",
      placeholder: "Masukkan nomor telepon",
    },
    { label: "Alamat", name: "alamat", placeholder: "Masukkan alamat" },
    {
      label: "Deskripsi",
      name: "deskripsi",
      placeholder: "Masukkan deskripsi",
    },
  ];

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <BtnTambahPengguna formFields={formFields} onSubmit={handleAdd} />
            <ImportButtonExcel onUpload={handleImport} />
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
              <TableHead>Url Gambar</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {perusahaan
              .filter((item) =>
                item.nama.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{highlightText(item.nama, searchTerm)}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.gambar}</TableCell>
                  <TableCell>{item.telepon}</TableCell>
                  <TableCell>{item.alamat}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <EditButton
                        key={`edit-button-${item.id}`}
                        formFields={formFields}
                        onSubmit={handleEdit}
                        editData={item}
                      />
                      <Tooltip>
                        <TooltipTrigger>
                          <AiOutlineDelete
                            onClick={() => handleDelete(item.id)}
                            className="cursor-pointer text-red-500"
                          />
                        </TooltipTrigger>
                        <TooltipContent>Hapus</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
