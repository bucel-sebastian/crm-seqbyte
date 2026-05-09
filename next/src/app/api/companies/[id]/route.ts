import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { companyService } from "@/server/services/company";
import { activityService } from "@/server/services/activity";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const company = await companyService.getById(params.id);
    if (!company || company.ownerId !== session.user.id) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    }

    await companyService.delete(params.id);

    // Log activity
    await activityService.log({
      userId: session.user.id,
      type: "COMPANY_ACTION",
      action: "Deleted company",
      details: { companyId: params.id, name: company.name },
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const company = await companyService.getById(params.id);
    if (!company || company.ownerId !== session.user.id) {
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
