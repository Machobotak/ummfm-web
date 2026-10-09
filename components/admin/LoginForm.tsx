"use client";

import { useActionState } from "react";
import { ErrorState } from "@/components/ui/ErrorState";
import { login } from "@/lib/actions/auth";
import { EMPTY_ACTION_RESULT } from "@/lib/actions/result";
import { FormField, inputClass } from "./FormField";
import { SubmitButton } from "./SubmitButton";

export function LoginForm({ isConfigured }: { isConfigured: boolean }) {
  const [state, formAction] = useActionState(login, EMPTY_ACTION_RESULT);
  const errors = state.ok ? {} : state.errors;

  return (
    <form
      action={formAction}
      className="mt-6 flex flex-col gap-5 rounded-card border border-border bg-surface p-6 shadow-card"
    >
      {isConfigured ? null : (
        <p role="status" className="rounded-control bg-warning/10 px-4 py-3 text-sm text-warning">
          Supabase belum dikonfigurasi. Isi <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, dan <code>SUPABASE_SERVICE_ROLE_KEY</code> di{" "}
          <code>.env.local</code> lalu jalankan ulang server.
        </p>
      )}

      {errors.form ? <ErrorState message={errors.form} /> : null}

      <FormField label="Email" htmlFor="email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(errors.email)}
          className={inputClass(errors.email)}
        />
      </FormField>

      <FormField label="Kata sandi" htmlFor="password" error={errors.password}>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(errors.password)}
          className={inputClass(errors.password)}
        />
      </FormField>

      <SubmitButton label="Masuk" pendingLabel="Memeriksa…" className="w-full" />
    </form>
  );
}
