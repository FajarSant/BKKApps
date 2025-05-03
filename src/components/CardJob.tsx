import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaBookmark } from "react-icons/fa"; // Ikon Simpan

interface CardJobProps {
  title: string;
  description: string;
  requirements: string[];
  company?: string;
  salary?: string;
  positionLevel?: string;
  categories?: string[];
}

const CardJob = ({
  title,
  description,
  requirements,
  company,
  salary,
  positionLevel,
  categories,
}: CardJobProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md relative">
      {/* Ikon Simpan menggunakan Button */}
      <div className="absolute right-4 top-4">
        <Button variant="link" className="p-0" aria-label="Simpan Pekerjaan">
          <FaBookmark className="w-5 h-5 text-gray-700" />
        </Button>
      </div>

      {/* Badge Gaji */}
      {salary && (
        <div className="absolute right-4 top-16">
          <Badge variant="secondary">{salary}</Badge>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {company && <p className="text-sm text-muted-foreground">{company}</p>}
        {/* Badge Posisi */}
        {positionLevel && (
          <div className="mt-2">
            <Badge variant="outline" className="text-gray-700">
              {positionLevel}
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-sm text-gray-700 mb-1">Deskripsi Pekerjaan:</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>

        <div>
          <h4 className="font-medium text-sm text-gray-700 mb-1">Ketentuan / Persyaratan:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>
        
        {/* Menampilkan kategori pekerjaan (misalnya Frontend, Backend) */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category, idx) => (
              <Badge key={idx} variant="outline" className="text-gray-700">
                {category}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button variant="default" className="ml-auto">Lihat Detail</Button>
      </CardFooter>
    </Card>
  );
};

export default CardJob;
