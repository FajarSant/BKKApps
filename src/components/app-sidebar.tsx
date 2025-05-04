"use client";

import {
  Home,
  User,
  FileBadge,
  Code2,
  Mail,
  BookText,
  BadgeCheck,
  Github,
  Linkedin,
  Briefcase,
  UserPlus2,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export const menuItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
    color: "#3B82F6", 
  },
  {
    title: "Manajemen Lowongan",
    url: "/admin/lowongan",
    icon: Briefcase,
    color: "#10B981", // hijau (Tailwind green-500)
  },
  {
    title: "Manajemen Pengguna",
    url: "/admin/pengguna",
    icon: UserPlus2,
    color: "#F59E0B", // kuning (Tailwind amber-500)
  },
  {
    title: "Setting",
    url: "/admin/setting",
    icon: Settings,
    color: "#6366F1", // indigo
  },
  {
    title: "Tombol Logout",
    url: "/admin/logout",
    icon: LogOut,
    color: "#EF4444", // merah (Tailwind red-500)
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col items-center py-8 px-4 mb-2 border-b-4">
            <div className="h-20 w-20 overflow-hidden rounded-full">
              <Image
                src="/images/foto-saya.png"
                alt="Profile Photo"
                width={128}
                height={128}
                className="object-cover"
                priority
                loading="eager"
              />
            </div>

            <h1 className="text-xl font-bold mt-4">Fajar Santoso</h1>
            <p className="text-gray-500">Web Developer</p>
          </SidebarGroupContent>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={clsx(
                          "flex items-center gap-3 px-4 py-5 transition-colors rounded-md",
                          {
                            "bg-gray-700 text-white font-semibold": isActive,
                            "hover:bg-gray-600 hover:text-white": !isActive,
                          }
                        )}
                      >
                        <item.icon
                          className="w-6 h-6"
                          color={isActive ? "#ffffff" : item.color}

                        />
                        <span className="text-lg">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>

          {/* Social Links */}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
