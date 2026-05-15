import Blogs from "./_components/Blogs/Blogs";
import Bettercoffee from "./_components/Bettercoffee/Bettercoffee";

const apiUrl =
  process.env.PAYLOAD_PUBLIC_SERVER_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "https://surge-backend-seven.vercel.app";

function formatImageUrl(image) {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || "";
}

export async function generateMetadata() {
  try {
    const res = await fetch(`${apiUrl}/api/globals/blogs-landing`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.meta) {
        const imageUrl = data.meta.image ? formatImageUrl(data.meta.image) : "";
        return {
          title: data.meta.title || "The Surge Journal | Surge",
          description:
            data.meta.description ||
            "Stay ahead of the curve with specialty coffee stories, expert brew guides, and insider tips — straight from Surge.",
          openGraph: {
            title: data.meta.title || "The Surge Journal | Surge",
            description:
              data.meta.description ||
              "Stay ahead of the curve with specialty coffee stories, expert brew guides, and insider tips — straight from Surge",
            images: imageUrl ? [{ url: imageUrl }] : [],
          },
        };
      }
    }
  } catch (err) {
    console.error("Error fetching blogs landing metadata:", err);
  }

  return {
    title: "The Surge Journal | Surge",
    description:
      "Stay ahead of the curve with specialty coffee stories, expert brew guides, and insider tips — straight from Surge.",
  };
}

export default async function BlogsPage() {
  let blogs = [];
  try {
    const currentTime = new Date().toISOString();
    const query = `where[and][0][_status][equals]=published&where[and][1][or][0][scheduledFor][less_than_equal]=${encodeURIComponent(currentTime)}&where[and][1][or][1][scheduledFor][exists]=false&limit=100&sort=-createdAt`;
    const res = await fetch(`${apiUrl}/api/blogs?${query}`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      blogs = data.docs || [];
    }
  } catch (err) {
    console.error("Error fetching blogs:", err);
  }

  const featuredBlogs = blogs.filter((blog) => blog.isFeatured).slice(0, 3);
  const otherBlogs = blogs.filter(
    (blog) => !featuredBlogs.find((fb) => fb.id === blog.id),
  );

  return (
    <main>
      <Blogs initialBlogs={featuredBlogs} />
      <Bettercoffee blogs={otherBlogs} apiUrl={apiUrl} />
    </main>
  );
}
