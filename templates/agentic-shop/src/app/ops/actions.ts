"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { isValidSession, OPS_COOKIE, opsPassword, safeEqual, sessionToken } from "@/lib/ops-auth";
import { setActionStatus } from "@/lib/ops-data";

export async function loginAction(formData: FormData) {
  const password = opsPassword();
  const attempt = String(formData.get("password") ?? "");
  if (!password || !safeEqual(attempt, password)) redirect("/ops/login?error=1");

  (await cookies()).set(OPS_COOKIE, sessionToken(password), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  redirect("/ops");
}

export async function logoutAction() {
  (await cookies()).delete(OPS_COOKIE);
  redirect("/ops/login");
}

async function requireSession() {
  if (!isValidSession((await cookies()).get(OPS_COOKIE)?.value)) redirect("/ops/login");
}

export async function decideAction(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  const decision = formData.get("decision");
  if (!id || (decision !== "approved" && decision !== "rejected")) return;
  await setActionStatus(id, decision);
  refresh();
}
