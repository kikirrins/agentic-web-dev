import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { removeLineAction, updateLineAction } from "@/app/actions";
import { getCart } from "@/lib/cart";
import { formatMoney } from "@/lib/shop";

export default function CartPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Carrito</h1>
      <Suspense fallback={<p className="text-neutral-500">Cargando carrito…</p>}>
        <CartContents />
      </Suspense>
    </>
  );
}

async function CartContents() {
  const cart = await getCart();

  if (!cart || cart.lines.nodes.length === 0) {
    return (
      <p className="text-neutral-600">
        Tu carrito está vacío. <Link href="/" className="underline">Ver productos</Link>
      </p>
    );
  }

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_320px]">
      <ul className="divide-y divide-neutral-200 rounded-lg bg-white">
        {cart.lines.nodes.map((line) => (
          <li key={line.id} className="flex gap-4 p-4">
            <div className="relative size-20 shrink-0 overflow-hidden rounded bg-neutral-100">
              {line.merchandise.image && (
                <Image src={line.merchandise.image.url} alt="" fill sizes="80px" className="object-cover" />
              )}
            </div>
            <div className="flex-1">
              <Link href={`/products/${line.merchandise.product.handle}`} className="font-medium">
                {line.merchandise.product.title}
              </Link>
              <p className="text-sm text-neutral-500">{line.merchandise.title}</p>
              <div className="mt-2 flex items-center gap-3 text-sm">
                <form action={updateLineAction} className="flex items-center gap-2">
                  <input type="hidden" name="lineId" value={line.id} />
                  <label className="sr-only" htmlFor={`qty-${line.id}`}>Cantidad</label>
                  <input
                    id={`qty-${line.id}`}
                    name="quantity"
                    type="number"
                    min={0}
                    max={99}
                    defaultValue={line.quantity}
                    className="w-16 rounded border border-neutral-300 px-2 py-1"
                  />
                  <button type="submit" className="underline">Actualizar</button>
                </form>
                <form action={removeLineAction}>
                  <input type="hidden" name="lineId" value={line.id} />
                  <button type="submit" className="text-red-600 underline">Quitar</button>
                </form>
              </div>
            </div>
            <p className="text-sm font-medium">{formatMoney(line.cost.totalAmount)}</p>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-lg bg-white p-6">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Artículos</dt>
            <dd>{cart.totalQuantity}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatMoney(cart.cost.subtotalAmount)}</dd>
          </div>
          <div className="flex justify-between border-t border-neutral-200 pt-2 font-semibold">
            <dt>Total</dt>
            <dd>{formatMoney(cart.cost.totalAmount)}</dd>
          </div>
        </dl>
        <p className="mt-2 text-xs text-neutral-500">Envío e impuestos se calculan en el pago.</p>
        <a
          href={cart.checkoutUrl}
          className="mt-6 block rounded bg-neutral-900 px-4 py-3 text-center text-white"
        >
          Pagar
        </a>
      </aside>
    </div>
  );
}
