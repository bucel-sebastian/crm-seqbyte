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

interface ClientItem {
  id: string;
  name: string;
  vat: string;
  country: string;
  city: string;
}

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const session = await getSessionAction();
        if (!session?.user) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/clients");
        if (!response.ok) throw new Error("Failed to load clients");

        const data = await response.json();
        setClients(data.clients || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      const response = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      setClients((previous) => previous.filter((client) => client.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Client directory</p>
          <h1 className="text-3xl font-semibold tracking-tight">Clients</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">Manage client records, billing details, and contact information from one place.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{isLoading ? "..." : `${clients.length} records`}</Badge>
          <Button asChild>
          <Link href="/dashboard/clients/new">
            <Plus className="h-4 w-4 mr-2" />
            New Client
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
      ) : clients.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No clients yet</CardTitle>
            <CardDescription>Create the first client to start building your CRM.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/clients/new">Create client</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {clients.map((client) => (
            <Card key={client.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{client.name}</h3>
                      <Badge variant="outline">VAT {client.vat}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{client.city}, {client.country}</p>
                    <p className="text-sm text-muted-foreground">Client ID: {client.id}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/clients/${client.id}`}>
                        <Edit2 className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(client.id)}>
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