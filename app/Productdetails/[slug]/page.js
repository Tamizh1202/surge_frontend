import ProductOne from "../_components/Productone/Productone";
import Producttwo from "../_components/Producttwo/Producttwo";
import ImageSection from "../_components/Image/Image";
import YouMayAlsoLike from "../_components/YouMayLike/YouMayAlsoLike";

export default async function ProductPage({ params }) {
  const { slug } = await params;

  // Fetch product data from Payload CMS
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
  let product = null;

  try {
    const res = await fetch(`${serverUrl}/api/products?where[slug][equals]=${slug}`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    const data = await res.json();
    product = data.docs?.[0] || null;
  } catch (error) {
    console.error("Error fetching product:", error);
  }

  if (!product) {
    return (
      <main style={{ backgroundColor: "#000", minHeight: "100vh", color: "white", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1>Product not found</h1>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "#000", minHeight: "100vh", color: "white" }}>
      <ProductOne initialProduct={product} />
      <Producttwo />
      <ImageSection />
      <YouMayAlsoLike recommendedProducts={product.recommendedProducts} />
    </main>
  );
}