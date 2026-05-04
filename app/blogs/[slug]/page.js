import { coffeeData } from "../_components/Bettercoffee/Bettercoffee";
import BlogDetail from "../_components/Blogdetails/Blogdetails";

export default async function Page({ params }) {
  // 1. Params ko safe tareeke se fetch karein
  const { slug } = await params;

  // 2. Extra Safety: Check karein coffeeData exist karta hai aur array hai
  if (!Array.isArray(coffeeData)) {
    return <div>Error: coffeeData array nahi hai! Check your import.</div>;
  }

  // 3. Finding the blog
  const blog = coffeeData.find((item) => item.slug === slug);

  if (!blog) {
    return (
      <div style={{ padding: "100px" }}>
        <h3>Blog Not Found!</h3>
        <p>Aapne search kiya: <b>{slug}</b></p>
        <p>Available slugs in data: {coffeeData.map(c => c.slug).join(", ")}</p>
      </div>
    );
  }

  return <BlogDetail slug={slug} />;
}