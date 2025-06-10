'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function BackButton() {
  const pathname = usePathname();
  const [backHref, setBackHref] = useState<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    if (pathname.startsWith("/admin")) {
      setBackHref("/admin/dashboard");
    } else {
      const match = pathname.match(/^\/([^\/]+)\//);
      if (match && match[1]) {
        setBackHref(`/${match[1]}`);
      } else {
        setBackHref("/Id");
      }
    }
  }, [pathname]);

  if (!backHref) return null;

  return (
    <Link
      href={backHref}
      className="inline-block mt-6 px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition"
    >
      Kembali ke Halaman Utama
    </Link>
  );
}
