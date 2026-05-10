import { getSessionAction } from "@/server/actions/auth";
import { activityService } from "@/server/services/activity";
import { clientService } from "@/server/services/client";
import { createClientSchema } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const session = await getSessionAction();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    const result = await clientService.list(page, pageSize);

    return Response.json({
      clients: result.data,
      pagination: { total: result.total, page: result.page, pageSize: result.pageSize },
    });
  } catch (error) {
    console.error("GET /api/clients error:", error);
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
    const validation = createClientSchema.safeParse(body);
    if (!validation.success) {
      return Response.json({ error: "Validation failed", issues: validation.error.errors }, { status: 400 });
    }

    const client = await clientService.create(validation.data);

    await activityService.log({
      userId: session.user.userId,
      type: "CLIENT_ACTION",
      action: "Created client",
      details: { clientId: client.id, name: client.name },
    });

    return Response.json(client, { status: 201 });
  } catch (error) {
    console.error("POST /api/clients error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return Response.json({ error: message }, { status: 500 });
  }
}