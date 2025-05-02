"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ReactNode } from "react";
import clsx from "clsx";

interface NavLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
}

const NavLink = ({ href, icon, label }: NavLinkProps) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsActive(window.location.pathname === href);
    }
  }, [href]);

  return (
    <Link href={href}>
      <span
        className={clsx(
          "flex flex-col items-center transition rounded-2xl p-2 px-4",
          isActive ? "bg-red-600 text-white" : "text-white hover:text-red-600"
        )}
      >
        {icon}
      </span>
      <span className="flex flex-col text-xs mt-1 text-white text-center">
        {label}
      </span>
    </Link>
  );
};

export default NavLink;
