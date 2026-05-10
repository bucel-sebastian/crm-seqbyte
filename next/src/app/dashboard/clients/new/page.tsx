"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { createClientSchema } from "@/lib/validators";

export default function NewClientPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
        throw new Error(data.error || "Failed to create client");
      }

      router.push("/dashboard/clients");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Client intake</p>
        <h1 className="text-3xl font-semibold tracking-tight">Create Client</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Add a new client record with fiscal and banking details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
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
                <Label htmlFor="name">Client name *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Client name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vat">VAT *</Label>
                <Input id="vat" name="vat" value={formData.vat} onChange={handleChange} placeholder="RO12345678" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration number *</Label>
                <Input id="registrationNumber" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="J40/123456" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input id="country" name="country" value={formData.country} onChange={handleChange} placeholder="Romania" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="county">County *</Label>
                <Input id="county" name="county" value={formData.county} onChange={handleChange} placeholder="Bucharest" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Bucharest" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank name</Label>
                <Input id="bankName" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Bank name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankIban">IBAN</Label>
                <Input id="bankIban" name="bankIban" value={formData.bankIban} onChange={handleChange} placeholder="IBAN" />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Client
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