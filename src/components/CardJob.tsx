"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CardJobProps {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  alamatPerusahaan?: string;
  company?: string;
  salary?: string;
  positionLevel?: string;
  categories?: string[];
  dibuatPada: string;
  expiredAt: string;
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
  dibuatPada,
  expiredAt,
  linkDaftar,
  alamatPerusahaan,
}: CardJobProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/Id/lowongan/${id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="w-full hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <CardHeader>
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </CardTitle>
            {company && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {company}
              </p>
            )}
            {alamatPerusahaan && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {alamatPerusahaan}
              </p>
            )}
          </div>

          {salary && (
            <Badge
              variant="outline"
              className="text-xs text-gray-700 dark:text-gray-300 capitalize"
            >
              {salary}
            </Badge>
          )}
        </div>

        {(categories?.length || positionLevel) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {categories?.map((category, i) => (
              <Badge
                key={i}
                variant="outline"
                className="text-xs text-gray-700 dark:text-gray-300 capitalize"
              >
                {category}
              </Badge>
            ))}

            {positionLevel && (
              <Badge
                variant="outline"
                className="text-xs text-blue-700 dark:text-blue-300"
              >
                {positionLevel}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {/* Deskripsi */}
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
            Deskripsi Pekerjaan:
          </h4>
          <ul className="list-disc list-inside space-y-1 marker:text-gray-500 dark:marker:text-gray-400">
            {description
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean)
              .slice(0, 3)
              .map((descItem, i) => (
                <li key={i} className="line-clamp-1">
                  {descItem}
                </li>
              ))}
          </ul>
        </div>

        {/* Persyaratan */}
        {requirements.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
              Ketentuan / Persyaratan:
            </h4>
            <ul className="list-disc list-inside space-y-1 marker:text-gray-500 dark:marker:text-gray-400">
              {requirements.slice(0, 3).map((req, i) => (
                <li key={i} className="line-clamp-1">
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Dibuat: {new Date(dibuatPada).toLocaleDateString("id-ID")} • Berlaku
          hingga {new Date(expiredAt).toLocaleDateString("id-ID")}
        </p>
      </CardFooter>
    </Card>
  );
};

export default CardJob;
