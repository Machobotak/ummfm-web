import ReactMarkdown from "react-markdown";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";

// Allowlist default rehype-sanitize sudah memuat heading, list, tabel GFM, blok
// kode, dan `img` (src hanya http/https). Yang ditambah: `alt`/`title` pada
// gambar — tidak ada di default, dan tanpanya teks alternatif hilang.
const markdownSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    img: [...(defaultSchema.attributes?.img ?? []), "alt", "title"],
  },
};

/**
 * Render Markdown dari CMS. HTML mentah dari editor tidak pernah sampai ke DOM
 * karena seluruh pohon di-sanitize setelah parsing.
 */
export function SafeMarkdown({ children }: { children: string }) {
  return (
    <div className="mt-5 text-lg leading-relaxed text-ink-700 [&_a]:font-semibold [&_a]:text-brand-700 [&_a]:underline-offset-4 [&_a:hover]:text-brand-600 [&_a:hover]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-brand-200 [&_blockquote]:pl-4 [&_blockquote]:text-ink-600 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-brand-50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-base [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink-950 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-ink-950 [&_hr]:my-8 [&_hr]:border-ink-200 [&_img]:my-6 [&_img]:rounded-card [&_li]:mt-2 [&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-5 [&_pre]:mt-5 [&_pre]:overflow-x-auto [&_pre]:rounded-card [&_pre]:bg-ink-950 [&_pre]:p-4 [&_pre]:text-sm [&_pre]:text-white [&_table]:mt-5 [&_table]:w-full [&_table]:border-collapse [&_table]:text-base [&_td]:border [&_td]:border-ink-200 [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-ink-200 [&_th]:bg-brand-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, markdownSchema]]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
