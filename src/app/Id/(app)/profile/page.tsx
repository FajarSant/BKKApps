"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function ProfilePage() {
  return (
    <div className="p-6 space-y-6">
      <Card className="text-center shadow-md">
        <CardContent className="pt-6 pb-8">
          <div className="mx-auto mb-4 w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-500">
            <Image
              src="/profile.jpg"
              alt="Foto Profil"
              width={112} 
              height={112}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-semibold">John Doe</h2>
          <p className="text-sm text-muted-foreground">
            Aktif - Mahasiswa Teknik
          </p>
        </CardContent>
      </Card>

      <Separator />

      <div className="space-y-6">
        <Link href="/profile/edit">
          <Button
            className="w-full justify-start text-base px-6  mb-4 py-3"
            variant="outline"
          >
            ✏️ Edit Profil
          </Button>
        </Link>
        <Link href="/profile/ganti-kata-sandi">
          <Button
            className="w-full justify-start text-base px-6  mb-4 py-3"
            variant="outline"
          >
            🔒 Ganti Kata Sandi
          </Button>
        </Link>
        <Link href="/profile/buat-cv">
          <Button
            className="w-full justify-start text-base px-6  mb-4 py-3"
            variant="outline"
          >
            📄 Buat CV
          </Button>
        </Link>
        <Link href="/logout">
          <Button
            className="w-full justify-start text-base px-6  mb-4 py-3"
            variant="destructive"
          >
            🚪 Logout
          </Button>
        </Link>
      </div>
    </div>
  );
}
