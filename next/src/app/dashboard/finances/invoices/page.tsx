"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, AlertCircle, ArrowRightLeft } from "lucide-react";
import { getSessionAction } from "@/server/actions/auth";

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
        const session = await getSessionAction();
        if (!session?.user) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/invoices");
        if (!response.ok) throw new Error("Failed to load invoices");

        const data = await response.json();
        setInvoices(data.invoices || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoices();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      const response = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      setInvoices((previous) => previous.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Billing ledger</p>
          <h1 className="text-3xl font-semibold tracking-tight">Invoices</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">Manage invoice records, status, and customer handoff from a single view.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{isLoading ? "..." : `${invoices.length} invoices`}</Badge>
          <Button asChild>
            <Link href="/dashboard/finances/invoices/new">
              <Plus className="h-4 w-4 mr-2" />
            New Invoice
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
            <CardTitle>No invoices yet</CardTitle>
            <CardDescription>Create the first invoice when a client is ready to be billed.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/finances/invoices/new">Create invoice</Link>
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
                      <h3 className="text-lg font-semibold">Invoice {invoice.invoiceNumber}</h3>
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