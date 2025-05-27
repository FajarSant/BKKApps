import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Job {
  title: string;
  location: string;
  type: string;
}

interface CompanyCardProps {
  company: {
    id: number;
    name: string;
    description: string;
    jobs: Job[];
    imageUrl: string;
  };
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className="rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden bg-white">
      {/* Gambar */}
      {/* <div className="relative h-48 w-full">
        <Image
          src={company.imageUrl}
          alt={company.name}
          layout="fill"
          objectFit="cover"
          priority
          className="rounded-t-lg"
        />
      </div> */}

      {/* Konten */}
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-gray-900">{company.name}</h3>
        <p className="text-gray-600 mt-2 text-sm leading-relaxed">
          {company.description}
        </p>

        {/* Lowongan */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Lowongan Pekerjaan
          </h4>
          <ul className="list-disc list-inside space-y-2 max-h-36 overflow-y-auto pr-2 text-gray-700 text-sm">
            {company.jobs.map((job, index) => (
              <li key={index}>
                <strong>{job.title}</strong>
                <div className="text-gray-500 text-xs">
                  Lokasi: {job.location} | Tipe: {job.type}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Tombol */}
        <div className="mt-6">
          <Link href={`/Id/perusahaan/${company.id}`} passHref>
            <Button variant="default" size="lg" className="w-full">
              Lihat Perusahaan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
