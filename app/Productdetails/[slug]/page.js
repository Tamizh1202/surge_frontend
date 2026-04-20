
import Productone from "../_components/Productone/Productone";
import Producttwo from "../_components/Producttwo/Producttwo";
import ImageSection from "../_components/Image/Image";

export default async function ProductPage({ params }) {
  // We MUST await params in Next.js 15+
  const { slug } = await params;

  return (
    <main style={{ backgroundColor: "#000", minHeight: "100vh", color: "white" }}>

      <Productone slug={slug} />

      <Producttwo />

      <ImageSection />
    </main>
  );
}