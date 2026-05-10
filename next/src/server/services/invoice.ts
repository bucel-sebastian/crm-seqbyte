import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class InvoiceService {
  async create(data: {
    companyId: string;
    clientId: string;
    seriesId: string;
    invoiceNumber: string;
    dateOfIssue: Date;
    dueDate?: Date;
    currency?: string;
    vatRate?: number;
    exchangeRate?: number;
    products: Prisma.InputJsonValue;
    totalWithoutVat: Prisma.Decimal;
    vatValue: Prisma.Decimal;
    total: Prisma.Decimal;
    status?: string;
  }) {
    const existing = await prisma.invoice.findUnique({
      where: {
        seriesId_invoiceNumber: {
          seriesId: data.seriesId,
          invoiceNumber: data.invoiceNumber,
        },
      },
    });

    if (existing) {
      throw new Error("Invoice number already exists for this series");
    }

    return prisma.$transaction(async (transaction) => {
      const invoice = await transaction.invoice.create({
        data: {
          companyId: data.companyId,
          clientId: data.clientId,
          seriesId: data.seriesId,
          invoiceNumber: data.invoiceNumber,
          dateOfIssue: data.dateOfIssue,
          dueDate: data.dueDate,
          currency: data.currency ?? "RON",
          vatRate: data.vatRate ?? 0,
          exchangeRate: data.exchangeRate,
          products: data.products,
          totalWithoutVat: data.totalWithoutVat,
          vatValue: data.vatValue,
          total: data.total,
          status: data.status ?? "draft",
        },
      });

      await transaction.invoiceSeries.update({
        where: { id: data.seriesId },
        data: {
          currentNumber: {
            increment: 1,
          },
        },
      });

      return invoice;
    });
  }

  async getById(id: string) {
    return prisma.invoice.findUnique({
      where: { id },
      include: {
        company: { select: { id: true, name: true, vat: true } },
        client: { select: { id: true, name: true, vat: true } },
        series: { select: { id: true, prefix: true, currentNumber: true } },
      },
    });
  }

  async list(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        skip,
        take: pageSize,
        include: {
          company: { select: { id: true, name: true, vat: true } },
          client: { select: { id: true, name: true, vat: true } },
          series: { select: { id: true, prefix: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.invoice.count(),
    ]);

    return { data: invoices, total, page, pageSize };
  }

  async delete(id: string) {
    return prisma.invoice.delete({ where: { id } });
  }
}

export const invoiceService = new InvoiceService();