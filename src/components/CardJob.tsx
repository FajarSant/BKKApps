"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaBookmark } from "react-icons/fa";

interface CardJobProps {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  company?: string;
  salary?: string;
  positionLevel?: string;
  categories?: string[];
  linkPendaftaran?: string;
  linkDaftar?: string;
}

const CardJob = ({
  id,
  title,
  description,
  requirements,
  company,
  salary,
  positionLevel,
  categories,
}: CardJobProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/Id/lowongan/${id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="relative w-full shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-900 border cursor-pointer"
    >
      {/* Tombol Simpan */}
      <div
        className="absolute right-4 top-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FaBookmark className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Button>
      </div>

      {/* Badge Gaji */}
      {salary && (
        <div className="absolute right-4 top-14 z-10">
          <Badge
            variant="secondary"
            className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-semibold"
          >
            {salary}
          </Badge>
        </div>
      )}

      <CardHeader className="pb-2 space-y-1">
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </CardTitle>

        {company && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{company}</p>
        )}

        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((category, i) => (
              <Badge
                key={i}
                variant="outline"
                className="text-gray-700 dark:text-gray-300 capitalize"
              >
                {category}
              </Badge>
            ))}
          </div>
        )}

        {positionLevel && (
          <Badge
            variant="outline"
            className="text-sm font-medium mt-2 text-gray-700 dark:text-gray-300"
          >
            {positionLevel}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-200">
            Deskripsi Pekerjaan:
          </h4>
          <p>{description}</p>
        </div>

        {requirements.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">
              Ketentuan / Persyaratan:
            </h4>
            <ul className="list-disc list-inside space-y-1 marker:text-gray-500 dark:marker:text-gray-400">
              {requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CardJob;
