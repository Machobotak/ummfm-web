import { connection, NextResponse } from "next/server";
import { getLiveMessages } from "@/lib/content";

/**
 * Sumber polling live chat (klien memanggilnya tiap 10 detik). `connection()`
 * memastikan handler ini selalu dirender saat request: dengan `cacheComponents`
 * GET route handler ikut model PPR, dan `export const dynamic` tidak lagi
 * berlaku di rilis ini.
 */
export async function GET() {
  await connection();
  const messages = await getLiveMessages();

  return NextResponse.json({ messages }, { headers: { "cache-control": "no-store" } });
}
