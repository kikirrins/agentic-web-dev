import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { addToCartAction } from "@/app/actions";
import { formatMoney, getProduct, type Variant } from "@/lib/shop";

export default function ProductPage({ params }: PageProps<"/products/[handle]">) {
  return (
    <Suspense fallback={<p className="text-neutral-500">Cargando producto…</p>}>
      <ProductDetail params={params} />
    </Suspense>
  );
}

async function ProductDetail({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const variants = product.variants.nodes;
  const firstAvailable = variants.find((v) => v.availableForSale);

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
        {product.featuredImage && (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </div>

      <div>
        <h1 className="text-3xl font-semibold">{product.title}</h1>
        <p className="mt-2 text-lg">{formatMoney(product.priceRange.minVariantPrice)}</p>
        {product.description && <p className="mt-4 text-neutral-600">{product.description}</p>}

        <form action={addToCartAction} className="mt-8 space-y-4">
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Elige una opción</legend>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <label
                  key={v.id}
                  className="cursor-pointer rounded border border-neutral-300 bg-white px-3 py-2 text-sm has-[:checked]:border-neutral-900 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40"
                >
                  <input
                    type="radio"
                    name="variantId"
                    value={v.id}
                    defaultChecked={v.id === firstAvailable?.id}
                    disabled={!v.availableForSale}
                    className="sr-only"
                  />
                  {v.title} · {formatMoney(v.price)}
                  <span className="block text-xs text-neutral-500">{availabilityLabel(v)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={!firstAvailable}
            className="w-full rounded bg-neutral-900 px-4 py-3 text-white disabled:bg-neutral-400"
          >
            {firstAvailable ? "Agregar al carrito" : "Agotado"}
          </button>
        </form>
      </div>
    </div>
  );
}

function availabilityLabel(v: Variant): string {
  if (!v.availableForSale) return "Agotado";
  if (v.quantityAvailable == null) return "Disponible";
  if (v.quantityAvailable <= 5) return `Últimas ${v.quantityAvailable} piezas`;
  return "Disponible";
}
