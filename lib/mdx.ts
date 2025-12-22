import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import { hasKv, kvGet, kvScanKeys } from "@/lib/kv"

const CONTENT_DIR = path.join(process.cwd(), "content")
const POSTS_DIR = path.join(CONTENT_DIR, "posts")
const VIDEOS_DIR = path.join(CONTENT_DIR, "videos")

const KV_POST_PREFIX = "content:posts:"
const KV_VIDEO_PREFIX = "content:videos:"

export type PostMeta = {
  title: string
  description: string
  date: string
  slug: string
  tags?: string[]
  coverImage?: string
}

export type VideoMeta = {
  title: string
  description: string
  date: string
  slug: string
  videoUrl: string
  platform?: string
  duration?: string
  tags?: string[]
}

async function readDirSafe(dir: string) {
  try {
    return await fs.readdir(dir)
  } catch {
    return []
  }
}

function sortByDateDescending<T extends { date: string }>(entries: T[]) {
  return entries.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getAllPostsMeta(): Promise<PostMeta[]> {
  const files = await readDirSafe(POSTS_DIR)
  const fsMetas: PostMeta[] = []
  for (const file of files.filter((file) => file.endsWith(".mdx"))) {
    const filePath = path.join(POSTS_DIR, file)
    const source = await fs.readFile(filePath, "utf8")
    const { data } = matter(source)
    const slug = (data.slug as string) ?? file.replace(/\.mdx$/, "")
    fsMetas.push({
      title: data.title as string,
      description: data.description as string,
      date: data.date as string,
      slug,
      tags: data.tags as string[] | undefined,
      coverImage: data.coverImage as string | undefined,
    })
  }

  if (!hasKv()) return sortByDateDescending(fsMetas)

  let kvMetas: PostMeta[] = []
  try {
    const kvKeys = await kvScanKeys(`${KV_POST_PREFIX}*`)
    const kvSources = await Promise.all(kvKeys.map(async (key) => ({ key, source: await kvGet(key) })))
    kvMetas = []
    for (const entry of kvSources) {
      if (!entry.source) continue
      const { data } = matter(entry.source)
      const slug = (data.slug as string) ?? entry.key.slice(KV_POST_PREFIX.length)
      kvMetas.push({
        title: data.title as string,
        description: data.description as string,
        date: data.date as string,
        slug,
        tags: data.tags as string[] | undefined,
        coverImage: data.coverImage as string | undefined,
      })
    }
  } catch {
    kvMetas = []
  }

  // KV overrides filesystem by slug
  const bySlug = new Map<string, PostMeta>()
  for (const m of fsMetas) bySlug.set(m.slug, m)
  for (const m of kvMetas) bySlug.set(m.slug, m)
  return sortByDateDescending(Array.from(bySlug.values()))
}

export async function getPostBySlug(slug: string) {
  if (hasKv()) {
    try {
      const kvSource = await kvGet(`${KV_POST_PREFIX}${slug}`)
      if (kvSource) {
        const { content, frontmatter } = await compileMDX<PostMeta>({
          source: kvSource,
          options: {
            parseFrontmatter: true,
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
            },
          },
        })
        return {
          content,
          frontmatter: {
            ...frontmatter,
            slug: frontmatter.slug ?? slug,
          },
        }
      }
    } catch {
      // fall back to filesystem content
    }
  }

  const filePath = path.join(POSTS_DIR, `${slug}.mdx`)
  try {
    const source = await fs.readFile(filePath, "utf8")
    const { content, frontmatter } = await compileMDX<PostMeta>({
      source,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
        },
      },
    })
    return {
      content,
      frontmatter: {
        ...frontmatter,
        slug: frontmatter.slug ?? slug,
      },
    }
  } catch {
    return null
  }
}

export async function getAllVideosMeta(): Promise<VideoMeta[]> {
  const files = await readDirSafe(VIDEOS_DIR)
  const fsMetas: VideoMeta[] = []
  for (const file of files.filter((file) => file.endsWith(".mdx"))) {
    const filePath = path.join(VIDEOS_DIR, file)
    const source = await fs.readFile(filePath, "utf8")
    const { data } = matter(source)
    const slug = (data.slug as string) ?? file.replace(/\.mdx$/, "")
    fsMetas.push({
      title: data.title as string,
      description: data.description as string,
      date: data.date as string,
      slug,
      videoUrl: data.videoUrl as string,
      platform: data.platform as string | undefined,
      duration: data.duration as string | undefined,
      tags: data.tags as string[] | undefined,
    })
  }

  if (!hasKv()) return sortByDateDescending(fsMetas)

  let kvMetas: VideoMeta[] = []
  try {
    const kvKeys = await kvScanKeys(`${KV_VIDEO_PREFIX}*`)
    const kvSources = await Promise.all(kvKeys.map(async (key) => ({ key, source: await kvGet(key) })))
    kvMetas = []
    for (const entry of kvSources) {
      if (!entry.source) continue
      const { data } = matter(entry.source)
      const slug = (data.slug as string) ?? entry.key.slice(KV_VIDEO_PREFIX.length)
      kvMetas.push({
        title: data.title as string,
        description: data.description as string,
        date: data.date as string,
        slug,
        videoUrl: data.videoUrl as string,
        platform: data.platform as string | undefined,
        duration: data.duration as string | undefined,
        tags: data.tags as string[] | undefined,
      })
    }
  } catch {
    kvMetas = []
  }

  const bySlug = new Map<string, VideoMeta>()
  for (const m of fsMetas) bySlug.set(m.slug, m)
  for (const m of kvMetas) bySlug.set(m.slug, m)
  return sortByDateDescending(Array.from(bySlug.values()))
}

export async function getVideoBySlug(slug: string) {
  if (hasKv()) {
    try {
      const kvSource = await kvGet(`${KV_VIDEO_PREFIX}${slug}`)
      if (kvSource) {
        const { content, frontmatter } = await compileMDX<VideoMeta>({
          source: kvSource,
          options: {
            parseFrontmatter: true,
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          },
        })
        return {
          content,
          frontmatter: {
            ...frontmatter,
            slug: frontmatter.slug ?? slug,
          },
        }
      }
    } catch {
      // fall back to filesystem content
    }
  }

  const filePath = path.join(VIDEOS_DIR, `${slug}.mdx`)
  try {
    const source = await fs.readFile(filePath, "utf8")
    const { content, frontmatter } = await compileMDX<VideoMeta>({
      source,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      },
    })
    return {
      content,
      frontmatter: {
        ...frontmatter,
        slug: frontmatter.slug ?? slug,
      },
    }
  } catch {
    return null
  }
}

