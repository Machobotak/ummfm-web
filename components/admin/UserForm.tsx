"use client";

import { useActionState } from "react";
import { ErrorState } from "@/components/ui/ErrorState";
import { EMPTY_ACTION_RESULT } from "@/lib/actions/result";
import { createUser, setUserActive, setUserRole } from "@/lib/actions/users";
import type { Profile, UserRole } from "@/lib/types";
import { FormCheckbox, FormField, inputClass } from "./FormField";
import { SubmitButton } from "./SubmitButton";

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
];

/** Form akun CMS baru: akun Supabase Auth plus baris profilnya. */
export function UserForm() {
  const [state, formAction] = useActionState(createUser, EMPTY_ACTION_RESULT);
  const errors = state.ok ? {} : state.errors;

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-card border border-border bg-surface p-5"
    >
      <h2 className="text-lg font-semibold">Tambah pengguna</h2>
      {errors.form ? <ErrorState message={errors.form} /> : null}

      <FormField
        label="Email"
        htmlFor="user-email"
        error={errors.email}
        hint="Dipakai untuk masuk ke CMS."
      >
        <input
          id="user-email"
          name="email"
          type="email"
          autoComplete="off"
          aria-invalid={Boolean(errors.email)}
          className={inputClass(errors.email)}
        />
      </FormField>

      <FormField
        label="Kata sandi"
        htmlFor="user-password"
        error={errors.password}
        hint="Minimal 8 karakter. Sampaikan sendiri ke pemilik akun; tidak ada email verifikasi."
      >
        <input
          id="user-password"
          name="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          className={inputClass(errors.password)}
        />
      </FormField>

      <FormField
        label="Nama tampilan"
        htmlFor="user-display-name"
        error={errors.displayName}
        hint="Muncul di sidebar CMS."
      >
        <input
          id="user-display-name"
          name="displayName"
          aria-invalid={Boolean(errors.displayName)}
          className={inputClass(errors.displayName)}
        />
      </FormField>

      <FormField
        label="Role"
        htmlFor="user-role"
        error={errors.role}
        hint="Editor mengelola konten tanpa akses menu Pengguna."
      >
        <select
          id="user-role"
          name="role"
          defaultValue="editor"
          className={inputClass(errors.role)}
        >
          {ROLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <div>
        <SubmitButton label="Tambah pengguna" />
      </div>
    </form>
  );
}

/**
 * Pengubah role satu baris. Form terpisah dari status supaya admin bisa
 * menyimpan role tanpa ikut mengirim perubahan status (dan sebaliknya).
 */
export function UserRoleForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState(setUserRole, EMPTY_ACTION_RESULT);
  const errors = state.ok ? {} : state.errors;

  return (
    <form action={formAction} className="flex flex-col gap-1.5">
      {errors.form ? <ErrorState message={errors.form} /> : null}
      <div className="flex items-end gap-2">
        <input type="hidden" name="id" value={profile.id} />
        <div className="w-36">
          <FormField
            label="Role"
            htmlFor={`user-role-${profile.id}`}
            error={errors.role}
          >
            <select
              id={`user-role-${profile.id}`}
              name="role"
              defaultValue={profile.role}
              aria-invalid={Boolean(errors.role)}
              className={inputClass(errors.role)}
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <SubmitButton label="Simpan" variant="secondary" />
      </div>
    </form>
  );
}

/** Pengubah status aktif satu baris lewat checkbox (tidak dicentang = nonaktif). */
export function UserActiveForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState(setUserActive, EMPTY_ACTION_RESULT);
  const errors = state.ok ? {} : state.errors;

  return (
    <form action={formAction} className="flex flex-col gap-1.5">
      {errors.form ? <ErrorState message={errors.form} /> : null}
      <div className="flex items-end gap-2">
        <input type="hidden" name="id" value={profile.id} />
        <FormCheckbox label="Aktif" name="isActive" defaultChecked={profile.isActive} />
        <SubmitButton label="Simpan" variant="secondary" />
      </div>
    </form>
  );
}
