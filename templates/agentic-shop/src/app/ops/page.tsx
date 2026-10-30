import { connection } from "next/server";
import { Suspense } from "react";
import { opsPassword } from "@/lib/ops-auth";
import { getLatestAnalysis, getLatestProposal, type Analysis, type ProposalAction } from "@/lib/ops-data";
import { decideAction, logoutAction } from "./actions";
import { SalesChart } from "./sales-chart";

const ALERT_LABEL: Record<string, string> = {
  out_of_stock: "Agotado",
  low_cover: "Cobertura baja",
  dead_stock: "Stock muerto",
  negative_stock: "Inventario negativo",
};
const TYPE_LABEL: Record<ProposalAction["type"], string> = {
  restock_po: "Resurtido (OC)",
  fulfill_order: "Enviar pedido",
  followup_payment: "Cobro",
  inventory_adjust: "Ajuste de inventario",
};
const STATUS_LABEL: Record<ProposalAction["status"], string> = {
  pending: "Pendiente",
  approved: "Aprobada",
  rejected: "Rechazada",
  applied: "Aplicada",
  failed: "Falló",
};

export default function OpsPage() {
  return (
    <Suspense fallback={<p className="text-neutral-500">Cargando panel…</p>}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  await connection(); // always read fresh files
  const [analysis, proposal] = await Promise.all([getLatestAnalysis(), getLatestProposal()]);
  const noPassword = !opsPassword();

  return (
    <div className="space-y-8">
      {noPassword && (
        <p className="rounded border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          OPS_PASSWORD no está definida: el panel está abierto porque estás en desarrollo. En producción queda bloqueado.
        </p>
      )}
      {analysis?.source === "mock" && (
        <p className="rounded bg-violet-600 px-4 py-2 text-center text-sm font-semibold uppercase tracking-wide text-white">
          Datos de demostración
        </p>
      )}

      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Panel del dueño</h1>
          {analysis && (
            <p className="text-sm text-neutral-500">
              {analysis.shop} · análisis del {analysis.date}
            </p>
          )}
        </div>
        {!noPassword && (
          <form action={logoutAction}>
            <button className="text-sm underline">Salir</button>
          </form>
        )}
      </div>

      {!analysis ? (
        <p className="rounded bg-white p-6 text-neutral-600">
          Todavía no hay análisis. Corre <code>pnpm ops:daily --mock</code> (o sin <code>--mock</code> con tu tienda).
        </p>
      ) : (
        <>
          <Kpis analysis={analysis} />
          <section className="rounded-lg bg-white p-4">
            <h2 className="mb-2 font-medium">Ventas netas por día (30 días)</h2>
            <SalesChart data={analysis.dailyNet} format={(n) => fmt(n, analysis.currency)} />
          </section>
          <Attention analysis={analysis} />
          <Inventory analysis={analysis} />
        </>
      )}

      <Proposals actions={proposal?.actions ?? []} date={proposal?.date} />
    </div>
  );
}

function fmt(n: number, currency: string) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}

function Kpis({ analysis }: { analysis: Analysis }) {
  const c = analysis.currency;
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {(["today", "d7", "d30"] as const).map((key) => {
        const k = analysis.kpis[key];
        return (
          <div key={key} className="rounded-lg border border-neutral-200 bg-white p-4">
            <h2 className="text-sm text-neutral-500">{k.label}</h2>
            <p className="mt-1 text-3xl font-semibold">{fmt(k.netSales, c)}</p>
            <p className="text-xs text-neutral-500">ventas netas</p>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <dt className="text-neutral-500">Pedidos</dt>
              <dd className="text-right">{k.orders}</dd>
              <dt className="text-neutral-500">Ticket prom.</dt>
              <dd className="text-right">{fmt(k.avgTicket, c)}</dd>
              <dt className="text-neutral-500">Brutas</dt>
              <dd className="text-right">{fmt(k.grossSales, c)}</dd>
              <dt className="text-neutral-500">Desc. / reemb.</dt>
              <dd className="text-right">
                {fmt(k.discounts, c)} / {fmt(k.refunds, c)}
              </dd>
              <dt className="text-neutral-500">Margen est.</dt>
              <dd className="text-right">{k.grossMargin.pct == null ? "—" : `${k.grossMargin.pct}%`}</dd>
              <dt className="text-neutral-500">Nuevas / recurrentes</dt>
              <dd className="text-right">
                {k.customers.new} / {k.customers.returning}
              </dd>
            </dl>
            {key === "d30" && k.grossMargin.variantsWithoutCost > 0 && (
              <p className="mt-2 text-xs text-neutral-500">
                {k.grossMargin.variantsWithoutCost} variantes sin costo no entran en el margen.
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
}

function Attention({ analysis }: { analysis: Analysis }) {
  const rows = analysis.orderStatus.attention;
  return (
    <section className="rounded-lg bg-white p-4">
      <h2 className="mb-3 font-medium">Pedidos que requieren atención ({rows.length})</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-neutral-500">Nada pendiente.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-neutral-500">
              <tr>
                <th className="py-1 pr-4 font-normal">Pedido</th>
                <th className="py-1 pr-4 font-normal">Motivo</th>
                <th className="py-1 text-right font-normal">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((o) => (
                <tr key={`${o.id}-${o.type}`}>
                  <td className="py-1 pr-4 font-medium">{o.name}</td>
                  <td className="py-1 pr-4">{o.reason}</td>
                  <td className="whitespace-nowrap py-1 text-right">{fmt(o.total, analysis.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Inventory({ analysis }: { analysis: Analysis }) {
  const rows = analysis.inventory.filter((i) => i.alerts.length || i.restock);
  return (
    <section className="rounded-lg bg-white p-4">
      <h2 className="mb-3 font-medium">Inventario con alertas</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-neutral-500">Sin alertas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-neutral-500">
              <tr>
                <th className="py-1 pr-4 font-normal">Producto</th>
                <th className="py-1 pr-4 text-right font-normal">Disp.</th>
                <th className="py-1 pr-4 text-right font-normal">Vel./día</th>
                <th className="py-1 pr-4 text-right font-normal">Cobertura</th>
                <th className="py-1 pr-4 font-normal">Alertas</th>
                <th className="py-1 text-right font-normal">Resurtir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((i) => (
                <tr key={i.variantId}>
                  <td className="py-1 pr-4">
                    {i.productTitle} <span className="text-neutral-500">/ {i.variantTitle}</span>
                  </td>
                  <td className="py-1 pr-4 text-right">{i.available}</td>
                  <td className="py-1 pr-4 text-right">{i.velocity}</td>
                  <td className="py-1 pr-4 text-right">{i.coverDays == null ? "—" : `${i.coverDays} d`}</td>
                  <td className="py-1 pr-4">
                    {i.alerts.map((a) => (
                      <span key={a} className="mr-1 rounded bg-red-50 px-1.5 py-0.5 text-xs text-red-700">
                        {ALERT_LABEL[a] ?? a}
                      </span>
                    ))}
                  </td>
                  <td className="py-1 text-right" title={i.restock?.reason}>
                    {i.restock ? `${i.restock.suggestedQty} u.` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Proposals({ actions, date }: { actions: ProposalAction[]; date?: string }) {
  return (
    <section className="rounded-lg bg-white p-4">
      <h2 className="font-medium">Acciones propuestas{date ? ` · ${date}` : ""}</h2>
      <p className="mb-3 text-sm text-neutral-500">
        Aprobar solo cambia el estado en el archivo de propuestas. Nada se ejecuta aquí: la ejecución la hace{" "}
        <code>pnpm ops:apply --apply</code>.
      </p>
      {actions.length === 0 ? (
        <p className="text-sm text-neutral-500">No hay propuestas. Corre <code>pnpm ops:propose</code>.</p>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {actions.map((a) => (
            <li key={a.id} className="flex flex-col gap-2 py-3 md:flex-row md:items-center">
              <div className="flex-1">
                <p className="text-sm">
                  <span className="mr-2 rounded bg-neutral-100 px-1.5 py-0.5 text-xs">{TYPE_LABEL[a.type]}</span>
                  <span className="font-medium">{a.title}</span>
                </p>
                <p className="text-xs text-neutral-500">{a.detail}</p>
                {a.result?.error && <p className="text-xs text-red-600">Error: {a.result.error}</p>}
              </div>
              <span className="text-xs text-neutral-500">{STATUS_LABEL[a.status]}</span>
              {(a.status === "pending" || a.status === "approved" || a.status === "rejected") && (
                <form action={decideAction} className="flex gap-2">
                  <input type="hidden" name="id" value={a.id} />
                  <button
                    name="decision"
                    value="approved"
                    disabled={a.status === "approved"}
                    className="rounded bg-neutral-900 px-3 py-1 text-xs text-white disabled:opacity-40"
                  >
                    Aprobar
                  </button>
                  <button
                    name="decision"
                    value="rejected"
                    disabled={a.status === "rejected"}
                    className="rounded border border-neutral-300 px-3 py-1 text-xs disabled:opacity-40"
                  >
                    Rechazar
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
