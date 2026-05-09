import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class CompanyService {
  async create(data: {
    name: string;
    vat: string;
    registrationNumber: string;
    country: string;
    county: string;
    city: string;
    address?: string;
    bankName?: string;
    bankIban?: string;
    establishmentDate?: Date;
    ownerId: string;
  }) {
    // Check if company with same VAT already exists
    const existing = await prisma.company.findUnique({
      where: { vat: data.vat },
    });

    if (existing) {
      throw new Error("Company with this VAT already exists");
    }

    return prisma.company.create({
      data,
    });
  }

  async getById(id: string) {
    return prisma.company.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        invoiceSeries: true,
      },
    });
  }

  async listByOwner(ownerId: string, page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where: { ownerId },
        skip,
        take: pageSize,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: { invoices: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.company.count({
        where: { ownerId },
      }),
    ]);

    return {
      data: companies,
      total,
      page,
      pageSize,
    };
  }

  async update(
    id: string,
    data: Partial<Omit<Prisma.CompanyUpdateInput, "owner">>
  ) {
    return prisma.company.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.company.delete({
      where: { id },
    });
  }
}

export const companyService = new CompanyService();
