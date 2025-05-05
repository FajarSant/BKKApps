"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import ExportButtonExcel from "@/components/Export-Button-Excel";
import ImportButtonExcel from "@/components/Import-Button-Excel";
import SearchInput from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Pengguna {
  id: number;
  nama: string;
  email: string;
  status?: string;
  nisn: string;
  alamat?: string;
  telepon?: string;
  tanggalLahir?: string;
  jenisKelamin?: "Laki-laki" | "Perempuan";
  peran: "Siswa" | "Alumni" | "Administrator";
}

interface RoleCounts {
  admin: number;
  siswa: number;
  alumni: number;
}

export default function DashboardPage() {
  const [users, setUsers] = useState<Pengguna[]>([]);
  const [roleCounts, setRoleCounts] = useState<RoleCounts>({
    admin: 0,
    siswa: 0,
    alumni: 0,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/pengguna");
        const fetchedUsers: Pengguna[] = response.data.data || response.data;
        setUsers(fetchedUsers);
        countRoles(fetchedUsers);
      } catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
      }
    };

    const countRoles = (userList: Pengguna[]) => {
      const counts: RoleCounts = { admin: 0, siswa: 0, alumni: 0 };
      userList.forEach((user) => {
        if (user.peran === "Administrator") counts.admin += 1;
        else if (user.peran === "Siswa") counts.siswa += 1;
        else if (user.peran === "Alumni") counts.alumni += 1;
      });
      setRoleCounts(counts);
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6 space-y-10">
      {/* Statistik Jumlah Pengguna */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              Jumlah Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {roleCounts.admin}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              Jumlah Siswa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {roleCounts.siswa}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              Jumlah Alumni
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">
              {roleCounts.alumni}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Tabel Pengguna */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          {/* Tombol di kiri */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button variant="default" size="sm">
              <Plus className="w-4 h-4" /> Tambah Pengguna
            </Button>
            <ImportButtonExcel />
            <ExportButtonExcel />
            
          </div>

          {/* Search di kanan */}
          <div className="w-full md:w-1/3 md:text-right">
            <SearchInput  />
          </div>
        </div>

        <Table>
          <TableCaption>Data pengguna terdaftar</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>NISN</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead>Tanggal Lahir</TableHead>
              <TableHead>Jenis Kelamin</TableHead>
              <TableHead>Peran</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.nama}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.status ?? "-"}</TableCell>
                <TableCell>{user.nisn}</TableCell>
                <TableCell>{user.alamat ?? "-"}</TableCell>
                <TableCell>{user.telepon ?? "-"}</TableCell>
                <TableCell>
                  {user.tanggalLahir
                    ? new Date(user.tanggalLahir).toLocaleDateString("id-ID")
                    : "-"}
                </TableCell>
                <TableCell>{user.jenisKelamin ?? "-"}</TableCell>
                <TableCell>{user.peran}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-800"
                    aria-label="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
