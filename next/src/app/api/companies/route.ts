import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { companyService } from "@/server/services/company";
import { activityService } from "@/server/services/activity";
import { createCompanySchema } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const result = await companyService.listByOwner(session.user.id, page, pageSize);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("GET /api/companies error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const body = await request.json();
    const validation = createCompanySchema.safeParse(body);

    if (!validation.success) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          issues: validation.error.errors,
        }),
        { status: 400 }
      );
    }

    const company = await companyService.create({
      ...validation.data,
      ownerId: session.user.id,
    });

    // Log activity
    await activityService.log({
      userId: session.user.id,
      type: "COMPANY_ACTION",
      action: "Created company",
      details: { companyId: company.id, name: company.name },
    });

    return new Response(JSON.stringify(company), { status: 201 });
  } catch (error) {
    console.error("POST /api/companies error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
