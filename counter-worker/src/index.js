// Homepage view counter for paulwithers.com.
// One Durable Object holds a single integer plus the date counting started.
// Nothing about the visitor is read or stored: no IP, no user agent, no cookies.
import { DurableObject } from "cloudflare:workers";

// Loads from these origins are counted.
const COUNTED_ORIGINS = new Set(["https://paulwithers.com", "https://www.paulwithers.com"]);
// Local previews can read the count but never add to it.
const ALLOWED_ORIGINS = new Set([...COUNTED_ORIGINS, "http://localhost:8000", "http://127.0.0.1:8000"]);

export class Counter extends DurableObject {
  async read() {
    return {
      count: (await this.ctx.storage.get("count")) ?? 0,
      since: (await this.ctx.storage.get("since")) ?? null,
    };
  }

  async hit() {
    // Durable Object storage calls are serialised, so this increment is atomic.
    let { count, since } = await this.read();
    count += 1;
    if (!since) {
      since = new Date().toISOString();
      await this.ctx.storage.put("since", since);
    }
    await this.ctx.storage.put("count", count);
    return { count, since };
  }
}

function corsHeaders(origin) {
  const h = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    Vary: "Origin",
  };
  if (ALLOWED_ORIGINS.has(origin)) {
    h["Access-Control-Allow-Origin"] = origin;
    h["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
  }
  return h;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin);
    const { pathname } = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (pathname !== "/homepage") return new Response('{"error":"not found"}', { status: 404, headers });

    const stub = env.COUNTER.get(env.COUNTER.idFromName("homepage"));

    if (request.method === "GET") return Response.json(await stub.read(), { headers });

    if (request.method === "POST") {
      // Only count loads from the real site, so other pages and local previews can't inflate it.
      if (!COUNTED_ORIGINS.has(origin)) return Response.json(await stub.read(), { headers });
      return Response.json(await stub.hit(), { headers });
    }

    return new Response('{"error":"method not allowed"}', { status: 405, headers });
  },
};
