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
    return Response.json({ error: "Neautorizat" }, { status: 401 });
  }

  const client = await clientService.getById(id);
  if (!client) {
    return Response.json({ error: "Nu a fost gasit" }, { status: 404 });
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
      return Response.json({ error: "Neautorizat" }, { status: 401 });
    }

    const client = await clientService.getById(id);
    if (!client) {
      return Response.json({ error: "Nu a fost gasit" }, { status: 404 });
    }

    await clientService.delete(id);

    await activityService.log({
      userId: session.user.id,
      type: "CLIENT_ACTION",
      action: "Client sters",
      details: { clientId: id, name: client.name },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/clients/[id] error:", error);
    return Response.json({ error: "Eroare interna de server" }, { status: 500 });
  }
}