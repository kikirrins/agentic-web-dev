import "server-only";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// The panel reads the files written by the ops scripts. Server-side only.
const OPS_DIR = path.join(process.cwd(), "ops");

export type Kpi = {
  label: string;
  grossSales: number;
  discounts: number;
  refunds: number;
  netSales: number;
  orders: number;
  avgTicket: number;
  grossMargin: { amount: number; pct: number | null; variantsWithoutCost: number };
  customers: { new: number; returning: number; guests: number };
  topByUnits: { product: string; units: number; sales: number }[];
};

export type AttentionOrder = {
  id: string;
  name: string;
  createdAt: string;
  total: number;
  hours: number;
  type: "paid_unfulfilled" | "pending_payment" | "recent_refund";
  reason: string;
};

export type InventoryRow = {
  variantId: string;
  productTitle: string;
  variantTitle: string;
  sku: string | null;
  available: number;
  velocity: number;
  coverDays: number | null;
  alerts: string[];
  restock: { suggestedQty: number; reason: string } | null;
};

export type Analysis = {
  date: string;
  source: "shopify" | "mock";
  shop: string;
  currency: string;
  snapshotGeneratedAt: string;
  kpis: { today: Kpi; d7: Kpi; d30: Kpi };
  dailyNet: { date: string; net: number }[];
  orderStatus: {
    byFinancialStatus: Record<string, number>;
    byFulfillmentStatus: Record<string, number>;
    attention: AttentionOrder[];
  };
  inventory: InventoryRow[];
};

export type ActionStatus = "pending" | "approved" | "rejected" | "applied" | "failed";

export type ProposalAction = {
  id: string;
  type: "restock_po" | "fulfill_order" | "followup_payment" | "inventory_adjust";
  title: string;
  detail: string;
  payload: Record<string, unknown>;
  status: ActionStatus;
  result?: { at: string; error?: string; note?: string };
};

export type Proposal = { date: string; source: string; actions: ProposalAction[] };

async function latest(dir: string, re: RegExp): Promise<string | null> {
  const files = (await readdir(path.join(OPS_DIR, dir)).catch(() => [] as string[]))
    .filter((f) => re.test(f))
    .sort();
  return files.length ? path.join(OPS_DIR, dir, files.at(-1)!) : null;
}

export async function getLatestAnalysis(): Promise<Analysis | null> {
  const file = await latest("data", /^analysis-\d{4}-\d{2}-\d{2}\.json$/);
  return file ? JSON.parse(await readFile(file, "utf8")) : null;
}

async function latestProposalFile() {
  return latest("proposals", /^\d{4}-\d{2}-\d{2}\.json$/);
}

export async function getLatestProposal(): Promise<Proposal | null> {
  const file = await latestProposalFile();
  return file ? JSON.parse(await readFile(file, "utf8")) : null;
}

/** Only flips pending <-> approved/rejected. Executing is ops:apply's job. */
export async function setActionStatus(id: string, status: "approved" | "rejected") {
  const file = await latestProposalFile();
  if (!file) throw new Error("No hay propuesta");
  const proposal: Proposal = JSON.parse(await readFile(file, "utf8"));
  const action = proposal.actions.find((a) => a.id === id);
  if (!action) throw new Error(`Acción ${id} no encontrada`);
  if (action.status === "applied") throw new Error("La acción ya se aplicó");
  action.status = status;
  await writeFile(file, JSON.stringify(proposal, null, 2) + "\n");
}
