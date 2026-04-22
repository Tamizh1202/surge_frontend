import Landing from "./_components/Landing/Landing";
import Listing from "./_components/Listing/Listing";
import NavigationStrip from "./_components/NavigationStrip/NavigationStrip";

export default async function ShopCategory({ params }) {
    const { category } = await params;

    console.log(category)

    return (
        <>
            <Landing category={category} />
            {/* <NavigationStrip /> */}
            <Listing category={category} />
        </>
    );
}