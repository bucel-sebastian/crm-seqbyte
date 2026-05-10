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
    return Response.json({ error: "Neautorizat" }, { status: 401 });
  }

  const series = await invoiceSeriesService.getById(id);
  if (!series) {
    return Response.json({ error: "Nu a fost gasita" }, { status: 404 });
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
      return Response.json({ error: "Neautorizat" }, { status: 401 });
    }

    const series = await invoiceSeriesService.getById(id);
    if (!series) {
      return Response.json({ error: "Nu a fost gasita" }, { status: 404 });
    }

    await invoiceSeriesService.delete(id);

    await activityService.log({
      userId: session.user.id,
      type: "SERIES_ACTION",
      action: "Serie de facturi stearsa",
      details: { seriesId: id, prefix: series.prefix },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/series/[id] error:", error);
    return Response.json({ error: "Eroare interna de server" }, { status: 500 });
  }
}