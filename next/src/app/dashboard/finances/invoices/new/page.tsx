"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Plus, Trash2 } from "lucide-react";
import { createInvoiceSchema } from "@/lib/validators";
import { getSessionAction } from "@/server/actions/auth";

interface OptionItem {
  id: string;
  name?: string;
  prefix?: string;
}

interface InvoiceProductRow {
  name: string;
  description: string;
  unitOfMeasurement: string;
  quantity: string;
  unitPrice: string;
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const unitOfMeasurementOptions = [
  { value: "Oră", label: "Oră" },
  { value: "Zi", label: "Zi" },
  { value: "Lună", label: "Lună" },
  { value: "Serv", label: "Serviciu (Serv)" },
  { value: "Buc", label: "Bucată (Buc)" },
];

function parseDateInput(value: string) {
  const parsedDate = new Date(`${value}T12:00:00`);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function addDaysToDate(value: string, days: number) {
  const parsedDate = parseDateInput(value);
  if (!parsedDate || Number.isNaN(days)) {
    return "";
  }

  const nextDate = new Date(parsedDate);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate.toISOString().slice(0, 10);
}

function getDayDifference(startDate: string, endDate: string) {
  const parsedStartDate = parseDateInput(startDate);
  const parsedEndDate = parseDateInput(endDate);

  if (!parsedStartDate || !parsedEndDate) {
    return "";
  }

  return String(Math.round((parsedEndDate.getTime() - parsedStartDate.getTime()) / DAY_IN_MS));
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<OptionItem[]>([]);
  const [clients, setClients] = useState<OptionItem[]>([]);
  const [series, setSeries] = useState<OptionItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [formData, setFormData] = useState(() => {
    const dateOfIssue = new Date().toISOString().slice(0, 10);
    const paymentTermDays = "30";

    return {
      companyId: "",
      clientId: "",
      seriesId: "",
      invoiceNumber: "",
      dateOfIssue,
      paymentTermDays,
      dueDate: addDaysToDate(dateOfIssue, Number(paymentTermDays)),
      currency: "RON",
      vatRate: "19",
      exchangeRate: "",
      products: [
        {
          name: "Service",
          description: "",
          unitOfMeasurement: "Buc",
          quantity: "1",
          unitPrice: "100",
        },
      ] as InvoiceProductRow[],
    };
  });

  const addProductRow = () => {
    setFormData((previous) => ({
      ...previous,
      products: [
        ...previous.products,
        {
          name: "",
          description: "",
          unitOfMeasurement: "Buc",
          quantity: "1",
          unitPrice: "0",
        },
      ],
    }));
  };

  const updateProductRow = (index: number, field: keyof InvoiceProductRow, value: string) => {
    setFormData((previous) => ({
      ...previous,
      products: previous.products.map((product, productIndex) =>
        productIndex === index ? { ...product, [field]: value } : product
      ),
    }));
  };

  const updatePaymentTermDays = (value: string) => {
    setFormData((previous) => ({
      ...previous,
      paymentTermDays: value,
      dueDate: value === "" ? "" : addDaysToDate(previous.dateOfIssue, Number(value)),
    }));
  };

  const updateDueDate = (value: string) => {
    setFormData((previous) => ({
      ...previous,
      dueDate: value,
      paymentTermDays: value === "" ? "" : getDayDifference(previous.dateOfIssue, value),
    }));
  };

  const removeProductRow = (index: number) => {
    setFormData((previous) => ({
      ...previous,
      products: previous.products.length > 1 ? previous.products.filter((_, productIndex) => productIndex !== index) : previous.products,
    }));
  };

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const session = await getSessionAction();
        if (!session?.user) {
          router.push("/login");
          return;
        }

        const [companiesResponse, clientsResponse, seriesResponse] = await Promise.all([
          fetch("/api/companies"),
          fetch("/api/clients"),
          fetch("/api/series"),
        ]);

        const companiesData = await companiesResponse.json();
        const clientsData = await clientsResponse.json();
        const seriesData = await seriesResponse.json();

        setCompanies(companiesData.companies || []);
        setClients(clientsData.clients || []);
        setSeries(seriesData.series || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load form data");
      } finally {
        setFormLoading(false);
      }
    };

    loadOptions();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const validation = createInvoiceSchema.safeParse({
        companyId: formData.companyId,
        clientId: formData.clientId,
        seriesId: formData.seriesId,
        invoiceNumber: formData.invoiceNumber,
        dateOfIssue: new Date(formData.dateOfIssue),
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        currency: formData.currency,
        vatRate: Number(formData.vatRate),
        exchangeRate: formData.exchangeRate ? Number(formData.exchangeRate) : undefined,
        products: formData.products.map((product) => ({
          name: product.name.trim(),
          description: product.description.trim() || undefined,
          unitOfMeasurement: product.unitOfMeasurement.trim(),
          quantity: Number(product.quantity),
          unitPrice: Number(product.unitPrice),
        })),
      });

      if (!validation.success) {
        setError(validation.error.errors[0].message);
        return;
      }

      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create invoice");
      }

      router.push("/dashboard/finances/invoices");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (formLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const lineItemTotals = formData.products.map((product) => Number(product.quantity) * Number(product.unitPrice));
  const totalWithoutVat = lineItemTotals.reduce((sum, value) => sum + value, 0);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Invoice creation</p>
        <h1 className="text-3xl font-semibold tracking-tight">Create Invoice</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Add a new billing record with the company, client, series, and line items.</p>
      </div>

   
     
          <CardTitle>Invoice Information</CardTitle>
          <CardDescription>Fill in the details below.</CardDescription>
     
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Company *</Label>
                <Select value={formData.companyId} onValueChange={(value) => setFormData((previous) => ({ ...previous, companyId: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select company" />
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
              <div className="space-y-2 md:col-span-2">
                <Label>Client *</Label>
                <Select value={formData.clientId} onValueChange={(value) => setFormData((previous) => ({ ...previous, clientId: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Series *</Label>
                <Select value={formData.seriesId} onValueChange={(value) => setFormData((previous) => ({ ...previous, seriesId: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select series" />
                  </SelectTrigger>
                  <SelectContent>
                    {series.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name ?? item.prefix ?? item.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice number *</Label>
                <Input id="invoiceNumber" value={formData.invoiceNumber} onChange={(e) => setFormData((previous) => ({ ...previous, invoiceNumber: e.target.value }))} placeholder="Invoice number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfIssue">Date of issue *</Label>
                <Input
                  id="dateOfIssue"
                  type="date"
                  value={formData.dateOfIssue}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      dateOfIssue: event.target.value,
                      dueDate: previous.paymentTermDays === "" ? previous.dueDate : addDaysToDate(event.target.value, Number(previous.paymentTermDays)),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentTermDays">Termen de plată (zile)</Label>
                <Input
                  id="paymentTermDays"
                  type="number"
                  step="1"
                  value={formData.paymentTermDays}
                  onChange={(event) => updatePaymentTermDays(event.target.value)}
                  placeholder="30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Scadență</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(event) => updateDueDate(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency *</Label>
                <Input id="currency" value={formData.currency} onChange={(e) => setFormData((previous) => ({ ...previous, currency: e.target.value }))} placeholder="RON" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vatRate">VAT rate *</Label>
                <Input id="vatRate" type="number" min="0" max="100" value={formData.vatRate} onChange={(e) => setFormData((previous) => ({ ...previous, vatRate: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exchangeRate">Exchange rate</Label>
                <Input id="exchangeRate" type="number" step="0.000001" value={formData.exchangeRate} onChange={(e) => setFormData((previous) => ({ ...previous, exchangeRate: e.target.value }))} placeholder="Exchange rate" />
              </div>
              <div className="space-y-3 md:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <Label>Products *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addProductRow}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add row
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[72px]">nr. crt</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[180px]">Unit of measurement</TableHead>
                        <TableHead className="w-[140px]">Quantity</TableHead>
                        <TableHead className="w-[140px]">Unit price</TableHead>
                        <TableHead className="w-[160px]">Row total price</TableHead>
                        <TableHead className="w-[88px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.products.map((product, index) => {
                        const rowTotal = Number(product.quantity) * Number(product.unitPrice);

                        return (
                          <TableRow key={index}>
                            <TableCell className="align-top font-medium">{index + 1}</TableCell>
                            <TableCell className="align-top">
                              <Input
                                value={product.name}
                                onChange={(event) => updateProductRow(index, "name", event.target.value)}
                                placeholder="Product name"
                              />
                            </TableCell>
                            <TableCell className="align-top">
                              <Input
                                value={product.description}
                                onChange={(event) => updateProductRow(index, "description", event.target.value)}
                                placeholder="Description"
                              />
                            </TableCell>
                            <TableCell className="align-top">
                              <Select
                                value={product.unitOfMeasurement}
                                onValueChange={(value) => updateProductRow(index, "unitOfMeasurement", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  {unitOfMeasurementOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="align-top">
                              <Input
                                type="number"
                                value={product.quantity}
                                onChange={(event) => updateProductRow(index, "quantity", event.target.value)}
                                placeholder="0"
                              />
                            </TableCell>
                            <TableCell className="align-top">
                              <Input
                                type="number"
                                value={product.unitPrice}
                                onChange={(event) => updateProductRow(index, "unitPrice", event.target.value)}
                                placeholder="0"
                              />
                            </TableCell>
                            <TableCell className="align-top font-medium">
                              {rowTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="align-top text-right">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeProductRow(index)}
                                disabled={formData.products.length === 1}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove row</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Total without VAT</span>
                  <span className="font-medium text-foreground">
                    {totalWithoutVat.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create Invoice</Button>
              <Button type="button" onClick={() => router.back()} variant="outline" disabled={isLoading}>Cancel</Button>
            </div>
          </form>
     
                      
    </div>
  );
}