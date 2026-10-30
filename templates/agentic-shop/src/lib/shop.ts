import "server-only";
import { storefront } from "./storefront";

export type Money = { amount: string; currencyCode: string };
export type Image = { url: string; altText: string | null; width: number; height: number };

export type ProductCard = {
  id: string;
  handle: string;
  title: string;
  availableForSale: boolean;
  featuredImage: Image | null;
  priceRange: { minVariantPrice: Money };
};

export type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: Money;
  selectedOptions: { name: string; value: string }[];
};

export type Product = ProductCard & {
  description: string;
  variants: { nodes: Variant[] };
};

const PRODUCT_CARD = /* GraphQL */ `
  fragment ProductCard on Product {
    id
    handle
    title
    availableForSale
    featuredImage { url altText width height }
    priceRange { minVariantPrice { amount currencyCode } }
  }
`;

export async function getProducts(first = 24): Promise<ProductCard[]> {
  const data = await storefront<{ products: { nodes: ProductCard[] } }>(
    `${PRODUCT_CARD}
    query Products($first: Int!) {
      products(first: $first) { nodes { ...ProductCard } }
    }`,
    { first },
  );
  return data.products.nodes;
}

export async function getProduct(handle: string): Promise<Product | null> {
  // quantityAvailable needs the unauthenticated_read_product_inventory scope on a real store. // [UNVERIFIED] scope name
  const data = await storefront<{ product: Product | null }>(
    `${PRODUCT_CARD}
    query Product($handle: String!) {
      product(handle: $handle) {
        ...ProductCard
        description
        variants(first: 50) {
          nodes {
            id
            title
            availableForSale
            quantityAvailable
            price { amount currencyCode }
            selectedOptions { name value }
          }
        }
      }
    }`,
    { handle },
  );
  return data.product;
}

export function formatMoney({ amount, currencyCode }: Money): string {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: currencyCode }).format(
    Number(amount),
  );
}
