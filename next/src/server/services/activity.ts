import { prisma } from "@/lib/db";

export class ActivityService {
  async log(data: {
    userId: string;
    type: string;
    action: string;
    details?: any;
    metadata?: any;
  }) {
    return prisma.activityLog.create({
      data: {
        userId: data.userId,
        type: data.type,
        action: data.action,
        details: data.details,
        metadata: data.metadata,
      },
    });
  }

  async getByUser(userId: string, page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where: { userId },
        skip,
        take: pageSize,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.activityLog.count({
        where: { userId },
      }),
    ]);

    return {
      data: logs,
      total,
      page,
      pageSize,
    };
  }

  async getRecent(limit: number = 10) {
    return prisma.activityLog.findMany({
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const activityService = new ActivityService();
