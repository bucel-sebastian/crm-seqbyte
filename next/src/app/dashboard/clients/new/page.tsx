"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { createClientSchema } from "@/lib/validators";
import { useCompanyLookup } from "@/hooks/use-company-lookup";

export default function NewClientPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { loading: lookupLoading, error: lookupError, data: lookupData, lookupByVat, reset: resetLookup } = useCompanyLookup();
  const [formData, setFormData] = useState({
    name: "",
    vat: "",
    registrationNumber: "",
    country: "",
    county: "",
    city: "",
    address: "",
    bankName: "",
    bankIban: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const validation = createClientSchema.safeParse(formData);
      if (!validation.success) {
        setError(validation.error.errors[0].message);
        return;
      }

      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Nu s-a putut crea clientul");
      }

      router.push("/dashboard/clients");
    } catch (err) {
      setError(err instanceof Error ? err.message : "A aparut o eroare");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleLookup = async () => {
    setError(null);
    setSuccessMessage(null);
    resetLookup();

    if (!formData.vat.trim()) {
      setError("Te rugam sa introduci mai intai un CUI");
      return;
    }

    await lookupByVat(formData.vat);
  };

  const handleApplyLookupData = () => {
    if (lookupData) {
      setFormData((previous) => ({
        ...previous,
        name: lookupData.name || previous.name,
        registrationNumber: lookupData.registrationNumber || previous.registrationNumber,
        country: lookupData.country || previous.country,
        county: lookupData.county || previous.county,
        city: lookupData.city || previous.city,
        address: lookupData.address || previous.address,
        bankName: lookupData.bankName || previous.bankName,
        bankIban: lookupData.bankIban || previous.bankIban,
      }));

      setSuccessMessage("Datele clientului au fost completate automat din registrul ANAF");
      resetLookup();
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Inregistrare client</p>
        <h1 className="text-3xl font-semibold tracking-tight">Creeaza client</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Adauga un client nou cu detalii fiscale si bancare.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informatii client</CardTitle>
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

            {lookupError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{lookupError}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
              </Alert>
            )}

            {lookupData && !successMessage && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="space-y-2">
                  <p className="text-blue-900">Au fost gasite datele clientului. Apasa mai jos pentru completare automata.</p>
                  <Button type="button" variant="outline" size="sm" onClick={handleApplyLookupData} className="mt-2">
                    Aplica datele gasite
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nume client *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Nume client" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vat">VAT/CUI *</Label>
                <div className="flex gap-2">
                  <Input
                    id="vat"
                    name="vat"
                    value={formData.vat}
                    onChange={handleChange}
                    placeholder="12345678 sau RO12345678"
                    disabled={isLoading || lookupLoading}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLookup}
                    disabled={isLoading || lookupLoading || !formData.vat.trim()}
                    className="px-3"
                  >
                    {lookupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cauta"}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Nr. inregistrare *</Label>
                <Input id="registrationNumber" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="J40/123456" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Tara *</Label>
                <Input id="country" name="country" value={formData.country} onChange={handleChange} placeholder="Romania" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="county">Judet *</Label>
                <Input id="county" name="county" value={formData.county} onChange={handleChange} placeholder="Bucuresti" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Oras *</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Bucuresti" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Adresa</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Adresa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankName">Nume banca</Label>
                <Input id="bankName" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Nume banca" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankIban">IBAN</Label>
                <Input id="bankIban" name="bankIban" value={formData.bankIban} onChange={handleChange} placeholder="IBAN" />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Creeaza client
              </Button>
              <Button type="button" onClick={() => router.back()} variant="outline" disabled={isLoading}>
                Anuleaza
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}