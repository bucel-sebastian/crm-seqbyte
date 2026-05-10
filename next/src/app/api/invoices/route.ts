import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSessionAction } from "@/server/actions/auth";
import { activityService } from "@/server/services/activity";
import { companyService } from "@/server/services/company";
import { clientService } from "@/server/services/client";
import { invoiceService } from "@/server/services/invoice";
import { createInvoiceSchema } from "@/lib/validators";

function calculateTotals(products: Array<{ name: string; quantity: number; unitPrice: number }>, vatRate: number) {
  const totalWithoutVat = products.reduce((sum, product) => sum + product.quantity * product.unitPrice, 0);
  const vatValue = totalWithoutVat * (vatRate / 100);
  return {
    totalWithoutVat: new Prisma.Decimal(totalWithoutVat.toFixed(2)),
    vatValue: new Prisma.Decimal(vatValue.toFixed(2)),
    total: new Prisma.Decimal((totalWithoutVat + vatValue).toFixed(2)),
  };
}

export async function GET(request: Request) {
  try {
    const session = await getSessionAction();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    const result = await invoiceService.list(page, pageSize);

    return Response.json({
      invoices: result.data,
      pagination: { total: result.total, page: result.page, pageSize: result.pageSize },
    });
  } catch (error) {
    console.error("GET /api/invoices error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionAction();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = createInvoiceSchema.safeParse({
      ...body,
      dateOfIssue: new Date(body.dateOfIssue),
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      vatRate: Number(body.vatRate ?? 0),
      exchangeRate: body.exchangeRate !== undefined && body.exchangeRate !== "" ? Number(body.exchangeRate) : undefined,
      products: Array.isArray(body.products) ? body.products : JSON.parse(body.products),
    });

    if (!validation.success) {
      return Response.json({ error: "Validation failed", issues: validation.error.errors }, { status: 400 });
    }

    const company = await companyService.getById(validation.data.companyId);
    if (!company || company.ownerId !== session.user.userId) {
      return Response.json({ error: "Company not found" }, { status: 404 });
    }

    const client = await clientService.getById(validation.data.clientId);
    if (!client) {
      return Response.json({ error: "Client not found" }, { status: 404 });
    }

    const series = await prisma.invoiceSeries.findUnique({ where: { id: validation.data.seriesId } });
    if (!series || series.companyId !== validation.data.companyId) {
      return Response.json({ error: "Invoice series not found" }, { status: 404 });
    }

    const invoiceNumber = validation.data.invoiceNumber || String(series.currentNumber);
    const totals = calculateTotals(validation.data.products, validation.data.vatRate);

    const invoice = await invoiceService.create({
      companyId: validation.data.companyId,
      clientId: validation.data.clientId,
      seriesId: validation.data.seriesId,
      invoiceNumber,
      dateOfIssue: validation.data.dateOfIssue,
      dueDate: validation.data.dueDate,
      currency: validation.data.currency,
      vatRate: validation.data.vatRate,
      exchangeRate: validation.data.exchangeRate,
      products: validation.data.products,
      ...totals,
      status: "draft",
    });

    await activityService.log({
      userId: session.user.userId,
      type: "INVOICE_ACTION",
      action: "Created invoice",
      details: { invoiceId: invoice.id, invoiceNumber: invoice.invoiceNumber },
    });

    return Response.json(invoice, { status: 201 });
  } catch (error) {
    console.error("POST /api/invoices error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return Response.json({ error: message }, { status: 500 });
  }
}