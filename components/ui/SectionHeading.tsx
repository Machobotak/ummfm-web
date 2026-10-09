import Link from "next/link";

export function SectionHeading({
  title,
  description,
  href,
  linkLabel = "Lihat Semua",
  as: Heading = "h2",
}: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 sm:mb-8">
      <div>
        <Heading className="text-2xl font-bold sm:text-[28px] lg:text-[32px]">{title}</Heading>
        {description ? (
          <p className="mt-2 max-w-[720px] text-base text-ink-700">{description}</p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-700 underline-offset-4 hover:text-brand-600 hover:underline"
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
