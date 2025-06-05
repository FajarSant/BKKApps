"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axiosInstance from "@/lib/axios";
import ButtonTambah from "@/components/ButtonTambah";
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
import { AiOutlineDelete } from "react-icons/ai";
import ExportButtonExcel from "@/components/Export-Button-Excel";
import EditButton from "@/components/Edit-Button";
import ImportButtonExcel from "@/components/Import-Button-Excel";
import {
  FaSortAlphaDown,
  FaSortAlphaDownAlt,
  FaSortNumericDown,
  FaSortNumericDownAlt,
  FaUserCheck,
  FaUserGraduate,
  FaUserShield,
} from "react-icons/fa";
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
  katasandi?: string;
  [key: string]: unknown;
}

export default function DashboardPengguna() {
  const [PenggunaData, setPenggunaData] = useState<Pengguna[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortNamaDir, setSortNamaDir] = useState<"asc" | "desc">("asc");
  const [sortNisnDir, setSortNisnDir] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/pengguna/getall");
      setPenggunaData(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      await axiosInstance.post("/pengguna/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Berhasil!", "Data pengguna berhasil diimpor.", "success");
      fetchData();
    } catch {
      Swal.fire("Gagal!", "Gagal mengimpor data.", "error");
    }
  };

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
          fetchData();
        } catch {
          Swal.fire("Gagal!", "Gagal menghapus pengguna.", "error");
        }
      }
    });
  };

  const handleAdd = async (formData: FormData) => {
    const data = formFields.reduce((acc, field) => {
      let value = formData.get(field.name);

      if (field.type === "select" && value !== null) {
        value = value.toString();
      }
      if (field.name === "tanggalLahir" && value) {
        value = new Date(value.toString()).toISOString();
      }

      acc[field.name] = value || "";
      return acc;
    }, {} as Record<string, string | File>);

    try {
      const response = await axiosInstance.post("/pengguna/create", data);
      if (response.data) {
        Swal.fire("Berhasil", "Pengguna berhasil ditambahkan.", "success");
        fetchData();
      }
    } catch {
      Swal.fire("Gagal", "Tidak dapat menambah pengguna. Coba lagi.", "error");
    }
  };
  const handleEdit = async (id: number, formData: FormData) => {
    const data = formFields.reduce((acc, field) => {
      let value = formData.get(field.name);

      if (field.type === "select" && value !== null) {
        value = value.toString();
      }

      if (field.name === "katasandi" && (!value || value === "")) {
        return acc;
      }

      if (field.name === "tanggalLahir" && value) {
        value = new Date(value.toString()).toISOString();
      }

      acc[field.name] = value === null || value === "" ? null : value;
      return acc;
    }, {} as Record<string, string | File | null>);

    try {
      const response = await axiosInstance.put(`/pengguna/update/${id}`, data);

      if (response.data) {
        setPenggunaData((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...data,
                }
              : item
          )
        );

        Swal.fire("Berhasil", "Data pengguna berhasil diperbarui.", "success");
      }
    } catch {
      Swal.fire("Gagal", "Tidak dapat memperbarui data pengguna.", "error");
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
    const sorted = [...PenggunaData].sort((a, b) =>
      newDirection === "asc"
        ? a.nama.localeCompare(b.nama)
        : b.nama.localeCompare(a.nama)
    );
    setPenggunaData(sorted);
    setSortNamaDir(newDirection);
  };

  const handleSortNisn = () => {
    const newDirection = sortNisnDir === "asc" ? "desc" : "asc";
    const sorted = [...PenggunaData].sort((a, b) => {
      const aNisn = parseInt(a.nisn || "0", 10);
      const bNisn = parseInt(b.nisn || "0", 10);
      return newDirection === "asc" ? aNisn - bNisn : bNisn - aNisn;
    });
    setPenggunaData(sorted);
    setSortNisnDir(newDirection);
  };

  const formFields = [
    { label: "Nama", name: "nama", placeholder: "Masukkan nama", type: "text" },
    {
      label: "Email",
      name: "email",
      placeholder: "Masukkan email",
      type: "email",
    },
    {
      label: "Kata Sandi",
      name: "katasandi",
      placeholder: "Masukkan kata sandi",
      type: "password",
    },
    {
      label: "NISN",
      name: "nisn",
      placeholder: "Masukkan NISN",
      type: "number",
    },
    {
      label: "Telepon",
      name: "telepon",
      placeholder: "Masukkan nomor telepon",
      type: "number",
    },
    {
      label: "Alamat",
      name: "alamat",
      placeholder: "Masukkan alamat",
      type: "text",
    },
    {
      label: "Tanggal Lahir",
      name: "tanggalLahir",
      placeholder: "Masukkan tanggal lahir",
      type: "date",
    },
    {
      label: "Jenis Kelamin",
      name: "jenisKelamin",
      placeholder: "Pilih jenis kelamin",
      type: "select",
      required: true,
      options: [
        { value: "laki_laki", label: "Laki-laki" },
        { value: "perempuan", label: "Perempuan" },
      ],
    },
    {
      label: "Peran Pengguna",
      name: "peran",
      placeholder: "Pilih peran pengguna",
      type: "select",
      required: true,
      options: [
        { value: "siswa", label: "Siswa" },
        { value: "alumni", label: "Alumni" },
        { value: "admin", label: "Admin" },
      ],
    },
  ];
  const filteredData = PenggunaData.filter((item) =>
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
          <CardTitle className="text-2xl">Dashboard Pengguna</CardTitle>
          <CardDescription>
            Kelola dan pantau semua data lowongan pengguna di sini.
          </CardDescription>
        </CardHeader>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-6 text-center shadow-sm">
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaUserShield className="text-blue-600 h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Pengguna
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredData.length}
              </p>
            </div>
          </Card>
          <Card className="p-6 text-center shadow-sm">
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-red-100 p-3 rounded-full">
                <FaUserShield className="text-red-500 h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Admin</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredData.filter((user) => user.peran === "admin").length}
              </p>
            </div>
          </Card>
          <Card className="p-6 text-center shadow-sm">
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-green-100 p-3 rounded-full">
                <FaUserGraduate className="text-green-500 h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Siswa</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredData.filter((user) => user.peran === "siswa").length}
              </p>
            </div>
          </Card>
          <Card className="p-6 text-center shadow-sm">
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaUserCheck className="text-yellow-500 h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Alumni
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredData.filter((user) => user.peran === "alumni").length}
              </p>
            </div>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center mb-4">
              Table Pengguna
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <ButtonTambah formFields={formFields} onSubmit={handleAdd} />
                <ImportButtonExcel onUpload={handleUpload} />
                <ExportButtonExcel onClick={handleExportExcel} />
              </div>
              <div className="w-full md:w-1/3">
                <SearchInput value={searchTerm} onChange={setSearchTerm} />
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-md" />
                ))}
              </div>
            ) : (
              <Table>
                <TableCaption>Daftar pengguna yang terdaftar.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      onClick={handleSortNama}
                      className="cursor-pointer flex items-center"
                    >
                      Nama
                      {sortNamaDir === "asc" ? (
                        <FaSortAlphaDown className="ml-2" />
                      ) : (
                        <FaSortAlphaDownAlt className="ml-2" />
                      )}
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Peran</TableHead>
                    <TableHead
                      onClick={handleSortNisn}
                      className="cursor-pointer flex items-center"
                    >
                      NISN
                      {sortNisnDir === "asc" ? (
                        <FaSortNumericDown className="ml-2" />
                      ) : (
                        <FaSortNumericDownAlt className="ml-2" />
                      )}
                    </TableHead>
                    <TableHead>Jenis Kelamin</TableHead>
                    <TableHead>Telepon</TableHead>
                    <TableHead>Tanggal Lahir</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData
                    .filter((item) =>
                      item.nama.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {highlightText(item.nama, searchTerm)}
                        </TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.peran}</TableCell>
                        <TableCell>{item.nisn}</TableCell>
                        <TableCell>{item.jenisKelamin || "-"}</TableCell>
                        <TableCell>{item.telepon || "-"}</TableCell>
                        <TableCell>
                          {item.tanggalLahir
                            ? new Date(item.tanggalLahir).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {new Date(item.dibuatPada).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <EditButton
                            key={`edit-button-${item.id}`}
                            formFields={formFields}
                            onSubmit={handleEdit}
                            editData={item}
                          />
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(item.id)}
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
      </Card>
    </TooltipProvider>
  );
}
