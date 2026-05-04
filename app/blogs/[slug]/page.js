import { notFound } from 'next/navigation';
import { lexicalToHtml } from '@/lib/lexicalToHtml';
import BlogDetail from '../_components/Blogdetails/Blogdetails';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export default async function Page({ params }) {
  // 1. Params ko safe tareeke se fetch karein
  const { slug } = await params;

  const [blogRes, moreRes] = await Promise.all([
    fetch(
      `${API_URL}/api/blogs?where[slug][equals]=${encodeURIComponent(slug)}&depth=1&limit=1`,
      { cache: 'no-store' }
    ),
    fetch(`${API_URL}/api/blogs?sort=-createdAt&limit=4`, { cache: 'no-store' }),
  ]);

  if (!blogRes.ok) return notFound();

  const blogData = await blogRes.json();
  const blog = blogData.docs?.[0];

  if (!blog) return notFound();

  const moreData = moreRes.ok ? await moreRes.json() : { docs: [] };
  const moreBlogs = (moreData.docs || [])
    .filter((b) => b.slug !== slug)
    .slice(0, 3);

  let contentHtml = '';
  try {
    if (blog.content) {
      contentHtml = lexicalToHtml(blog.content);
    }
  } catch {
    contentHtml = '';
  }

  return <BlogDetail blog={blog} contentHtml={contentHtml} moreBlogs={moreBlogs} />;
}
