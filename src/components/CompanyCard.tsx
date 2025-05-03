import React from "react";
import { Button } from "@/components/ui/button";

// Mendefinisikan tipe data untuk lowongan pekerjaan
interface Job {
  title: string;
  location: string;
  type: string;
}

interface CompanyCardProps {
  company: {
    name: string;
    description: string;
    jobs: Job[];
    imageUrl: string; // Properti untuk URL gambar perusahaan
  };
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className="shadow-lg border rounded-lg overflow-hidden mb-4">
      <div className="p-6">
        {/* Gambar Perusahaan */}
        <div className="mb-4">
          <img
            src={company.imageUrl}
            alt={company.name}
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>

        {/* Nama Perusahaan */}
        <h3 className="font-semibold text-2xl text-gray-800">{company.name}</h3>
        
        {/* Deskripsi Perusahaan */}
        <p className="text-sm text-gray-600 mt-2">{company.description}</p>
        
        {/* Daftar Lowongan */}
        <div className="mt-4">
          <h4 className="font-semibold text-xl text-gray-800">Lowongan Pekerjaan:</h4>
          <ul className="mt-2">
            {company.jobs.map((job, index) => (
              <li key={index} className="text-sm text-gray-700 mt-2">
                <strong>{job.title}</strong>
                <div className="text-gray-500">
                  Lokasi: {job.location} | Tipe: {job.type}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Tombol Lihat Lowongan */}
        <div className="mt-6">
          <Button size="lg" className="w-full" variant="default">
            Lihat Lowongan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
