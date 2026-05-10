import { getSessionAction } from "@/server/actions/auth";
import { activityService } from "@/server/services/activity";
import { invoiceSeriesService } from "@/server/services/invoice-series";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSessionAction();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const series = await invoiceSeriesService.getById(id);
  if (!series) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(series);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSessionAction();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const series = await invoiceSeriesService.getById(id);
    if (!series) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    await invoiceSeriesService.delete(id);

    await activityService.log({
      userId: session.user.userId,
      type: "SERIES_ACTION",
      action: "Deleted invoice series",
      details: { seriesId: id, prefix: series.prefix },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/series/[id] error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}