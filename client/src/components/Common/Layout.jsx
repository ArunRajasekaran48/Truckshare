import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area shifted right on desktop */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header onMenuToggle={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">{children}</main>
      </div>
    </div>
  );
}
