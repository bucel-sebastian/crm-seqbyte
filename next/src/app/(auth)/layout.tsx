import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - CRM",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
