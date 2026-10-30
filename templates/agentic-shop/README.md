# Agentic Shop

Demo de **e-commerce agéntico** para el taller: una tienda en Next.js conectada a Shopify
(Storefront API) y un agente "gerente de tienda" que cada mañana lee la tienda (Admin API),
analiza ventas, pedidos e inventario y **propone** acciones. El dueño las **aprueba** en un panel
y un script las **ejecuta**.

```
            Storefront API                      Admin API (solo lectura)
 Clienta ──► Tienda Next.js (/ , /products, /cart) ──► checkout de Shopify
                                                        │
 cron / launchd / claude -p                             ▼
   pnpm ops:daily ─► snapshot.mjs ─► ops/data/snapshot-FECHA.json
                     analyze.mjs  ─► ops/data/analysis-FECHA.json + ops/reports/FECHA.md
                     propose.mjs  ─► ops/proposals/FECHA.json (+ po-FECHA.md)
                                                        │
 Dueño ──► /ops (contraseña) ── Aprobar / Rechazar ─────┘  (solo cambia "status")
                                                        │
   pnpm ops:apply --apply ─► Admin API (mutaciones) ─► ops/logs/audit.jsonl
```

## Reglas del sistema

1. **El agente propone.** `ops:daily` solo lee Shopify y escribe archivos. Nunca cambia la tienda.
2. **El dueño aprueba.** En `/ops` cada acción se aprueba o rechaza. Aprobar no ejecuta nada.
3. **`apply` ejecuta.** `pnpm ops:apply` es un dry-run; solo con `--apply` corre las acciones
   aprobadas, y cada cambio queda en `ops/logs/audit.jsonl`.
4. Los borradores de orden de compra (`restock_po`) y los recordatorios de pago (`followup_payment`)
   nunca tocan Shopify: se registran y se hacen a mano.
5. Los datos de `--mock` llevan `source: "mock"` y el panel muestra la banda "Datos de demostración".

## Modo demo (sin tienda)

Requisitos: Node 24 y pnpm 10.

```bash
pnpm i
pnpm ops:daily --mock      # genera snapshot, análisis, reporte y propuestas con datos sintéticos
pnpm dev                   # http://localhost:3017
```

- La tienda usa el catálogo público de [mock.shop](https://mock.shop) (sin token).
- Sin `OPS_PASSWORD`, en desarrollo `/ops` se abre con un aviso. Para probar el login:
  `OPS_PASSWORD=demo pnpm dev`.
- Para probar el ciclo completo: aprueba una acción en `/ops` y corre
  `pnpm ops:apply` (dry-run) y luego `pnpm ops:apply --apply` (simulado y registrado en la bitácora).

## Setup con una tienda real (de desarrollo)

1. **Cuenta y tienda.** Crea una cuenta en el [Dev Dashboard](https://dev.shopify.com) y, desde
   la página **Dev stores**, una tienda de desarrollo con datos de prueba. Tiene que estar en la
   misma organización que la app (si la creas desde el admin de Shopify, el client credentials
   grant responde `shop_not_permitted`).
2. **Canal Headless (tienda).** En el admin de la tienda instala el canal **Headless**, crea un
   storefront y copia el **token privado** de la Storefront API. Activa el permiso de lectura de
   inventario (`unauthenticated_read_product_inventory`) para ver `quantityAvailable`.
3. **App de operaciones (agente).** En el Dev Dashboard crea una app, elige estos scopes de Admin API
   e instálala en la tienda:
   `read_products`, `read_inventory`, `write_inventory`, `read_orders`,
   `read_merchant_managed_fulfillment_orders`, `write_merchant_managed_fulfillment_orders`,
   `write_draft_orders`.
   - `read_orders` solo devuelve los últimos 60 días (nos bastan 30).
   - Para `customer { numberOfOrders }` la app puede necesitar acceso a datos protegidos de
     clientes; si no lo tiene, el snapshot lo deja en `null` y el reporte cuenta menos clientas.
4. **`.env.local`** (copia `.env.example`):

   ```bash
   SHOPIFY_STORE_DOMAIN=mi-tienda-dev.myshopify.com
   SHOPIFY_STOREFRONT_PRIVATE_TOKEN=...
   SHOPIFY_ADMIN_CLIENT_ID=...
   SHOPIFY_ADMIN_CLIENT_SECRET=...
   OPS_PASSWORD=una-contraseña-larga
   ```

5. **Datos de prueba.** Si la tienda está vacía:

   ```bash
   pnpm ops:seed            # dry-run: muestra lo que haría
   pnpm ops:seed --apply    # pone costos y crea ~25 pedidos pagados
   ```

   Se niega a correr si la tienda no es de desarrollo (`shop.plan.partnerDevelopment`), salvo con
   `--i-know`. Los pedidos quedan con fecha de hoy (Shopify no permite fecharlos en el pasado).
6. `pnpm ops:daily` (sin `--mock`) y `pnpm dev`.

La API usada es la versión **2026-10** (Storefront y Admin). El token de Admin se pide con el
*client credentials grant*, dura 24 h, vive solo en memoria y nunca se imprime.

## Programarlo a diario

### cron (Linux/macOS)

```cron
# Todos los días a las 7:00
0 7 * * * cd /ruta/a/agentic-shop && /usr/local/bin/pnpm ops:daily >> ops/logs/daily.log 2>&1
```

### launchd (macOS)

`~/Library/LaunchAgents/academy.algolab.shop-daily.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>academy.algolab.shop-daily</string>
  <key>WorkingDirectory</key><string>/ruta/a/agentic-shop</string>
  <key>ProgramArguments</key>
  <array><string>/bin/zsh</string><string>-lc</string><string>pnpm ops:daily</string></array>
  <key>StartCalendarInterval</key><dict><key>Hour</key><integer>7</integer><key>Minute</key><integer>0</integer></dict>
  <key>StandardOutPath</key><string>/ruta/a/agentic-shop/ops/logs/daily.log</string>
  <key>StandardErrorPath</key><string>/ruta/a/agentic-shop/ops/logs/daily.log</string>
</dict>
</plist>
```

`launchctl load ~/Library/LaunchAgents/academy.algolab.shop-daily.plist`

### Con Claude como gerente (`claude -p`)

El agente corre los scripts, lee el reporte y te deja un resumen. Dale solo los permisos que
necesita para **proponer** (nunca `ops:apply --apply`):

```bash
cd /ruta/a/agentic-shop && claude -p \
  "Corre pnpm ops:daily. Lee el reporte de hoy en ops/reports y la propuesta en ops/proposals. \
   Escribe en 5 viñetas qué debe aprobar el dueño hoy y por qué. No ejecutes ops:apply." \
  --allowedTools "Bash(pnpm ops:daily)" "Read"
```

## Estructura

```
src/lib/storefront.ts    cliente Storefront (mock.shop o tienda real, userErrors, buyer IP)
src/lib/shop.ts          consultas de productos
src/lib/cart.ts          carrito: cartCreate / cartLinesAdd / cartLinesUpdate / cartLinesRemove
src/app/                 /, /products/[handle], /cart, /ops (+ /ops/login)
src/proxy.ts             protege /ops con cookie (comparación en tiempo constante)
ops/lib/admin.mjs        token (client credentials) + gql() con retry según throttleStatus
ops/snapshot.mjs         lee la tienda (o genera datos --mock)
ops/analyze.mjs          KPIs, estado de pedidos, inventario, resurtido
ops/propose.mjs          acciones para aprobar + borrador de OC
ops/apply.mjs            ejecuta las aprobadas (dry-run por defecto) y escribe la bitácora
ops/seed-dev-store.mjs   llena una tienda de desarrollo vacía
ops/config.json          leadTimeDays, coverDays, umbrales y semilla del mock
```

## Cómo se calculan los números

- **Ventas brutas** = Σ precio × cantidad de las líneas. **Netas** = brutas − descuentos − reembolsos.
  Se excluyen pedidos anulados o vencidos.
- **Margen bruto estimado** = solo líneas cuya variante tiene `unitCost`; se reporta cuántas
  variantes no tienen costo.
- **Clienta nueva**: su primer pedido de toda la vida cae dentro del periodo.
- **Velocidad** = unidades de los últimos 14 días / 14. **Cobertura** = disponible / velocidad.
- **Resurtido** = `ceil(velocidad × (leadTimeDays + coverDays)) − disponible` (7 + 21 por defecto).
- **Alertas**: agotado; cobertura < 7 días; sin ventas en 30 días con más de 20 unidades
  (stock muerto); inventario negativo en alguna ubicación (se propone un ajuste a 0).
