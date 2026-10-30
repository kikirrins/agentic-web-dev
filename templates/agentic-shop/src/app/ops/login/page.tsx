import { Suspense } from "react";
import { loginAction } from "../actions";

export default function LoginPage({ searchParams }: PageProps<"/ops/login">) {
  return (
    <div className="mx-auto max-w-sm rounded-lg bg-white p-6">
      <h1 className="text-xl font-semibold">Panel del dueño</h1>
      <p className="mt-1 text-sm text-neutral-500">Escribe la contraseña de operaciones.</p>
      <Suspense>
        <LoginError searchParams={searchParams} />
      </Suspense>
      <form action={loginAction} className="mt-4 space-y-3">
        <label className="block text-sm" htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded border border-neutral-300 px-3 py-2"
        />
        <button type="submit" className="w-full rounded bg-neutral-900 px-4 py-2 text-white">
          Entrar
        </button>
      </form>
    </div>
  );
}

async function LoginError({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { error } = await searchParams;
  if (!error) return null;
  return <p className="mt-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">Contraseña incorrecta o no configurada.</p>;
}
