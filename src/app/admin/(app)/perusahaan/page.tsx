"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import axiosInstance from "@/lib/axios";
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
import { AiOutlineDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import ImportButtonExcel from "@/components/Import-Button-Excel";
import ExportButtonExcel from "@/components/Export-Button-Excel";
import SearchInput from "@/components/SearchInput";
import EditButton from "@/components/Edit-Button";
import ButtonTambah from "@/components/ButtonTambah";
import { FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Perusahaan {
  id: number;
  nama: string;
  // gambar?: string;
  alamat: string;
  email: string;
  telepon?: string;
  deskripsi?: string;
  [key: string]: unknown;
}

const DashboardPerusahaan = () => {
  const [perusahaanData, setPerusahaan] = useState<Perusahaan[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sortNamaDir, setSortNamaDir] = useState<"asc" | "desc">("asc");

  const isLoadingRef = useRef(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
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
      Swal.fire("Gagal", "Terjadi kesalahan dalam mengambil data.", "error");
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = async (formData: FormData) => {
    const nama = formData.get("nama") as string;
    const email = formData.get("email") as string;
    const alamat = formData.get("alamat") as string;

    if (!nama || !email || !alamat) {
      Swal.fire("Gagal", "Nama, Email, dan Alamat harus diisi.", "error");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Swal.fire("Gagal", "Format email tidak valid.", "error");
      return;
    }

    const data = {
      nama,
      email,
      gambar: formData.get("gambar") || "",
      telepon: formData.get("telepon") || "",
      alamat,
      deskripsi: formData.get("deskripsi") || "",
    };

    try {
      const response = await axiosInstance.post("/perusahaan/create", data);
      if (response.data) {
        await fetchData();
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

  const handleImport = async (file: File) => {
    const validExtensions = [".xlsx", ".xls"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (!validExtensions.includes(`.${fileExtension}`)) {
      Swal.fire("Gagal", "File harus berformat .xlsx atau .xls", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    try {
      await axiosInstance.post("/perusahaan/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchData();
      Swal.fire("Berhasil", "Data berhasil diimpor.", "success");
    } catch (error) {
      console.error("Import perusahaan error:", error);
      Swal.fire("Gagal", "Import data gagal.", "error");
    } finally {
      setIsLoading(false);
    }
  };

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
        } catch {
          Swal.fire("Gagal", "Tidak dapat menghapus data.", "error");
        }
      }
    });
  };

  const highlightText = useCallback((text: string, highlight: string) => {
    if (!text || !highlight) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
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

  const handleSortNama = () => {
    const newDirection = sortNamaDir === "asc" ? "desc" : "asc";
    const sorted = [...perusahaanData].sort((a, b) =>
      newDirection === "asc"
        ? a.nama.localeCompare(b.nama)
        : b.nama.localeCompare(a.nama)
    );
    setPerusahaan(sorted);
    setSortNamaDir(newDirection);
  };

  const formFields = [
    { label: "Nama", name: "nama", placeholder: "Masukkan nama" },
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Masukkan email",
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

  const filteredData = perusahaanData.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <TooltipProvider>
      <Card className="p-6 space-y-6">
        <CardHeader>
          <CardTitle className="text-2xl">Dashboard Perusahaan</CardTitle>
          <CardDescription>
            Kelola dan pantau semua data lowongan perusahaan di sini.
          </CardDescription>
        </CardHeader>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center mb-4">
              Table Perusahaan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <ButtonTambah formFields={formFields} onSubmit={handleAdd} />
                <ImportButtonExcel onUpload={handleImport} />
                <ExportButtonExcel onClick={handleExportExcel} />
              </div>
              <div className="w-full md:w-1/3">
                <SearchInput value={searchTerm} onChange={setSearchTerm} />
              </div>
            </div>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-md" />
                ))}
              </div>
            ) : (
              <Table>
                <TableCaption>Daftar perusahaan terdaftar.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      onClick={handleSortNama}
                      style={{ cursor: "pointer" }}
                      className="flex items-center"
                    >
                      Nama
                      {sortNamaDir === "asc" ? (
                        <FaSortAlphaDown className="ml-2" />
                      ) : (
                        <FaSortAlphaDownAlt className="ml-2" />
                      )}
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telepon</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData
                    .filter((item) =>
                      item.nama.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {highlightText(item.nama, searchTerm)}
                        </TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.telepon}</TableCell>
                        <TableCell>{item.alamat}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <EditButton
                              formFields={formFields}
                              onSubmit={handleEdit}
                              editData={item}
                            />
                            <Tooltip>
                              <TooltipTrigger asChild>
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
            )}
            {!isLoading && totalPages > 1 && (
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
      </Card>
    </TooltipProvider>
  );
};

export default DashboardPerusahaan;
