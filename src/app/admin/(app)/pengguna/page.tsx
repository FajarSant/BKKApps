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
} from "react-icons/fa";

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
  const [data, setData] = useState<Pengguna[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortNamaDir, setSortNamaDir] = useState<"asc" | "desc">("asc");
  const [sortNisnDir, setSortNisnDir] = useState<"asc" | "desc">("asc");

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

  // handleAdd
  const handleAdd = async (formData: FormData) => {
    const data = formFields.reduce((acc, field) => {
      let value = formData.get(field.name);

      if (field.type === "select" && value !== null) {
        value = value.toString();
      }

      // Format tanggal ke ISO string jika ada
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

  // handleEdit
  const handleEdit = async (id: number, formData: FormData) => {
    const data = formFields.reduce((acc, field) => {
      let value = formData.get(field.name);

      if (field.type === "select" && value !== null) {
        value = value.toString();
      }

      // Jangan kirim katasandi jika kosong
      if (field.name === "katasandi" && (!value || value === "")) {
        return acc; // skip
      }

      // Format tanggal ke ISO jika ada
      if (field.name === "tanggalLahir" && value) {
        value = new Date(value.toString()).toISOString();
      }

      acc[field.name] = value === null || value === "" ? null : value;
      return acc;
    }, {} as Record<string, string | File | null>);

    try {
      const response = await axiosInstance.put(`/pengguna/update/${id}`, data);

      if (response.data) {
        setData((prev) =>
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
    const sorted = [...data].sort((a, b) =>
      newDirection === "asc"
        ? a.nama.localeCompare(b.nama)
        : b.nama.localeCompare(a.nama)
    );
    setData(sorted);
    setSortNamaDir(newDirection);
  };

  const handleSortNisn = () => {
    const newDirection = sortNisnDir === "asc" ? "desc" : "asc";
    const sorted = [...data].sort((a, b) => {
      const aNisn = parseInt(a.nisn || "0", 10);
      const bNisn = parseInt(b.nisn || "0", 10);
      return newDirection === "asc" ? aNisn - bNisn : bNisn - aNisn;
    });
    setData(sorted);
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

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <ButtonTambah formFields={formFields} onSubmit={handleAdd} />
            <ImportButtonExcel onUpload={handleUpload} />

            <ExportButtonExcel onClick={handleExportExcel} />
          </div>

          <div className="w-full md:w-1/3 md:text-right">
            <SearchInput value={searchTerm} onChange={setSearchTerm} />
          </div>
        </div>

        {loading ? (
          <p>Memuat data pengguna...</p>
        ) : (
          <Table>
            <TableCaption>Daftar pengguna yang terdaftar.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={handleSortNama}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Nama
                  {sortNamaDir === "asc" ? (
                    <FaSortAlphaDown style={{ marginLeft: 5 }} />
                  ) : (
                    <FaSortAlphaDownAlt style={{ marginLeft: 5 }} />
                  )}
                </TableHead>

                <TableHead>Email</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead
                  onClick={handleSortNisn}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  NISN
                  {sortNisnDir === "asc" ? (
                    <FaSortNumericDown style={{ marginLeft: 5 }} />
                  ) : (
                    <FaSortNumericDownAlt style={{ marginLeft: 5 }} />
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
              {data
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
      </div>
    </TooltipProvider>
  );
}
