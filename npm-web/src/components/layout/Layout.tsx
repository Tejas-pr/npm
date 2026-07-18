import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Toaster } from "../ui/sonner";

export function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground dark">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
