"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import clsx from "clsx";

interface NavLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
}

const NavLink = ({ href, icon, label }: NavLinkProps) => {
  const pathname = usePathname(); // Mendapatkan path saat ini
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <div
        className={clsx(
          "flex flex-col items-center rounded-2xl p-2 px-4 transition",
          isActive ? "bg-red-600 text-white" : "text-white hover:text-red-600"
        )}
      >
        {icon}
      </div>
      <span className="flex flex-col text-xs mt-1 text-white text-center">
        {label}
      </span>
    </Link>
  );
};

export default NavLink;
