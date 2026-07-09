import ProductOne from "../_components/Productone/Productone";
import Producttwo from "../_components/Producttwo/Producttwo";
import ImageSection from "../_components/Image/Image";
import YouMayAlsoLike from "../_components/YouMayLike/YouMayAlsoLike";

export default async function ProductPage({ params }) {
  const { slug } = await params;

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://surge-backend-seven.vercel.app';
  let product = null;

  try {
    const res = await fetch(`${serverUrl}/api/web-products?where[slug][equals]=${slug}&depth=2`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Fetch failed:', res.status, errorText);
      throw new Error(`Failed to fetch product: ${res.status}`);
    }

    const data = await res.json();
    product = data.docs?.[0] || null;

    console.log('product keys:', Object.keys(product ?? {}));
    console.log('brewingGuide:', JSON.stringify(product?.brewingGuide, null, 2));

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
  console.log('About to render, product.farmDescription:', product?.farmDescription);
  console.log('product full:', JSON.stringify(product).slice(0, 500));
  return (
    <main style={{ backgroundColor: "#000", minHeight: "100vh", color: "white" }}>
      <ProductOne initialProduct={product} />
      <Producttwo brewingGuide={product.brewingGuide} serverUrl={serverUrl} />
      <ImageSection product={product} />
      <YouMayAlsoLike recommendedProducts={product.recommendedProducts} />
    </main>
  );
}