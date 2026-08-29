import type { APIRoute } from "astro"
import { getSearchIndexData } from "@/lib/page-data"

export const GET: APIRoute = async () => {
  const docs = await getSearchIndexData()

  return new Response(JSON.stringify(docs), {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  })
}
