import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
  };
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-900 border">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
          {company.name}
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
          {company.description}
        </p>
      </CardHeader>

      <CardContent>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Lowongan Pekerjaan
        </h4>
        <ul className="list-disc list-inside space-y-2 max-h-36 overflow-y-auto pr-2 text-sm text-gray-700 dark:text-gray-300">
          {company.jobs.map((job, index) => (
            <li key={index}>
              <strong>{job.title}</strong>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Lokasi: {job.location} | Tipe: {job.type}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Link href={`/Id/perusahaan/${company.id}`} passHref>
          <Button variant="default" size="lg" className="w-full">
            Lihat Perusahaan
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CompanyCard;
