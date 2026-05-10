"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react";

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
        const response = await fetch("/api/companies");
        if (!response.ok) throw new Error("Nu s-a putut incarca lista de companii");

        const data = await response.json();
        setCompanies(data.companies || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "A aparut o eroare");
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanies();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Esti sigur?")) return;

    try {
      const response = await fetch(`/api/companies/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Nu s-a putut sterge inregistrarea");
      setCompanies((previous) => previous.filter((company) => company.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Stergerea a esuat");
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Registru companii</p>
          <h1 className="text-3xl font-semibold tracking-tight">Companii</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">Pastreaza organizate entitatile juridice, datele de facturare si detaliile de contact.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{isLoading ? "..." : `${companies.length} inregistrari`}</Badge>
          <Button asChild>
          <Link href="/dashboard/companies/new">
            <Plus className="h-4 w-4 mr-2" />
            Companie noua
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
            <CardTitle>Nu exista companii inca</CardTitle>
            <CardDescription>Adauga prima entitate de facturare pentru a incepe.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/companies/new">Creeaza companie</Link>
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
                      <Badge variant="outline">CUI {company.vat}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{company.city}, {company.country}</p>
                    <p className="text-sm text-muted-foreground">Inregistrata: {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : "n/a"}</p>
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
