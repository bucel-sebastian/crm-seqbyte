import { getSessionAction } from "@/server/actions/auth";
import { activityService } from "@/server/services/activity";
import { invoiceSeriesService } from "@/server/services/invoice-series";
import { createInvoiceSeriesSchema } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const session = await getSessionAction();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    const result = await invoiceSeriesService.list(page, pageSize);

    return Response.json({
      series: result.data,
      pagination: { total: result.total, page: result.page, pageSize: result.pageSize },
    });
  } catch (error) {
    console.error("GET /api/series error:", error);
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
    const validation = createInvoiceSeriesSchema.safeParse({
      ...body,
      startingNumber: Number(body.startingNumber),
    });

    if (!validation.success) {
      return Response.json({ error: "Validation failed", issues: validation.error.errors }, { status: 400 });
    }

    const series = await invoiceSeriesService.create(validation.data);

    await activityService.log({
      userId: session.user.userId,
      type: "SERIES_ACTION",
      action: "Created invoice series",
      details: { seriesId: series.id, prefix: series.prefix },
    });

    return Response.json(series, { status: 201 });
  } catch (error) {
    console.error("POST /api/series error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return Response.json({ error: message }, { status: 500 });
  }
}