import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-screen p-4 overflow-hide transition-all duration-300 ease-in-out">
      <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}