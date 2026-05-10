import { companyService } from "@/server/services/company";
import { activityService } from "@/server/services/activity";
import { getSessionAction } from "@/server/actions/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSessionAction();
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const company = await companyService.getById(id);
    if (!company || company.ownerId !== session.user.userId) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    }

    await companyService.delete(id);

    // Log activity
    await activityService.log({
      userId: session.user.userId,
      type: "COMPANY_ACTION",
      action: "Deleted company",
      details: { companyId: id, name: company.name },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("DELETE /api/companies/[id] error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSessionAction();
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const company = await companyService.getById(id);
    if (!company || company.ownerId !== session.user.userId) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(company), { status: 200 });
  } catch (error) {
    console.error("GET /api/companies/[id] error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
