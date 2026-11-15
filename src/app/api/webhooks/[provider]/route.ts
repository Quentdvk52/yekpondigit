import { NextResponse } from "next/server";
import { PaymentRouter } from "@/server/payments/router";
import { OrderRepository } from "@/server/repositories/order-repository";
import { type PaymentProviderId } from "@/server/payments/types";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider: providerParam } = await params;
  const providerId = providerParam.toLowerCase() as PaymentProviderId;

  const provider = PaymentRouter.getProviderById(providerId);
  if (!provider) {
    return NextResponse.json(
      { error: `Fournisseur de paiement inconnu: ${providerParam}` },
      { status: 400 }
    );
  }

  // 1. Lecture du corps brut (crucial pour la vérification de signature HMAC)
  let rawBody = "";
  try {
    rawBody = await req.text();
  } catch (err) {
    return NextResponse.json(
      { error: "Impossible de lire le corps de la requête" },
      { status: 400 }
    );
  }

  // 2. Vérification cryptographique de la signature du webhook
  const verification = await provider.verifyWebhook(req, rawBody);
  if (!verification.valid || !verification.event) {
    console.warn(`[Webhook ${providerId}] Signature invalide ou rejetée: ${verification.error}`);
    return NextResponse.json(
      { error: verification.error || "Signature de webhook invalide" },
      { status: 401 }
    );
  }

  const event = verification.event;

  // 3. Contrôle d'idempotence strict (protection contre les doublons et les rejeux)
  const isDuplicate = await OrderRepository.isWebhookProcessed(providerId, event.eventId);
  if (isDuplicate) {
    return NextResponse.json(
      { received: true, message: "Événement déjà traité avec succès (idempotent)." },
      { status: 200 }
    );
  }

  // 4. Revérification du statut serveur-à-serveur (ne jamais faire confiance au seul webhook)
  try {
    const statusCheck = await provider.fetchStatus(event.providerRef);

    if (statusCheck.status !== "succeeded" && event.status !== "succeeded") {
      await OrderRepository.recordWebhookEvent(
        providerId,
        event.eventId,
        true,
        event.rawPayload,
        new Date(),
        `Statut non confirmé: ${statusCheck.status}`
      );
      return NextResponse.json({ received: true, status: statusCheck.status }, { status: 200 });
    }

    // 5. Recherche de la commande associée
    let order = null;
    if (event.orderId) {
      order = await OrderRepository.findById(event.orderId);
    }

    if (!order) {
      console.warn(`[Webhook ${providerId}] Commande introuvable pour orderId: ${event.orderId}`);
      await OrderRepository.recordWebhookEvent(
        providerId,
        event.eventId,
        true,
        event.rawPayload,
        new Date(),
        "Commande introuvable"
      );
      return NextResponse.json({ received: true, warning: "Commande introuvable" }, { status: 200 });
    }

    // 6. Validation de cohérence du montant (anti-altération de montant)
    if (event.amount > 0 && Math.abs(event.amount - order.total_xof) > 5) {
      console.error(
        `[Webhook ${providerId}] ALERTE FRAUDE : Montant payé (${event.amount}) différent du montant attendu (${order.total_xof}) pour la commande ${order.number}`
      );
      await OrderRepository.recordWebhookEvent(
        providerId,
        event.eventId,
        true,
        event.rawPayload,
        new Date(),
        `Montant discordance: payé=${event.amount}, attendu=${order.total_xof}`
      );
      return NextResponse.json(
        { error: "Montant de paiement non conforme aux données de la commande." },
        { status: 400 }
      );
    }

    // 7. Validation de la commande et génération des licences
    await OrderRepository.markAsPaid(order.id, event.providerRef);

    // 8. Enregistrement de l'événement webhook traité
    await OrderRepository.recordWebhookEvent(
      providerId,
      event.eventId,
      true,
      event.rawPayload,
      new Date()
    );

    return NextResponse.json({ received: true, orderId: order.id, status: "paid" }, { status: 200 });
  } catch (error) {
    console.error(`[Webhook ${providerId}] Erreur de traitement:`, error);
    await OrderRepository.recordWebhookEvent(
      providerId,
      event.eventId,
      true,
      event.rawPayload,
      null,
      (error as Error).message
    );
    return NextResponse.json(
      { error: "Erreur interne lors du traitement du webhook." },
      { status: 500 }
    );
  }
}
