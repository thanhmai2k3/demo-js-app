import { Post } from "@/interfaces/post";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const postsDirectory = join(process.cwd(), "_posts");

const config = require("../../next.config");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // '${basePath' -> config.basePath;
  
  // return { ...data, slug: realSlug, content } as Post;

  // Inject basePath into any matching template strings
  let itemsStr = JSON.stringify({ ...data, slug: realSlug, content });
  itemsStr = itemsStr.replaceAll(/\$\{basePath\}/gi, config.basePath);
  const items = JSON.parse(itemsStr);

  return items as Post;
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
