"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { signOutAction } from "@/server/actions/auth";
import { useState } from "react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOutAction();
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-2xl">
          CRM
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/dashboard/companies" className="hover:text-blue-400">
            Companies
          </Link>
          <Link href="/dashboard/clients" className="hover:text-blue-400">
            Clients
          </Link>
          <Link href="/dashboard/series" className="hover:text-blue-400">
            Series
          </Link>
          <Link href="/dashboard/invoices" className="hover:text-blue-400">
            Invoices
          </Link>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="text-red-400 border-red-400 hover:bg-red-400/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-slate-700 rounded"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-700 p-4 space-y-2">
          <Link
            href="/dashboard/companies"
            className="block py-2 hover:text-blue-400"
          >
            Companies
          </Link>
          <Link href="/dashboard/clients" className="block py-2 hover:text-blue-400">
            Clients
          </Link>
          <Link href="/dashboard/series" className="block py-2 hover:text-blue-400">
            Series
          </Link>
          <Link href="/dashboard/invoices" className="block py-2 hover:text-blue-400">
            Invoices
          </Link>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full text-red-400 border-red-400 hover:bg-red-400/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      )}
    </nav>
  );
}
