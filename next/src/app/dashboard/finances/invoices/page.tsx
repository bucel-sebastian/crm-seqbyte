"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, AlertCircle, ArrowRightLeft } from "lucide-react";

interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  status: string;
  total: string;
  company?: { name: string };
  client?: { name: string };
}

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const response = await fetch("/api/invoices");
        if (!response.ok) throw new Error("Nu s-a putut incarca lista de facturi");

        const data = await response.json();
        setInvoices(data.invoices || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "A aparut o eroare");
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoices();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Esti sigur?")) return;

    try {
      const response = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Nu s-a putut sterge inregistrarea");
      setInvoices((previous) => previous.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Stergerea a esuat");
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Registru facturare</p>
          <h1 className="text-3xl font-semibold tracking-tight">Facturi</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">Gestioneaza facturile, statusul si relatia companie-client dintr-o singura vedere.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{isLoading ? "..." : `${invoices.length} facturi`}</Badge>
          <Button asChild>
            <Link href="/dashboard/finances/invoices/new">
              <Plus className="h-4 w-4 mr-2" />
            Factura noua
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
        <div className="grid gap-4">
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
      ) : invoices.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nu exista facturi inca</CardTitle>
            <CardDescription>Creeaza prima factura cand un client este pregatit pentru facturare.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/finances/invoices/new">Creeaza factura</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">Factura {invoice.invoiceNumber}</h3>
                      <Badge variant="outline">{invoice.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{invoice.company?.name} <ArrowRightLeft className="inline-block size-3.5 align-middle" /> {invoice.client?.name}</p>
                    <p className="text-sm text-muted-foreground">Total: {invoice.total}</p>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(invoice.id)}>
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