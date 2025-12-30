import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({
    ok: true,
    now: new Date().toISOString(),
    vercel: {
      commitSha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      commitRef: process.env.VERCEL_GIT_COMMIT_REF ?? null,
      repoSlug: process.env.VERCEL_GIT_REPO_SLUG ?? null,
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID ?? null,
    },
  })
}


