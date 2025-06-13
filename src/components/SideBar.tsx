'use client';
import Link from "next/link";
import { Home, LineChart, Users } from "lucide-react";
import { usePathname } from 'next/navigation'


const Sidebar: React.FC = () => {
  const pathname = usePathname()
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="">IOT Irrigation</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === '/dashboard' ? 'bg-green-500' : 'text-muted-foreground'}`}>
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/live"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === '/dashboard/live' ? 'bg-green-500' : 'text-muted-foreground'}`}>
              <LineChart className="h-4 w-4" />
              Live Analytics
            </Link>
            <Link
              href="/dashboard/controller"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === '/dashboard/controller' ? 'bg-green-500' : 'text-muted-foreground'}`}>
              <Users className="h-4 w-4" />
              Controller
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
