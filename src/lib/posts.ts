import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";

export interface PostFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverImage: string;
  readTime: string;
  featured: boolean;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  contentHtml: string;
}

export interface PostSummary {
  slug: string;
  frontmatter: PostFrontmatter;
}

export interface CategoryCount {
  name: string;
  count: number;
}

export interface TagCount {
  name: string;
  count: number;
}

const postsDirectory = path.join(process.cwd(), "src/content/posts");

function getMarkdownFiles(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));
}

function parsePostFile(fileName: string): { slug: string; frontmatter: PostFrontmatter; content: string } {
  const filePath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const slug = fileName.replace(/\.mdx?$/, "");

  const frontmatter: PostFrontmatter = {
    title: data.title || "Sem título",
    date: data.date || "",
    excerpt: data.excerpt || "",
    category: data.category || "Geral",
    tags: Array.isArray(data.tags) ? data.tags : [],
    coverImage: data.coverImage || "",
    readTime: data.readTime || "5 min",
    featured: Boolean(data.featured),
  };

  return { slug, frontmatter, content };
}

export function getAllPosts(): PostSummary[] {
  const files = getMarkdownFiles();
  const posts = files
    .map((fileName) => {
      const { slug, frontmatter } = parsePostFile(fileName);
      return { slug, frontmatter };
    })
    .sort((a, b) => (a.frontmatter.date > b.frontmatter.date ? -1 : 1));

  return posts;
}

export function getFeaturedPosts(): PostSummary[] {
  return getAllPosts().filter((post) => post.frontmatter.featured).slice(0, 2);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const files = getMarkdownFiles();
  const fileName = files.find((f) => f.replace(/\.mdx?$/, "") === slug);

  if (!fileName) return null;

  const { slug: postSlug, frontmatter, content } = parsePostFile(fileName);

  const processedContent = await remark().use(remarkGfm).use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug: postSlug,
    frontmatter,
    contentHtml,
  };
}

export function getPostsByCategory(category: string): PostSummary[] {
  return getAllPosts().filter(
    (post) => post.frontmatter.category.toLowerCase() === category.toLowerCase()
  );
}

export function getAllCategories(): CategoryCount[] {
  const posts = getAllPosts();
  const categoryMap = new Map<string, number>();

  posts.forEach((post) => {
    const cat = post.frontmatter.category;
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
  });

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllTags(): TagCount[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();

  posts.forEach((post) => {
    post.frontmatter.tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
