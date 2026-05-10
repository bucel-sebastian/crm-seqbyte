"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { createCompanySchema } from "@/lib/validators";
import { useCompanyLookup } from "@/hooks/use-company-lookup";

export default function NewCompanyPage() {
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
      const validation = createCompanySchema.safeParse(formData);
      if (!validation.success) {
        setError(validation.error.errors[0].message);
        return;
      }

      const response = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create company");
      }

      router.push("/dashboard/companies");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLookup = async () => {
    setError(null);
    setSuccessMessage(null);
    resetLookup();
    
    if (!formData.vat.trim()) {
      setError("Please enter a VAT number first");
      return;
    }

    await lookupByVat(formData.vat);
  };

  const handleApplyLookupData = () => {
    if (lookupData) {
      setFormData((prev) => ({
        ...prev,
        name: lookupData.name || prev.name,
        registrationNumber: lookupData.registrationNumber || prev.registrationNumber,
        country: lookupData.country || prev.country,
        county: lookupData.county || prev.county,
        city: lookupData.city || prev.city,
        address: lookupData.address || prev.address,
        bankName: lookupData.bankName || prev.bankName,
        bankIban: lookupData.bankIban || prev.bankIban,
      }));
      setSuccessMessage("Company data auto-filled from ANAF registry");
      resetLookup();
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Company intake</p>
        <h1 className="text-3xl font-semibold tracking-tight">Create Company</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Add a new company and its billing profile to the account.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Fill in the details below.</CardDescription>
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
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input id="name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="ACME Corp" disabled={isLoading} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vat">VAT Number *</Label>
                <Input id="vat" type="text" name="vat" value={formData.vat} onChange={handleChange} placeholder="RO12345678" disabled={isLoading} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number *</Label>
                <Input id="registrationNumber" type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="J40/123456" disabled={isLoading} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input id="country" type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Romania" disabled={isLoading} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="county">County *</Label>
                <Input id="county" type="text" name="county" value={formData.county} onChange={handleChange} placeholder="Bucharest" disabled={isLoading} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Bucharest" disabled={isLoading} required />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St" disabled={isLoading} />
              </div> or use the ANAF lookup to auto-populate.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
              </Alert>
            )}

            {lookupError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{lookupError}</AlertDescription>
              </Alert>
            )}

            {lookupData && !successMessage && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="space-y-2">
                  <p className="text-blue-900">Company data found in ANAF registry. Click below to auto-fill the form.</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleApplyLookupData}
                    className="mt-2"
                  >
                    Apply Found Data
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input id="name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="ACME Corp" disabled={isLoading} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vat">VAT Number *</Label>
                <div className="flex gap-2">
                  <Input id="vat" type="text" name="vat" value={formData.vat} onChange={handleChange} placeholder="RO12345678" disabled={isLoading || lookupLoading} required />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLookup}
                    disabled={isLoading || lookupLoading || !formData.vat.trim()}
                    className="px-3"
                  >
                    {lookupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Lookup"}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number *</Label>
                <Input id="registrationNumber" type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="J40/123456" disabled={isLoading} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input id="country" type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Romania" disabled={isLoading} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="county">County *</Label>
                <Input id="county" type="text" name="county" value={formData.county} onChange={handleChange} placeholder="Bucharest" disabled={isLoading} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Bucharest" disabled={isLoading} required />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St" disabled={isLoading} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input id="bankName" type="text" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="BRD" disabled={isLoading} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankIban">Bank IBAN</Label>
                <Input id="bankIban" type="text" name="bankIban" value={formData.bankIban} onChange={handleChange} placeholder="RO12BRDE0001234567890000" disabled={isLoading} />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Company
              </Button>
              <Button type="button" onClick={() => router.back()} variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}