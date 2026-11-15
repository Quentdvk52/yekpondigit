import { NextResponse } from "next/server";
import { OrderRepository } from "@/server/repositories/order-repository";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await OrderRepository.findById(id);

  if (!order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  return NextResponse.json({
    id: order.id,
    number: order.number,
    status: order.status,
    isPaid: order.status === "paid",
    totalXof: order.total_xof,
    currency: order.currency,
    displayCurrency: order.display_currency,
    displayTotal: order.display_total,
    paidAt: order.paid_at,
  });
}
