import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"

const CONTENT_DIR = path.join(process.cwd(), "content")
const POSTS_DIR = path.join(CONTENT_DIR, "posts")
const VIDEOS_DIR = path.join(CONTENT_DIR, "videos")

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
  const metas: PostMeta[] = []
  for (const file of files.filter((file) => file.endsWith(".mdx"))) {
    const filePath = path.join(POSTS_DIR, file)
    const source = await fs.readFile(filePath, "utf8")
    const { data } = matter(source)
    const slug = (data.slug as string) ?? file.replace(/\.mdx$/, "")
    metas.push({
      title: data.title as string,
      description: data.description as string,
      date: data.date as string,
      slug,
      tags: data.tags as string[] | undefined,
      coverImage: data.coverImage as string | undefined,
    })
  }
  return sortByDateDescending(metas)
}

export async function getPostBySlug(slug: string) {
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
  const metas: VideoMeta[] = []
  for (const file of files.filter((file) => file.endsWith(".mdx"))) {
    const filePath = path.join(VIDEOS_DIR, file)
    const source = await fs.readFile(filePath, "utf8")
    const { data } = matter(source)
    const slug = (data.slug as string) ?? file.replace(/\.mdx$/, "")
    metas.push({
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
  return sortByDateDescending(metas)
}

export async function getVideoBySlug(slug: string) {
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

