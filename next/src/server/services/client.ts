import { prisma } from "@/lib/db";

export class ClientService {
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
  }) {
    // Check if client with same VAT already exists
    const existing = await prisma.client.findUnique({
      where: { vat: data.vat },
    });

    if (existing) {
      throw new Error("Client with this VAT already exists");
    }

    return prisma.client.create({
      data,
    });
  }

  async getById(id: string) {
    return prisma.client.findUnique({
      where: { id },
      include: {
        _count: {
          select: { invoices: true },
        },
      },
    });
  }

  async list(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        skip,
        take: pageSize,
        include: {
          _count: {
            select: { invoices: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.client.count(),
    ]);

    return {
      data: clients,
      total,
      page,
      pageSize,
    };
  }

  async update(id: string, data: Partial<Omit<typeof prisma.client.create, "data">>) {
    return prisma.client.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.client.delete({
      where: { id },
    });
  }
}

export const clientService = new ClientService();
