import { getSessionAction } from "@/server/actions/auth";
import { activityService } from "@/server/services/activity";
import { invoiceService } from "@/server/services/invoice";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSessionAction();
  if (!session) {
    return Response.json({ error: "Neautorizat" }, { status: 401 });
  }

  const invoice = await invoiceService.getById(id);
  if (!invoice) {
    return Response.json({ error: "Nu a fost gasita" }, { status: 404 });
  }

  return Response.json(invoice);
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

    const invoice = await invoiceService.getById(id);
    if (!invoice) {
      return Response.json({ error: "Nu a fost gasita" }, { status: 404 });
    }

    await invoiceService.delete(id);

    await activityService.log({
      userId: session.user.id,
      type: "INVOICE_ACTION",
      action: "Factura stearsa",
      details: { invoiceId: id, invoiceNumber: invoice.invoiceNumber },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/invoices/[id] error:", error);
    return Response.json({ error: "Eroare interna de server" }, { status: 500 });
  }
}