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
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import EditButton from "@/components/Edit-Button";
import BtnTambahPengguna from "@/components/ButtonTambah";

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
  const [perusahaanData, setPerusahaanData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formFields, setFormFields] = useState<any[]>([]);

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
    perusahaanId: Number(data.get("perusahaanId")), // Kirim hanya ID
    expiredAt: data.get("expiredAt") as string,
    salary: data.get("salary") as string,
    linkPendaftaran: data.get("linkPendaftaran") as string,
    // Tidak perlu mengirim id dan dibuatPada
  };

  try {
    const response = await axiosInstance.put(`/lowongan/update/${id}`, updatedLowongan);

    if (response.status === 200) {
      Swal.fire("Berhasil", "Lowongan berhasil diperbarui.", "success");
      setLowonganData((prevData) =>
        prevData.map((lowongan) =>
          lowongan.id === id ? { ...lowongan, ...updatedLowongan } : lowongan
        )
      );
    } else {
      Swal.fire("Gagal", "Gagal memperbarui lowongan.", "error");
    }
  } catch (error) {
    Swal.fire("Gagal", "Terjadi kesalahan saat memperbarui lowongan.", "error");
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
    const response = await axiosInstance.post("/lowongan/create", newLowongan);
    const created = response.data?.data;

    if (created) {
      // Dapatkan nama perusahaan berdasarkan ID
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
    placeholder: "Masukkan jenis pekerjaan",
    required: true,
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

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <BtnTambahPengguna
              formFields={formFieldsLowongan}
              onSubmit={handleAdd}
            />
            <ImportButtonExcel onUpload={handleUpload} />
            <ExportButtonExcel onClick={handleExportExcel} />
          </div>
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
                .filter((item) =>
                  item.nama.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((item) => (
                  <TableRow key={item.id}>
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <AiOutlineEye className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Lihat</TooltipContent>
                      </Tooltip>
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
