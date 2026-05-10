import { getSessionAction } from "@/server/actions/auth";
import { activityService } from "@/server/services/activity";
import { clientService } from "@/server/services/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSessionAction();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientService.getById(id);
  if (!client) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(client);
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

    const client = await clientService.getById(id);
    if (!client) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    await clientService.delete(id);

    await activityService.log({
      userId: session.user.userId,
      type: "CLIENT_ACTION",
      action: "Deleted client",
      details: { clientId: id, name: client.name },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/clients/[id] error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}