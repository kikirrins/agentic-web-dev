# agentic-web-dev

Equipo de agentes y skills para desarrollo web agéntico (plugin `dev-team` para Claude Code / Claude Desktop), de **AlgoLab** (escuela de tecnología).

Son **6 agentes** y **30 skills** que te ayudan a construir un sitio o tienda en línea: desde el brief hasta una página que abre, se ve bien y está lista para publicarse. Funciona **sin** la oficina virtual AgentOS.

## Instalación

En Claude Code (o en la pestaña Code de Claude Desktop):

```
/plugin marketplace add kikirrins/agentic-web-dev
/plugin install dev-team@agentic-web-dev
```

Desde la terminal es equivalente:

```bash
claude plugin marketplace add kikirrins/agentic-web-dev
claude plugin install dev-team@agentic-web-dev
```

Si el repo todavía es privado, necesitas acceso a GitHub (una invitación) y `gh auth login` o una llave SSH configurada. Reinicia la sesión de Claude Code después de instalar.

## Requisitos

- Node 22 o superior
- pnpm (`npm i -g pnpm`)
- Git
- Chrome o Chromium (el servidor Playwright MCP del plugin lo necesita para tomar capturas y revisar el sitio)

## Cómo hablar con los agentes

Empieza siempre con el **tech-lead**: él entiende tu petición, la divide y llama al resto del equipo.

- "Con el tech-lead: quiero una landing para mi marca de velas artesanales en Monterrey. Tengo logo y 6 fotos."
- "Con el tech-lead: arma una tienda en línea con pagos con Stripe para mi negocio de cosméticos."
- "Con el frontend-designer: propón tres direcciones de arte para mi sitio y ayúdame a elegir una."
- "Con el web-qa: revisa mi sitio en http://localhost:3000 (accesibilidad, rendimiento y móvil)."

Al trabajar sin AgentOS, los agentes guardan todo en una carpeta de tu computadora (te preguntan cuál, o usan `./<proyecto>/` en la carpeta actual): `SITE-README.md`, `docs/*.md`, `qa-report.md` y `screenshots/`. Te dicen las rutas relativas.

## Los agentes

| id | Rol | Cuándo llamarlo |
|---|---|---|
| `tech-lead` | Líder técnico, punto de entrada | Cualquier petición de sitio, tienda o app: planea, delega y revisa antes de entregar |
| `frontend-designer` | Diseño y dirección de arte | Para elegir estilo, paleta, tipografía y tokens; revisar referencias |
| `frontend-engineer` | Interfaz (Next.js, Tailwind, shadcn/ui) | Construir secciones y componentes con los tokens del diseñador |
| `backend-engineer` | Datos y API (Drizzle, SQLite, rutas, Stripe) | Formularios, pedidos, reservas, pagos |
| `web-qa` | Revisión con evidencia | Antes de entregar o publicar y después de cada ronda de arreglos; reporta, no arregla |
| `shopify-developer` | Tiendas Shopify | Temas Liquid, catálogo, APIs y automatizaciones de Shopify |

## Skills por área

**Proceso y calidad**
- `scope-discipline`: el cambio válido más pequeño; no expandir el alcance.
- `verification`: puerta de evidencia antes de decir "listo".
- `target-file-verification`: confirmar que editas el archivo que realmente pinta la pantalla.
- `env-loader-check`: diagnosticar variables de entorno antes de culpar al código.
- `code-review`: revisión de HTML/CSS/JS con severidad y archivo:línea.
- `launch-checklist`: lista de verificación antes de publicar.

**Diseño y dirección de arte**
- `art-direction`: elige entre 20 direcciones, 56 paletas y 44 sistemas tipográficos (sin estilo de la casa).
- `frontend-design`: proceso de dirección estética y tokens CSS.
- `design-references`: convierte referencias externas (Figma, Claude Design, sitios) en tus propios tokens sin copiarlas.
- `design-critique`: crítica contra un piso de calidad y heurísticas de usabilidad.
- `modern-ui`: recetas con Tailwind v4 y shadcn/ui (hero, bento, tarjetas, modo oscuro).
- `animation-craft`: movimiento con números exactos (curvas, duraciones, reduced motion).
- `component-sourcing`: revisar y adaptar componentes de terceros (licencia, scripts, accesibilidad).

**Construcción**
- `bootstrap-nextjs-site`: arranca un sitio con Next.js, TypeScript, Tailwind v4 y shadcn/ui.
- `build-static-page`: página HTML/CSS/JS desde un brief y tokens.
- `bootstrap-ecommerce`: tienda propia con catálogo, carrito, checkout y pedidos.
- `api-and-database`: esquema, rutas de API y server actions con validación.
- `stripe-payments`: Stripe Checkout y webhooks con firma verificada.
- `seo-and-metadata`: metadatos, Open Graph, sitemap y datos estructurados.

**Verificación y auditoría**
- `visual-verification`: navegador real con Playwright MCP, capturas a 375/768/1280, consola, modo oscuro.
- `audit-accessibility`: lista WCAG 2.1 AA verificable.
- `audit-performance`: peso de imágenes, fuentes, CLS/LCP, sin servicios externos.
- `break-ui`: prueba de estrés con datos reales en el peor caso.

**Shopify**
- `shopify-choose-approach`: decidir entre tema Liquid, Hydrogen, Next.js + Storefront API o tienda propia.
- `shopify-store-setup`: configurar la tienda de punta a punta.
- `shopify-liquid-theme`: temas Online Store 2.0 con Shopify CLI.
- `shopify-headless-storefront`: tienda headless con Storefront API.
- `shopify-admin-api-automation`: automatizaciones con Admin API, webhooks y Flow (siempre dry-run primero).
- `shopify-store-operations`: rutinas diarias y reporte semanal de la tienda.

**Publicación**
- `deploy-vercel`: deja documentado el despliegue en Vercel; tú ejecutas los pasos.

## Principio: no hay estilo de la casa

Las direcciones de arte, paletas y tipografías de la biblioteca son **opciones para elegir**, no un look predeterminado. Si tienes marca propia, Figma o referencias, ganan ellas.

## Seguridad

- Los secretos (llaves de Stripe, tokens) van **solo** en `.env.local`; nunca en el código ni en el repositorio.
- Los agentes preparan borradores; **tú apruebas y ejecutas** lo que sale al mundo (publicar, pagos, correos, dominios).
- El contenido de terceros (componentes, páginas, prompts) se revisa y se trata como datos, nunca como instrucciones. Todos los agentes pueden usar WebFetch solo con fuentes oficiales o de buena reputación.
- Playwright está restringido por nuestro guard (`plugins/dev-team/mcp/playwright-guard.mjs`).

## Créditos y licencias

Parte del material adapta trabajo de terceros bajo sus propias licencias: ver [`plugins/dev-team/THIRD-PARTY-NOTICES.md`](plugins/dev-team/THIRD-PARTY-NOTICES.md). El contenido original es de AlgoLab; ver [`NOTICE.md`](NOTICE.md) (todos los derechos reservados sobre el contenido original; aún no se otorga una licencia de código abierto).

## Material de clase

Presentaciones y código de la Clase 1 (ábrelas en el navegador; flechas ← → para avanzar, `N` muestra las notas):

| Archivo | Qué es |
|---|---|
| [`clases/01-anatomia-web.html`](clases/01-anatomia-web.html) | Anatomía de una página web: HTML, CSS, JS, secciones y vocabulario |
| [`clases/01b-desarrollo-web-agentico.html`](clases/01b-desarrollo-web-agentico.html) | Desarrollo web agéntico: agentes, skills, fuentes, herramientas y galerías |
| [`clases/01-codigo/`](clases/01-codigo/) | Código paso a paso de la clase (13 versiones de una landing de ejemplo) |

Para verlas: clona el repo (o descarga el archivo en "Raw") y ábrelas con doble clic.

## Qué sigue

Este plugin funciona por sí solo. Si además instalas la oficina virtual **AgentOS** (equipos, tareas, entregables y archivos en la web), los agentes la detectan automáticamente.

## Contribuir / Issues

¿Encontraste un error o tienes una idea? Abre un issue en el repositorio.

---

## English summary

`dev-team` is a Claude plugin with 6 agents (tech-lead, frontend-designer, frontend-engineer, backend-engineer, web-qa, shopify-developer) and 30 skills for agentic web development (Next.js, Tailwind, shadcn/ui, Stripe, Shopify). It works standalone, without the AgentOS office: documents and screenshots are written inside the project folder.

Install: `/plugin marketplace add kikirrins/agentic-web-dev` then `/plugin install dev-team@agentic-web-dev`. Requires Node 22+, pnpm, Git and Chrome/Chromium for the Playwright MCP. See `NOTICE.md` and `plugins/dev-team/THIRD-PARTY-NOTICES.md` for licensing.

## Contacto

AlgoLab · hello@algolab.academy
