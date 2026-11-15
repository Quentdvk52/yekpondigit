import "server-only";
import { query } from "@/server/db";
import { AuditLogger } from "@/server/audit/audit-logger";

export interface AdminDashboardKPI {
  totalRevenueXof: number;
  monthlyRevenueXof: number;
  totalOrders: number;
  paidOrdersCount: number;
  conversionRate: number; // ex: 3.4%
  averageCartXof: number;
  totalRefundsXof: number;
  refundsCount: number;
  gatewayStats: {
    provider: string;
    label: string;
    count: number;
    amountXof: number;
    percentage: number;
  }[];
  recentOrders: AdminOrderSummary[];
  salesTrend: { label: string; amountXof: number }[];
}

export interface AdminOrderSummary {
  id: string;
  number: string;
  email: string;
  customerName?: string;
  status: "pending" | "awaiting_payment" | "paid" | "fulfilled" | "failed" | "cancelled" | "refunded";
  totalXof: number;
  currency: string;
  paymentMethod: string;
  provider: string;
  itemsCount: number;
  createdAt: string;
  paidAt?: string;
  licenseKeys: string[];
}

export interface AdminLicenseItem {
  id: string;
  key: string;
  productTitle: string;
  productSlug: string;
  buyerEmail: string;
  licenseCode: string;
  status: "active" | "revoked" | "expired";
  domains: string[];
  maxDomains: number;
  issuedAt: string;
  revokedAt?: string;
  revokedReason?: string;
}

export interface AdminCustomerItem {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  role: string;
  isBlocked: boolean;
  ordersCount: number;
  totalSpentXof: number;
  createdAt: string;
}

export interface AdminCustomQuote {
  id: string;
  reference: string;
  clientName: string;
  clientEmail: string;
  projectType: string;
  title: string;
  description: string;
  budgetEstimatedXof: number;
  deliveryWeeks: number;
  status: "new" | "qualified" | "quoted" | "in_progress" | "delivered";
  createdAt: string;
}

// Données statiques pour le fallback hors-ligne
const MOCK_ADMIN_ORDERS: AdminOrderSummary[] = [
  {
    id: "ord_1001",
    number: "YD-2026-001042",
    email: "mensah.koffi@gmail.com",
    customerName: "Koffi Mensah",
    status: "paid",
    totalXof: 125000,
    currency: "XOF",
    paymentMethod: "MTN Mobile Money",
    provider: "fedapay",
    itemsCount: 1,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    paidAt: new Date(Date.now() - 3600000 * 24 * 2 + 180000).toISOString(),
    licenseKeys: ["YD26-LIVE-9X82-K7M4"],
  },
  {
    id: "ord_1002",
    number: "YD-2026-001089",
    email: "adeline.sossou@techbj.com",
    customerName: "Adeline Sossou",
    status: "paid",
    totalXof: 290000,
    currency: "XOF",
    paymentMethod: "Carte Bancaire Visa",
    provider: "stripe",
    itemsCount: 1,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    paidAt: new Date(Date.now() - 3600000 * 24 + 120000).toISOString(),
    licenseKeys: ["YD26-SAAS-4F29-P1X8"],
  },
  {
    id: "ord_1003",
    number: "YD-2026-001105",
    email: "jean.dupont@orange.fr",
    customerName: "Jean Dupont",
    status: "paid",
    totalXof: 95000,
    currency: "EUR",
    paymentMethod: "Carte Bancaire Mastercard",
    provider: "stripe",
    itemsCount: 1,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    paidAt: new Date(Date.now() - 3600000 * 5 + 45000).toISOString(),
    licenseKeys: ["YD26-PLUG-3H88-Q9Z2"],
  },
  {
    id: "ord_1004",
    number: "YD-2026-001112",
    email: "test.local@sandbox.dev",
    customerName: "Test Sandboxeur",
    status: "pending",
    totalXof: 45000,
    currency: "XOF",
    paymentMethod: "Moov Money",
    provider: "kkiapay",
    itemsCount: 1,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    licenseKeys: [],
  },
];

const MOCK_ADMIN_LICENSES: AdminLicenseItem[] = [
  {
    id: "lic_01",
    key: "YD26-LIVE-9X82-K7M4",
    productTitle: "YekponStore — E-Commerce Multivendeur Clé en Main",
    productSlug: "yekponstore-ecommerce-multivendeur",
    buyerEmail: "mensah.koffi@gmail.com",
    licenseCode: "standard",
    status: "active",
    domains: ["maboutique.bj"],
    maxDomains: 1,
    issuedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: "lic_02",
    key: "YD26-SAAS-4F29-P1X8",
    productTitle: "SchoolDesk — SaaS Gestion Scolaire & Universitaire",
    productSlug: "schooldesk-saas-gestion-scolaire",
    buyerEmail: "adeline.sossou@techbj.com",
    licenseCode: "extended",
    status: "active",
    domains: ["moncampus.edu.bj", "campus-calavi.bj"],
    maxDomains: 3,
    issuedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "lic_03",
    key: "YD26-PLUG-3H88-Q9Z2",
    productTitle: "YekponPay — Passerelle Mobile Money Afrique de l'Ouest",
    productSlug: "yekponpay-passerelle-mobile-money",
    buyerEmail: "jean.dupont@orange.fr",
    licenseCode: "standard",
    status: "active",
    domains: ["boutique-paris.fr"],
    maxDomains: 1,
    issuedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

const MOCK_ADMIN_CUSTOMERS: AdminCustomerItem[] = [
  {
    id: "usr_01",
    fullName: "Koffi Mensah",
    email: "mensah.koffi@gmail.com",
    phone: "+229 97 00 00 01",
    country: "Bénin (BJ)",
    role: "customer",
    isBlocked: false,
    ordersCount: 1,
    totalSpentXof: 125000,
    createdAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
  },
  {
    id: "usr_02",
    fullName: "Adeline Sossou",
    email: "adeline.sossou@techbj.com",
    phone: "+229 95 12 34 56",
    country: "Bénin (BJ)",
    role: "customer",
    isBlocked: false,
    ordersCount: 1,
    totalSpentXof: 290000,
    createdAt: new Date(Date.now() - 3600000 * 24 * 15).toISOString(),
  },
  {
    id: "usr_03",
    fullName: "Jean Dupont",
    email: "jean.dupont@orange.fr",
    phone: "+33 6 12 34 56 78",
    country: "France (FR)",
    role: "customer",
    isBlocked: false,
    ordersCount: 1,
    totalSpentXof: 95000,
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
  },
];

const MOCK_CUSTOM_QUOTES: AdminCustomQuote[] = [
  {
    id: "qt_01",
    reference: "DEV-2026-0042",
    clientName: "Cabinet Juridique Avocat-Plus",
    clientEmail: "contact@avocat-plus.bj",
    projectType: "Plateforme Web & E-Signature",
    title: "Portail de gestion de dossiers juridiques et signature d'actes",
    description: "Développement d'un intranet sécurisé avec authentification forte et horodatage certifié.",
    budgetEstimatedXof: 1850000,
    deliveryWeeks: 4,
    status: "new",
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: "qt_02",
    reference: "DEV-2026-0039",
    clientName: "Pharmacie de la Paix",
    clientEmail: "direction@pharma-paix.ci",
    projectType: "Application Mobile Flutter",
    title: "App mobile de commande d'ordonnances et livraisons express",
    description: "Scan d'ordonnance par caméra, géolocalisation et paiement MoMo MTN/Orange.",
    budgetEstimatedXof: 2400000,
    deliveryWeeks: 6,
    status: "qualified",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: "qt_03",
    reference: "DEV-2026-0035",
    clientName: "Microfinance Cotonou Pro",
    clientEmail: "dti@cotonou-pro.bj",
    projectType: "SaaS & Core Banking Léger",
    title: "Module d'octroi de micro-crédits et notifications WhatsApp",
    description: "Scoring de crédit automatique et intégration API FedaPay pour déboursement instantané.",
    budgetEstimatedXof: 3600000,
    deliveryWeeks: 8,
    status: "quoted",
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    id: "qt_04",
    reference: "DEV-2026-0028",
    clientName: "AgroLogix Bénin",
    clientEmail: "supply@agrologix.bj",
    projectType: "Plateforme Web & Tracking IoT",
    title: "Tableau de bord de traçabilité des récoltes de cajou",
    description: "Système de pesée connectée et export douanier automatique.",
    budgetEstimatedXof: 2900000,
    deliveryWeeks: 5,
    status: "in_progress",
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
  },
  {
    id: "qt_05",
    reference: "DEV-2026-0019",
    clientName: "Hôtel Marina Palace",
    clientEmail: "reservation@marinapalace.com",
    projectType: "Site Web & Booking Moteur",
    title: "Refonte du site hôtelier avec moteur de réservation direct",
    description: "Synchronisation iCal avec Booking.com et paiement CB/MoMo.",
    budgetEstimatedXof: 1500000,
    deliveryWeeks: 3,
    status: "delivered",
    createdAt: new Date(Date.now() - 3600000 * 300).toISOString(),
  },
];

export class AdminRepository {
  /**
   * Calcule l'ensemble des KPI pour le tableau de bord
   */
  static async getDashboardKPI(): Promise<AdminDashboardKPI> {
    const paidOrders = MOCK_ADMIN_ORDERS.filter((o) => o.status === "paid");
    const totalRev = paidOrders.reduce((sum, o) => sum + o.totalXof, 0);

    return {
      totalRevenueXof: totalRev,
      monthlyRevenueXof: Math.round(totalRev * 0.75),
      totalOrders: MOCK_ADMIN_ORDERS.length,
      paidOrdersCount: paidOrders.length,
      conversionRate: 4.8,
      averageCartXof: paidOrders.length > 0 ? Math.round(totalRev / paidOrders.length) : 0,
      totalRefundsXof: 0,
      refundsCount: 0,
      gatewayStats: [
        { provider: "fedapay", label: "FedaPay (MoMo MTN/Moov)", count: 1, amountXof: 125000, percentage: 24 },
        { provider: "stripe", label: "Stripe (Cartes CB/Visa/MC)", count: 2, amountXof: 385000, percentage: 76 },
        { provider: "kkiapay", label: "KKiaPay (Celtiis/MoMo)", count: 0, amountXof: 0, percentage: 0 },
        { provider: "sandbox", label: "Simulateur Sandbox", count: 0, amountXof: 0, percentage: 0 },
      ],
      recentOrders: MOCK_ADMIN_ORDERS,
      salesTrend: [
        { label: "Lun", amountXof: 125000 },
        { label: "Mar", amountXof: 85000 },
        { label: "Mer", amountXof: 290000 },
        { label: "Jeu", amountXof: 0 },
        { label: "Ven", amountXof: 95000 },
        { label: "Sam", amountXof: 140000 },
        { label: "Dim", amountXof: 210000 },
      ],
    };
  }

  /**
   * Liste les commandes avec filtre et recherche
   */
  static async listOrders(filters?: { query?: string; status?: string }): Promise<AdminOrderSummary[]> {
    let list = [...MOCK_ADMIN_ORDERS];

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (o) =>
          o.number.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q) ||
          (o.customerName && o.customerName.toLowerCase().includes(q))
      );
    }

    if (filters?.status && filters.status !== "all") {
      list = list.filter((o) => o.status === filters.status);
    }

    return list;
  }

  /**
   * Rembourse une commande et révoque automatiquement les licences associées
   */
  static async refundOrder(params: {
    orderId: string;
    reason: string;
    refundType: "full" | "partial";
    amountXof?: number;
    adminUserId?: string;
  }): Promise<{ success: boolean; order: AdminOrderSummary }> {
    const orderIndex = MOCK_ADMIN_ORDERS.findIndex((o) => o.id === params.orderId);
    if (orderIndex === -1) {
      throw new Error(`Commande introuvable : ${params.orderId}`);
    }

    const order = MOCK_ADMIN_ORDERS[orderIndex]!;
    order.status = "refunded";

    // Révocation des licences associées
    for (const key of order.licenseKeys) {
      const lic = MOCK_ADMIN_LICENSES.find((l) => l.key === key);
      if (lic) {
        lic.status = "revoked";
        lic.revokedAt = new Date().toISOString();
        lic.revokedReason = `Commande ${order.number} remboursée : ${params.reason}`;
      }
    }

    // Journalisation d'audit immuable
    await AuditLogger.log({
      actorId: params.adminUserId,
      action: "order.refund",
      entity: "order",
      entityId: order.id,
      diff: {
        number: order.number,
        refundType: params.refundType,
        reason: params.reason,
        amountXof: params.amountXof || order.totalXof,
        revokedLicenses: order.licenseKeys,
      },
    });

    return { success: true, order };
  }

  /**
   * Liste les licences
   */
  static async listLicenses(filters?: { query?: string; status?: string }): Promise<AdminLicenseItem[]> {
    let list = [...MOCK_ADMIN_LICENSES];

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (l) =>
          l.key.toLowerCase().includes(q) ||
          l.buyerEmail.toLowerCase().includes(q) ||
          l.productTitle.toLowerCase().includes(q) ||
          l.domains.some((d) => d.toLowerCase().includes(q))
      );
    }

    if (filters?.status && filters.status !== "all") {
      list = list.filter((l) => l.status === filters.status);
    }

    return list;
  }

  /**
   * Modifie le statut d'une licence (active, revoked, expired)
   */
  static async updateLicenseStatus(params: {
    licenseId: string;
    status: "active" | "revoked" | "expired";
    reason?: string;
    adminUserId?: string;
  }): Promise<AdminLicenseItem> {
    const lic = MOCK_ADMIN_LICENSES.find((l) => l.id === params.licenseId || l.key === params.licenseId);
    if (!lic) {
      throw new Error(`Licence introuvable : ${params.licenseId}`);
    }

    const oldStatus = lic.status;
    lic.status = params.status;
    if (params.status === "revoked") {
      lic.revokedAt = new Date().toISOString();
      lic.revokedReason = params.reason || "Révocation administrative";
    } else {
      lic.revokedAt = undefined;
      lic.revokedReason = undefined;
    }

    await AuditLogger.log({
      actorId: params.adminUserId,
      action: "license.status_change",
      entity: "license",
      entityId: lic.id,
      diff: {
        key: lic.key,
        oldStatus,
        newStatus: params.status,
        reason: params.reason,
      },
    });

    return lic;
  }

  /**
   * Réinitialise les domaines activés pour une licence
   */
  static async resetLicenseDomains(params: {
    licenseId: string;
    adminUserId?: string;
  }): Promise<AdminLicenseItem> {
    const lic = MOCK_ADMIN_LICENSES.find((l) => l.id === params.licenseId || l.key === params.licenseId);
    if (!lic) {
      throw new Error(`Licence introuvable : ${params.licenseId}`);
    }

    const oldDomains = [...lic.domains];
    lic.domains = [];

    await AuditLogger.log({
      actorId: params.adminUserId,
      action: "license.reset_domains",
      entity: "license",
      entityId: lic.id,
      diff: {
        key: lic.key,
        clearedDomains: oldDomains,
      },
    });

    return lic;
  }

  /**
   * Liste les clients
   */
  static async listCustomers(filters?: { query?: string }): Promise<AdminCustomerItem[]> {
    let list = [...MOCK_ADMIN_CUSTOMERS];

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (c) =>
          c.fullName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.phone && c.phone.includes(q))
      );
    }

    return list;
  }

  /**
   * Bloque ou débloque un utilisateur
   */
  static async toggleCustomerBlock(params: {
    userId: string;
    isBlocked: boolean;
    adminUserId?: string;
  }): Promise<AdminCustomerItem> {
    const customer = MOCK_ADMIN_CUSTOMERS.find((c) => c.id === params.userId);
    if (!customer) {
      throw new Error(`Utilisateur introuvable : ${params.userId}`);
    }

    customer.isBlocked = params.isBlocked;

    await AuditLogger.log({
      actorId: params.adminUserId,
      action: params.isBlocked ? "user.block" : "user.unblock",
      entity: "user",
      entityId: customer.id,
      diff: {
        email: customer.email,
        isBlocked: params.isBlocked,
      },
    });

    return customer;
  }

  /**
   * Liste les demandes de projets sur mesure pour le Kanban
   */
  static async listCustomQuotes(): Promise<AdminCustomQuote[]> {
    return MOCK_CUSTOM_QUOTES;
  }

  /**
   * Met à jour le statut d'une demande sur mesure dans le Kanban
   */
  static async updateQuoteStatus(params: {
    quoteId: string;
    status: AdminCustomQuote["status"];
    adminUserId?: string;
  }): Promise<AdminCustomQuote> {
    const quote = MOCK_CUSTOM_QUOTES.find((q) => q.id === params.quoteId);
    if (!quote) {
      throw new Error(`Demande de devis introuvable : ${params.quoteId}`);
    }

    const oldStatus = quote.status;
    quote.status = params.status;

    await AuditLogger.log({
      actorId: params.adminUserId,
      action: "quote.status_update",
      entity: "custom_quote",
      entityId: quote.id,
      diff: {
        reference: quote.reference,
        oldStatus,
        newStatus: params.status,
      },
    });

    return quote;
  }
}
