"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react";
import { getSessionAction } from "@/server/actions/auth";

interface Company {
  id: string;
  name: string;
  vat: string;
  country: string;
  city: string;
  createdAt: string;
}

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const session = await getSessionAction();
        if (!session?.user) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/companies");
        if (!response.ok) throw new Error("Failed to load companies");

        const data = await response.json();
        setCompanies(data.companies || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanies();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      const response = await fetch(`/api/companies/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      setCompanies((previous) => previous.filter((company) => company.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Company registry</p>
          <h1 className="text-3xl font-semibold tracking-tight">Companies</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">Keep legal entities, billing information, and contact details organized.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{isLoading ? "..." : `${companies.length} records`}</Badge>
          <Button asChild>
          <Link href="/dashboard/companies/new">
            <Plus className="h-4 w-4 mr-2" />
            New Company
          </Link>
          </Button>
        </div>
      </section>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-2/3 rounded bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-10 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : companies.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No companies yet</CardTitle>
            <CardDescription>Add the first billing entity to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/companies/new">Create company</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {companies.map((company) => (
            <Card key={company.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{company.name}</h3>
                      <Badge variant="outline">VAT {company.vat}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{company.city}, {company.country}</p>
                    <p className="text-sm text-muted-foreground">Registered: {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : "n/a"}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/companies/${company.id}`}>
                        <Edit2 className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(company.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
