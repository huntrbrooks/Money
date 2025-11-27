import { SITE_URL } from "@/lib/seo"
import { getAllPostsMeta } from "@/lib/mdx"

export async function GET() {
  const posts = await getAllPostsMeta()
  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid>${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.description}]]></description>
    </item>
  `,
    )
    .join("")

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title><![CDATA[Financial Abuse Therapist — Articles]]></title>
    <link>${SITE_URL}/blog</link>
    <description><![CDATA[Articles by Dan Lobel on financial abuse recovery and monetary psychotherapy.]]></description>
    ${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=600, stale-while-revalidate",
    },
  })
}

