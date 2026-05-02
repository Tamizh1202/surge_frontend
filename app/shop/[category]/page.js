import Landing from "./_components/Landing/Landing";
import Listing from "./_components/Listing/Listing";
// import NavigationStrip from "./_components/NavigationStrip/NavigationStrip";

export default async function ShopCategory({ params }) {
  const { category } = await params;

  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://surge-backend-seven.vercel.app';
  let categories = [];
  try {
    const res = await fetch(
      `${apiUrl}/api/web-categories?sort=createdAt&select[slug]=true&depth=0&limit=100`,
      {
        cache: "no-store",
      },
    );

    if (res.ok) {
      const data = await res.json();
      categories = data.docs ?? [];
    }
  } catch (error) {
    console.error("Error fetching categories in ShopCategory:", error);
  }
  const match = categories.find((cat) => cat.slug === category);

  // if (!match) notFound();

  return (
    <>
      <Landing />
      {/* <NavigationStrip /> */}
      <Listing category={match} />
    </>
  );
}
