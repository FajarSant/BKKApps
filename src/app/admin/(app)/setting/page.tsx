"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import Swal from "sweetalert2";

interface Pengguna {
  id: number;
  nama: string;
  email: string;
  peran: string;
  nisn: string;
}

interface Perusahaan {
  id: number;
  nama: string;
  email: string;
  alamat: string;
  telepon?: string;
  deskripsi?: string;
}

interface Lowongan {
  id: number;
  nama: string;
  ketentuan: string;
  persyaratan: string;
  salary?: string;
  jenisPekerjaan: string;
}

type ViewType = "pengguna" | "perusahaan" | "lowongan";

export default function SettingsPage() {
  const [view, setView] = useState<ViewType>("pengguna");
  const [pengguna, setPengguna] = useState<Pengguna[]>([]);
  const [perusahaan, setPerusahaan] = useState<Perusahaan[]>([]);
  const [lowongan, setLowongan] = useState<Lowongan[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resPengguna, resPerusahaan, resLowongan] = await Promise.all([
          axiosInstance.get("/pengguna/getall"),
          axiosInstance.get("/perusahaan/getall"),
          axiosInstance.get("/lowongan/getall"),
        ]);
        setPengguna(Array.isArray(resPengguna.data) ? resPengguna.data : []);
        setPerusahaan(
          Array.isArray(resPerusahaan.data)
            ? resPerusahaan.data
            : resPerusahaan.data?.data || []
        );
        setLowongan(
          Array.isArray(resLowongan.data)
            ? resLowongan.data
            : resLowongan.data?.data || []
        );
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    };
    fetchData();
  }, []);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      let endpoint = "";
      if (view === "pengguna") endpoint = `/pengguna/delete/${id}`;
      if (view === "perusahaan") endpoint = `/perusahaan/delete/${id}`;
      if (view === "lowongan") endpoint = `/lowongan/delete/${id}`;

      await axiosInstance.delete(endpoint);

      if (view === "pengguna")
        setPengguna((prev) => prev.filter((item) => item.id !== id));
      if (view === "perusahaan")
        setPerusahaan((prev) => prev.filter((item) => item.id !== id));
      if (view === "lowongan")
        setLowongan((prev) => prev.filter((item) => item.id !== id));

      setSelectedIds((prev) => prev.filter((i) => i !== id));

      Swal.fire("Berhasil!", "Data telah dihapus.", "success");
    } catch (error) {
      console.error("Gagal menghapus:", error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus.", "error");
    }
  };

  const handleBulkDelete = async () => {
    const result = await Swal.fire({
      title: "Hapus semua yang dipilih?",
      text: `Kamu akan menghapus ${selectedIds.length} data.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus semua!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await Promise.all(
        selectedIds.map(async (id) => {
          let endpoint = "";
          if (view === "pengguna") endpoint = `/pengguna/delete/${id}`;
          if (view === "perusahaan") endpoint = `/perusahaan/delete/${id}`;
          if (view === "lowongan") endpoint = `/lowongan/delete/${id}`;
          await axiosInstance.delete(endpoint);
        })
      );

      if (view === "pengguna")
        setPengguna((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id))
        );
      if (view === "perusahaan")
        setPerusahaan((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id))
        );
      if (view === "lowongan")
        setLowongan((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id))
        );

      setSelectedIds([]);

      Swal.fire("Berhasil!", "Semua data telah dihapus.", "success");
    } catch (error) {
      console.error("Gagal menghapus data terpilih:", error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
    }
  };

  const dataList =
    view === "pengguna"
      ? pengguna
      : view === "perusahaan"
      ? perusahaan
      : lowongan;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Halaman Pengaturan</h1>

      <div className="flex gap-4 mb-6">
        <Button
          variant={view === "pengguna" ? "default" : "outline"}
          onClick={() => {
            setView("pengguna");
            setSelectedIds([]);
          }}
        >
          Pengguna
        </Button>
        <Button
          variant={view === "perusahaan" ? "default" : "outline"}
          onClick={() => {
            setView("perusahaan");
            setSelectedIds([]);
          }}
        >
          Perusahaan
        </Button>
        <Button
          variant={view === "lowongan" ? "default" : "outline"}
          onClick={() => {
            setView("lowongan");
            setSelectedIds([]);
          }}
        >
          Lowongan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {view === "pengguna" && "Daftar Pengguna"}
            {view === "perusahaan" && "Daftar Perusahaan"}
            {view === "lowongan" && "Daftar Lowongan"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedIds.length > 0 && (
            <Button
              onClick={handleBulkDelete}
              variant="destructive"
              className="mb-4"
            >
              Hapus Terpilih ({selectedIds.length})
            </Button>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      const ids = dataList.map((d) => d.id);
                      setSelectedIds(e.target.checked ? ids : []);
                    }}
                    checked={
                      selectedIds.length === dataList.length &&
                      dataList.length > 0
                    }
                  />
                </TableHead>
                {view === "pengguna" && (
                  <>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Peran</TableHead>
                    <TableHead>Aksi</TableHead>
                  </>
                )}
                {view === "perusahaan" && (
                  <>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Aksi</TableHead>
                  </>
                )}
                {view === "lowongan" && (
                  <>
                    <TableHead>Nama</TableHead>
                    <TableHead>Ketentuan</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Aksi</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </TableCell>
                  {view === "pengguna" && (
                    <>
                      <TableCell>{(item as Pengguna).nama}</TableCell>
                      <TableCell>{(item as Pengguna).email}</TableCell>
                      <TableCell>{(item as Pengguna).peran}</TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            <AiOutlineDelete
                              onClick={() => handleDelete(item.id)}
                              className="cursor-pointer text-red-500"
                            />
                          </TooltipTrigger>
                          <TooltipContent>Hapus</TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </>
                  )}
                  {view === "perusahaan" && (
                    <>
                      <TableCell>{(item as Perusahaan).nama}</TableCell>
                      <TableCell>{(item as Perusahaan).email}</TableCell>
                      <TableCell>{(item as Perusahaan).alamat}</TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            <AiOutlineDelete
                              onClick={() => handleDelete(item.id)}
                              className="cursor-pointer text-red-500"
                            />
                          </TooltipTrigger>
                          <TooltipContent>Hapus</TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </>
                  )}
                  {view === "lowongan" && (
                    <>
                      <TableCell>{(item as Lowongan).nama}</TableCell>
                      <TableCell>{(item as Lowongan).ketentuan}</TableCell>
                      <TableCell>{(item as Lowongan).jenisPekerjaan}</TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            <AiOutlineDelete
                              onClick={() => handleDelete(item.id)}
                              className="cursor-pointer text-red-500"
                            />
                          </TooltipTrigger>
                          <TooltipContent>Hapus</TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
