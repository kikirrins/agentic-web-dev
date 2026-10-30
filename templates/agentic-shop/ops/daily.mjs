// Usage: pnpm ops:daily [--mock]
// snapshot -> analyze -> propose, then a 10-line summary (handy for `claude -p` or cron mail).
import { analyze } from "./analyze.mjs";
import { money, parseArgs } from "./lib/util.mjs";
import { propose } from "./propose.mjs";
import { snapshot } from "./snapshot.mjs";

const { flags } = parseArgs();
await snapshot({ mock: flags.has("mock") });
const { analysis: a, report } = await analyze(); // latest snapshot = the one we just wrote
const { actions } = await propose(a.date);

const m = (n) => money(n, a.currency);
const count = (t) => actions.filter((x) => x.type === t).length;
const alerts = (t) => a.inventory.filter((i) => i.alerts.includes(t)).length;
const top = a.kpis.d7.topByUnits[0];

const summary = [
  `Resumen ${a.date} · ${a.shop}${a.source === "mock" ? " · DATOS DE DEMOSTRACIÓN" : ""}`,
  `Hoy: ${m(a.kpis.today.netSales)} netos en ${a.kpis.today.orders} pedidos`,
  `7 días: ${m(a.kpis.d7.netSales)} netos · ${a.kpis.d7.orders} pedidos · ticket ${m(a.kpis.d7.avgTicket)}`,
  `30 días: ${m(a.kpis.d30.netSales)} netos · margen est. ${a.kpis.d30.grossMargin.pct ?? "—"}%`,
  `Top 7 días: ${top ? `${top.product} (${top.units} u.)` : "sin ventas"}`,
  `Pedidos que requieren atención: ${a.orderStatus.attention.length}`,
  `Inventario: ${alerts("out_of_stock")} agotados · ${alerts("low_cover")} con cobertura baja · ${alerts("dead_stock")} stock muerto`,
  `Propuestas: ${count("restock_po")} resurtidos · ${count("fulfill_order")} envíos · ${count("followup_payment")} cobros · ${count("inventory_adjust")} ajustes`,
  `Reporte: ${report.replace(process.cwd() + "/", "")}`,
  `Siguiente paso: aprobar en /ops y luego correr pnpm ops:apply --apply`,
];
console.log("\n" + summary.join("\n"));
