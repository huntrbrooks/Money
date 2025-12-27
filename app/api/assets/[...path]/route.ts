import { NextResponse } from "next/server"
import { getAsset } from "@/lib/assets"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Params = {
  params: { path: string[] }
}

export async function GET(_req: Request, { params }: Params) {
  const objectPath = (params.path ?? []).join("/")
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
}


