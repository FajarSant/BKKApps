// components/Layout.tsx

import BottomNav from "@/components/BottomNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden mb-20">
      <main className="flex-1  overflow-hidden transition-all duration-300 ease-in-out mb-10">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
