import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { formatMoney, getProducts } from "@/lib/shop";
import { isMockShop } from "@/lib/storefront";

export default function HomePage() {
  return (
    <>
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Productos</h1>
        {isMockShop && <span className="text-xs text-neutral-500">Catálogo de mock.shop</span>}
      </div>
      <Suspense fallback={<p className="text-neutral-500">Cargando productos…</p>}>
        <ProductGrid />
      </Suspense>
    </>
  );
}

async function ProductGrid() {
  const products = await getProducts();
  return (
    <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <li key={p.id}>
          <Link href={`/products/${p.handle}`} className="group block">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
              {p.featuredImage && (
                <Image
                  src={p.featuredImage.url}
                  alt={p.featuredImage.altText ?? p.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition group-hover:scale-105"
                />
              )}
              {!p.availableForSale && (
                <span className="absolute left-2 top-2 rounded bg-neutral-900 px-2 py-1 text-xs text-white">
                  Agotado
                </span>
              )}
            </div>
            <h2 className="mt-2 text-sm font-medium">{p.title}</h2>
            <p className="text-sm text-neutral-600">{formatMoney(p.priceRange.minVariantPrice)}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
