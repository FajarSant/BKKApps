"use client";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  UserPlus2,
  Settings,
  LogOut,
  Building,
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
import axiosInstance from "@/lib/axios";

export const menuItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
    color: "#3B82F6",
  },
  {
    title: "Manajemen Perusahaan",
    url: "/admin/perusahaan",
    icon: Building,
    color: "#8B5CF6",
  },
  {
    title: "Manajemen Lowongan",
    url: "/admin/lowongan",
    icon: Briefcase,
    color: "#10B981",
  },
  {
    title: "Manajemen Pengguna",
    url: "/admin/pengguna",
    icon: UserPlus2,
    color: "#F59E0B",
  },
  {
    title: "Setting",
    url: "/admin/setting",
    icon: Settings,
    color: "#6366F1",
  },
  {
    title: "Logout",
    url: "/admin/logout",
    icon: LogOut,
    color: "#EF4444",
  },
];

interface Profile {
  nama: string;
  peran: string;
  alamat: string;
  telepon: string;
  jenisKelamin: string;
}

export function AppSidebar() {
  const pathname = usePathname();

  const [profile, setProfile] = useState<Profile>({
    nama: "",
    peran: "",
    alamat: "",
    telepon: "",
    jenisKelamin: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/auth/profile");
        setProfile({
          nama: response.data.nama || "Nama Tidak Tersedia",
          peran: response.data.peran || "Peran Tidak Tersedia",

          alamat: response.data.alamat || "Alamat Tidak Tersedia",
          telepon: response.data.telepon || "Telepon Tidak Tersedia",
          jenisKelamin:
            response.data.jenisKelamin || "Jenis Kelamin Tidak Tersedia",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col items-center py-8 px-4 mb-2 border-b-4">
            {/* Menampilkan foto profil */}
            <div className="h-20 w-20 overflow-hidden rounded-full">
              <Image
                src="/images/foto-saya.png"
                alt="Profile Photo"
                width={128}
                height={128}
                className="object-cover"
                priority
              />
            </div>

            {/* Menampilkan nama dan peran pengguna */}
            <h1 className="text-xl font-bold mt-4">{profile.nama}</h1>
            <p className="text-gray-500">{profile.peran}</p>
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
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
