"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { getSessionAction } from "@/server/actions/auth";

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
        const session = await getSessionAction();
        if (!session?.user) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/series");
        if (!response.ok) throw new Error("Failed to load series");

        const data = await response.json();
        setSeries(data.series || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    loadSeries();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      const response = await fetch(`/api/series/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      setSeries((previous) => previous.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Numbering setup</p>
          <h1 className="text-3xl font-semibold tracking-tight">Invoice Series</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">Manage invoice numbering prefixes and keep sequential counters under control.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{isLoading ? "..." : `${series.length} series`}</Badge>
          <Button asChild>
            <Link href="/dashboard/finances/series/new">
              <Plus className="h-4 w-4 mr-2" />
            New Series
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
            <CardTitle>No series yet</CardTitle>
            <CardDescription>Create the first numbering series for your invoices.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/finances/series/new">Create series</Link>
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
                    <p className="text-sm text-muted-foreground">{item.company?.name ?? "No company assigned"}</p>
                    <p className="text-sm text-muted-foreground">Next invoice number: {item.prefix}{String(item.currentNumber).padStart(4, "0")}</p>
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