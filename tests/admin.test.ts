import { describe, it, expect } from "vitest";
import { AdminRepository } from "@/server/repositories/admin-repository";
import { AuditLogger } from "@/server/audit/audit-logger";
import { isAdminRole, isStaffRole } from "@/server/auth/rbac";

describe("Phase 7 — Back-Office Administrateur Exhaustif", () => {
  it("valide les rôles RBAC pour l'accès aux interfaces d'administration", () => {
    expect(isAdminRole("super_admin")).toBe(true);
    expect(isAdminRole("admin")).toBe(true);
    expect(isAdminRole("customer")).toBe(false);
    expect(isAdminRole("vendor")).toBe(false);

    expect(isStaffRole("support")).toBe(true);
    expect(isStaffRole("editor")).toBe(true);
    expect(isStaffRole("customer")).toBe(false);
  });

  it("calcule avec exactitude les KPI du tableau de bord", async () => {
    const kpi = await AdminRepository.getDashboardKPI();

    expect(kpi.totalRevenueXof).toBeGreaterThan(0);
    expect(kpi.paidOrdersCount).toBeGreaterThan(0);
    expect(kpi.conversionRate).toBeGreaterThan(0);
    expect(kpi.gatewayStats.length).toBeGreaterThanOrEqual(3);
    expect(kpi.salesTrend.length).toBe(7);
  });

  it("filtre les commandes administratives par statut et par mot-clé", async () => {
    const all = await AdminRepository.listOrders();
    expect(all.length).toBeGreaterThan(0);

    const paidOnly = await AdminRepository.listOrders({ status: "paid" });
    expect(paidOnly.every((o) => o.status === "paid")).toBe(true);

    const searched = await AdminRepository.listOrders({ query: "mensah" });
    expect(searched.length).toBeGreaterThan(0);
    expect(searched[0]?.email).toContain("mensah");
  });

  it("exécute un remboursement de commande avec révocation automatique de licence et audit log", async () => {
    // 1. Commande initiale
    const orders = await AdminRepository.listOrders({ status: "paid" });
    const targetOrder = orders[0]!;
    const licenseKey = targetOrder.licenseKeys[0]!;

    // 2. Remboursement
    const res = await AdminRepository.refundOrder({
      orderId: targetOrder.id,
      reason: "Incompatibilité infrastructure client",
      refundType: "full",
      adminUserId: "00000000-0000-0000-0000-000000000001",
    });

    expect(res.success).toBe(true);
    expect(res.order.status).toBe("refunded");

    // 3. Vérification de la révocation de la licence
    const licenses = await AdminRepository.listLicenses({ query: licenseKey });
    const license = licenses.find((l) => l.key === licenseKey);
    expect(license).toBeDefined();
    expect(license?.status).toBe("revoked");
    expect(license?.revokedReason).toContain("Incompatibilité infrastructure client");

    // 4. Vérification de la journalisation d'audit
    const logs = await AuditLogger.list(10);
    const refundLog = logs.find((l) => l.action === "order.refund" && l.entity_id === targetOrder.id);
    expect(refundLog).toBeDefined();
    expect(refundLog?.diff).toBeDefined();
  });

  it("met à jour le statut d'une licence et réinitialise ses domaines autorisés", async () => {
    const licenses = await AdminRepository.listLicenses();
    const target = licenses[0]!;

    // Reset des domaines
    const afterReset = await AdminRepository.resetLicenseDomains({
      licenseId: target.id,
      adminUserId: "00000000-0000-0000-0000-000000000001",
    });
    expect(afterReset.domains).toEqual([]);

    // Mise à jour de statut
    const afterStatus = await AdminRepository.updateLicenseStatus({
      licenseId: target.id,
      status: "active",
      adminUserId: "00000000-0000-0000-0000-000000000001",
    });
    expect(afterStatus.status).toBe("active");
  });

  it("bloque et débloque un utilisateur avec traçabilité d'audit", async () => {
    const customers = await AdminRepository.listCustomers();
    const target = customers[0]!;

    // Bloquer
    const blocked = await AdminRepository.toggleCustomerBlock({
      userId: target.id,
      isBlocked: true,
      adminUserId: "00000000-0000-0000-0000-000000000001",
    });
    expect(blocked.isBlocked).toBe(true);

    // Débloquer
    const unblocked = await AdminRepository.toggleCustomerBlock({
      userId: target.id,
      isBlocked: false,
      adminUserId: "00000000-0000-0000-0000-000000000001",
    });
    expect(unblocked.isBlocked).toBe(false);
  });

  it("fait avancer une demande de projet sur mesure dans les étapes du Kanban", async () => {
    const quotes = await AdminRepository.listCustomQuotes();
    const target = quotes[0]!;

    const updated = await AdminRepository.updateQuoteStatus({
      quoteId: target.id,
      status: "in_progress",
      adminUserId: "00000000-0000-0000-0000-000000000001",
    });

    expect(updated.status).toBe("in_progress");
  });

  it("enregistre et restitue les entrées immuables du journal d'audit", async () => {
    const newLog = await AuditLogger.log({
      action: "security.test_event",
      entity: "system",
      entityId: "sys_test",
      diff: { level: "high", checked: true },
      ipHash: "ip_hash_abc123",
    });

    expect(newLog.id).toBeDefined();
    expect(newLog.action).toBe("security.test_event");

    const recentLogs = await AuditLogger.list(20);
    const found = recentLogs.find((l) => l.action === "security.test_event");
    expect(found).toBeDefined();
  });
});
