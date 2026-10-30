"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { addLine, removeLine, updateLine } from "@/lib/cart";

export async function addToCartAction(formData: FormData) {
  const variantId = String(formData.get("variantId") ?? "");
  if (!variantId) return;
  await addLine(variantId, 1);
  redirect("/cart");
}

export async function updateLineAction(formData: FormData) {
  const lineId = String(formData.get("lineId") ?? "");
  const quantity = Math.max(0, Math.min(99, Number(formData.get("quantity") ?? 1)));
  if (!lineId) return;
  if (quantity === 0) await removeLine(lineId);
  else await updateLine(lineId, quantity);
  refresh();
}

export async function removeLineAction(formData: FormData) {
  const lineId = String(formData.get("lineId") ?? "");
  if (!lineId) return;
  await removeLine(lineId);
  refresh();
}
