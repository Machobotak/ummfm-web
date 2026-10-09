"use client";

import Link from "next/link";
import { useEffect } from "react";
import { NAV_LINKS } from "@/lib/site";

export function MobileNavigation({
  id,
  open,
  onClose,
}: {
  id: string;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  return (
    <div
      id={id}
      inert={!open}
      aria-hidden={!open}
      className={`overflow-hidden border-t border-border bg-surface transition-[max-height,opacity] duration-200 ease-out md:hidden ${
        open ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <nav aria-label="Navigasi mobile" className="px-4 py-2 sm:px-6">
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className="block rounded-control px-3 py-3 text-base font-semibold text-ink-700 hover:bg-brand-50 hover:text-brand-700"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
