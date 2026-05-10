import { getSessionAction } from "@/server/actions/auth";

/**
 * Fetch company data from ANAF service by VAT/CUI
 * GET /api/companies/lookup?vat=RO12345678
 */
export async function GET(request: Request) {
  try {
    const session = await getSessionAction();
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { searchParams } = new URL(request.url);
    const vat = searchParams.get("vat");

    if (!vat) {
      return new Response(
        JSON.stringify({ error: "VAT parameter is required" }),
        { status: 400 }
      );
    }

    // Validate VAT format (should be like ROxxxxxx or similar)
    if (!vat.match(/^[A-Z]{2}[0-9]{1,30}$/)) {
      return new Response(
        JSON.stringify({ error: "Invalid VAT format" }),
        { status: 400 }
      );
    }

    const openApiUrl = process.env.OPENAPI_URL;
    const openApiKey = process.env.OPENAPI_KEY;

    if (!openApiUrl || !openApiKey) {
      console.error("OPENAPI_URL or OPENAPI_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable" }),
        { status: 503 }
      );
    }

    const response = await fetch(`${openApiUrl}/api/companies/${vat}`, {
      headers: {
        "x-api-key": openApiKey,
      },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      if (errorBody?.error) {
        return new Response(
          JSON.stringify({ error: "VAT code is invalid or not found" }),
          { status: 404 }
        );
      }
      throw new Error(`OpenAPI returned ${response.status}`);
    }

    const companyData = await response.json();

    // Map ANAF response to our company schema
    const mappedData = {
      name: companyData.name || companyData.denumire || "",
      vat: vat,
      registrationNumber: companyData.registrationNumber || companyData.nrInmatriculare || "",
      country: companyData.country || "RO",
      county: companyData.county || companyData.judet || "",
      city: companyData.city || companyData.oras || "",
      address: companyData.address || companyData.adresa || "",
      bankName: companyData.bankName || companyData.banca || "",
      bankIban: companyData.bankIban || companyData.iban || "",
      establishmentDate: companyData.establishmentDate || null,
    };

    return new Response(JSON.stringify({ success: true, data: mappedData }), {
      status: 200,
    });
  } catch (error) {
    console.error("GET /api/companies/lookup error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
