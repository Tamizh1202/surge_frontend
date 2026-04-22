import Productone from '@/app/Productdetails/_components/Productone/Productone';
import Producttwo from '@/app/Productdetails/_components/Producttwo/Producttwo';
import Image from '@/app/Productdetails/_components/Image/Image';

export default async function ProductPage({ params }) {
    const { category, slug } = await params;
    const productName = slug ? slug.replace(/-/g, ' ') : "Product";

    return (
        <main>
            <Productone name={productName} category={category} />
            <Producttwo />
            <Image />
        </main>
    );
}
