"use client"
import React, { useState } from "react";
import SearchInput from "@/components/SearchInput";
import CardJob from "@/components/CardJob";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu"; // Impor komponen dropdown dari shadcn

const page = () => {
  const [category, setCategory] = useState<string>("");

  const handleCategoryChange = (category: string) => {
    setCategory(category);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Cari Pekerjaan Impian Anda</h1>
        <p className="text-lg text-gray-600 mt-2">
          Temukan lowongan pekerjaan terbaik yang sesuai dengan minat dan keahlian Anda.
        </p>
      </header>

      {/* Search Input */}
      <div className="max-w-2xl mx-auto mb-12">
        <SearchInput />
      </div>

      {/* Kategori Pekerjaan */}
      <div className="max-w-2xl mx-auto mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Pilih Kategori Pekerjaan</h2>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {/* Kategori Utama - 4 tombol */}
          <Button variant="outline" className="w-full" onClick={() => handleCategoryChange("Web Developer")}>
            Web Developer
          </Button>
          <Button variant="outline" className="w-full" onClick={() => handleCategoryChange("Design")}>
            Design
          </Button>
          <Button variant="outline" className="w-full" onClick={() => handleCategoryChange("Marketing")}>
            Marketing
          </Button>
          <Button variant="outline" className="w-full" onClick={() => handleCategoryChange("Data Science")}>
            Data Science
          </Button>
        </div>

        {/* Tombol Dropdown untuk kategori "Other" */}
        <div className="w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                {category || "Kategori Lainnya"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={() => handleCategoryChange("Other")}>Other</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Daftar Pekerjaan */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Lowongan Pekerjaan Terbaru</h2>
        <div className="space-y-6">
          {/* Card Pekerjaan Contoh */}
          <CardJob
            title="Frontend Developer"
            company="PT Teknologi Digital"
            description="Bertanggung jawab untuk pengembangan aplikasi frontend menggunakan React dan TypeScript."
            salary="Rp 6.000.000 - Rp 10.000.000"
            positionLevel="Mid"
            requirements={[
              "Pengalaman minimal 2 tahun di bidang terkait",
              "Menguasai React dan TypeScript",
              "Memiliki pengalaman dalam pengembangan REST API",
            ]}
          />

          <CardJob
            title="UI/UX Designer"
            company="PT Desain Kreatif"
            description="Mendesain antarmuka pengguna untuk platform web dan mobile."
            salary="Rp 8.000.000 - Rp 12.000.000"
            positionLevel="Senior"
            requirements={[
              "Pengalaman minimal 3 tahun",
              "Menguasai Figma dan Adobe XD",
              "Paham tentang prinsip desain UX modern",
            ]}
          />

          <CardJob
            title="Backend Developer"
            company="PT Aplikasi Cerdas"
            description="Membangun dan memelihara API dan sistem backend menggunakan Node.js dan MongoDB."
            salary="Rp 7.000.000 - Rp 11.000.000"
            positionLevel="Junior"
            requirements={[
              "Pengalaman dengan Node.js dan Express.js",
              "Memahami database MongoDB",
              "Bersedia bekerja dengan tim",
            ]}
          />
        </div>
      </section>
    </main>
  );
};

export default page;
