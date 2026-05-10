"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, AlertCircle } from "lucide-react";

interface SeriesItem {
  id: string;
  prefix: string;
  currentNumber: number;
  company?: { name: string };
}

export default function InvoiceSeriesPage() {
  const router = useRouter();
  const [series, setSeries] = useState<SeriesItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSeries = async () => {
      try {
        const response = await fetch("/api/series");
        if (!response.ok) throw new Error("Nu s-a putut incarca lista de serii");

        const data = await response.json();
        setSeries(data.series || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "A aparut o eroare");
      } finally {
        setIsLoading(false);
      }
    };

    loadSeries();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Esti sigur?")) return;

    try {
      const response = await fetch(`/api/series/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Nu s-a putut sterge inregistrarea");
      setSeries((previous) => previous.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Stergerea a esuat");
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Configurare numerotare</p>
          <h1 className="text-3xl font-semibold tracking-tight">Serii facturi</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">Gestioneaza prefixele seriilor de facturi si tine sub control contoarele secventiale.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{isLoading ? "..." : `${series.length} serii`}</Badge>
          <Button asChild>
            <Link href="/dashboard/finances/series/new">
              <Plus className="h-4 w-4 mr-2" />
            Serie noua
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
                <div className="h-5 w-1/3 rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-10 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : series.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nu exista serii inca</CardTitle>
            <CardDescription>Creeaza prima serie de numerotare pentru facturi.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/finances/series/new">Creeaza serie</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {series.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{item.prefix}</h3>
                      <Badge variant="outline">#{item.currentNumber}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.company?.name ?? "Nicio companie alocata"}</p>
                    <p className="text-sm text-muted-foreground">Urmatorul numar de factura: {item.prefix}{String(item.currentNumber).padStart(4, "0")}</p>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}