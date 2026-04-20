import { coffeeData } from '../_components/Bettercoffee/Bettercoffee';
import BlogDetail from '../_components/Blogdetails/Blogdetails';

export default async function Page({ params }) {
 
  const { slug } = await params;

  const blog = coffeeData.find((item) => item.slug === slug);

 
  if (!blog) {
    return (
      <div style={{ padding: '100px' }}>
        <p> slug: <b>{slug}</b></p>
        <p>Data mein pehla slug: <b>{coffeeData[0].slug}</b></p>
      </div>
    );
  }

  return <BlogDetail slug={slug} />   

  ;
}