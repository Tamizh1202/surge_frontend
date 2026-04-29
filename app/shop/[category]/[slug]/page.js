import Productone from "@/app/Productdetails/_components/Productone/Productone";
import Image from "@/app/Productdetails/_components/Image/Image";
import { redirect } from "next/navigation";
import Producttwo from "../../../Productdetails/_components/Producttwo/Producttwo";
import YouMayAlsoLike from "../../../Productdetails/_components/YouMayLike/YouMayAlsoLike";

export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  const selectedCategory = category?.trim().toLowerCase();
  const selectedSlug = slug?.trim().toLowerCase();

  if (!selectedSlug) {
    return {
      title: "Product Not Found | Surge",
    };
  }

  try {
    const response = await fetch(
      `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/web-products?where[and][0][slug][equals]=${selectedSlug}&where[and][1][_status][equals]=published&where[and][2][categories.slug][equals]=${selectedCategory}&depth=2`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      },
    );

    if (response.ok) {
      const json = await response.json();
      const product = json.docs?.[0] || null;

      if (product) {
        return {
          title: product.meta?.title || product.name || "Surge",
          description: product.meta?.description || product.description || "",
        };
      }
    }
  } catch (err) {
    console.error("Error fetching product meta:", err);
  }

  return {
    title: "Surge Product",
  };
}

export default async function ProductDetailPage({ params }) {
  const { category, slug } = await params;
  const selectedCategory = category.trim().toLowerCase();
  const selectedSlug = slug.trim().toLowerCase();

  let product = null;

  try {
    const response = await fetch(
      `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/web-products?where[and][0][slug][equals]=${selectedSlug}&where[and][1][_status][equals]=published&where[and][2][categories.slug][equals]=${selectedCategory}&depth=2`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    product = json.docs?.[0] || null;

    if (!product) {
      console.warn(`Product not found for slug: ${selectedSlug}`);
      redirect("/shop");
    }
  } catch (err) {
    console.error("Error fetching product:", err);
    redirect("/shop");
  }

  return (
    <main>
      <Productone initialProduct={product} />
      <Producttwo />
      <Image />
      <YouMayAlsoLike />
    </main>
  );
}
