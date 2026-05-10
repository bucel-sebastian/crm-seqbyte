import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class InvoiceSeriesService {
  async create(data: {
    companyId: string;
    prefix: string;
    startingNumber?: number;
    description?: string;
  }) {
    const existing = await prisma.invoiceSeries.findFirst({
      where: { companyId: data.companyId, prefix: data.prefix },
    });

    if (existing) {
      throw new Error("Invoice series with this prefix already exists for the company");
    }

    return prisma.invoiceSeries.create({
      data: {
        companyId: data.companyId,
        prefix: data.prefix,
        startingNumber: data.startingNumber ?? 1,
        currentNumber: data.startingNumber ?? 1,
        description: data.description,
      },
    });
  }

  async getById(id: string) {
    return prisma.invoiceSeries.findUnique({
      where: { id },
      include: {
        company: {
          select: { id: true, name: true, vat: true },
        },
        _count: {
          select: { invoices: true },
        },
      },
    });
  }

  async list(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const [series, total] = await Promise.all([
      prisma.invoiceSeries.findMany({
        skip,
        take: pageSize,
        include: {
          company: {
            select: { id: true, name: true, vat: true },
          },
          _count: {
            select: { invoices: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.invoiceSeries.count(),
    ]);

    return { data: series, total, page, pageSize };
  }

  async update(id: string, data: Partial<Prisma.InvoiceSeriesUpdateInput>) {
    return prisma.invoiceSeries.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.invoiceSeries.delete({ where: { id } });
  }
}

export const invoiceSeriesService = new InvoiceSeriesService();