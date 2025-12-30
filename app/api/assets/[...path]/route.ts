import { NextResponse } from "next/server"
import { getAsset } from "@/lib/assets"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Params = {
  params: { path: string[] }
}

export async function GET(_req: Request, { params }: Params) {
  const objectPath = (params.path ?? []).join("/")
  try {
    const asset = await getAsset(objectPath)
    if (!asset) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return new NextResponse(asset.bytes, {
      status: 200,
      headers: {
        "Content-Type": asset.contentType,
        "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=86400",
      },
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unable to load asset"
    // Helpful for Vercel logs while still being safe for public error responses.
    console.error("Asset proxy failed", { objectPath, message })
    return NextResponse.json({ error: message, path: objectPath }, { status: 500 })
  }
}


