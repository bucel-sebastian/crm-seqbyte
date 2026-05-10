"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2 } from "lucide-react";
import { createInvoiceSeriesSchema } from "@/lib/validators";

interface CompanyOption {
  id: string;
  name: string;
}

export default function NewSeriesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [formData, setFormData] = useState({ companyId: "", prefix: "", startingNumber: "1", description: "" });

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await fetch("/api/companies");
        const data = await response.json();
        setCompanies(data.companies || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nu s-a putut incarca lista de companii");
      } finally {
        setFormLoading(false);
      }
    };

    loadCompanies();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const validation = createInvoiceSeriesSchema.safeParse({
        companyId: formData.companyId,
        prefix: formData.prefix,
        startingNumber: Number(formData.startingNumber),
        description: formData.description || undefined,
      });

      if (!validation.success) {
        setError(validation.error.errors[0].message);
        return;
      }

      const response = await fetch("/api/series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Nu s-a putut crea seria");
      }

      router.push("/dashboard/finances/series");
    } catch (err) {
      setError(err instanceof Error ? err.message : "A aparut o eroare");
    } finally {
      setIsLoading(false);
    }
  };

  if (formLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Configurare serie</p>
        <h1 className="text-3xl font-semibold tracking-tight">Creeaza serie</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Adauga o serie noua de numerotare si conecteaz-o la o companie.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informatii serie</CardTitle>
          <CardDescription>Completeaza datele de mai jos.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Companie *</Label>
                <Select value={formData.companyId} onValueChange={(value) => setFormData((previous) => ({ ...previous, companyId: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecteaza compania" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prefix">Prefix *</Label>
                <Input id="prefix" name="prefix" value={formData.prefix} onChange={(e) => setFormData((previous) => ({ ...previous, prefix: e.target.value }))} placeholder="INV" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startingNumber">Numar initial *</Label>
                <Input id="startingNumber" name="startingNumber" type="number" min="1" value={formData.startingNumber} onChange={(e) => setFormData((previous) => ({ ...previous, startingNumber: e.target.value }))} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descriere</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={(e) => setFormData((previous) => ({ ...previous, description: e.target.value }))} placeholder="Descriere optionala" />
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Creeaza serie</Button>
              <Button type="button" onClick={() => router.back()} variant="outline" disabled={isLoading}>Anuleaza</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}