import Image from 'next/image';
import Link from 'next/link';
import { coffeeData } from '../Bettercoffee/Bettercoffee';
import styles from './Blogdetails.module.css';

export default function BlogDetail({ slug }) {
  const blog = coffeeData.find((item) => item.slug === slug);
  const moreBlogs = coffeeData.filter((item) => item.slug !== slug).slice(0, 3);

  if (!blog) return null;
const [mainTitle, subTitle] = blog.title.split(':');
  return (
   <main className={styles.container}>
    
      <div className={styles.breadcrumbsHeaderGap}>
        
        <nav className={styles.Breadcrumbs} aria-label="Breadcrumb">
          <p>
            <Link href="/">Home</Link>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.3446 14.4342L4.39844 13.488L9.8881 7.99833L4.39844 2.50867L5.3446 1.5625L11.7804 7.99833L5.3446 14.4342Z" fill="#818686"/>
            </svg>
          </p> 
          <p>
            <Link href="/blogs">Blogs</Link>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.3446 14.4342L4.39844 13.488L9.8881 7.99833L4.39844 2.50867L5.3446 1.5625L11.7804 7.99833L5.3446 14.4342Z" fill="#818686"/>
            </svg>
          </p>
          <p className={styles.activePage}>{blog.title}</p>
        </nav>

       
        <div className={styles.headerHeroGap}>
          
          <header className={styles.header}>
            <h1 className={styles.mainTitle}>
              {mainTitle}:
              {subTitle && <span className={styles.sourcingSubLine}>{subTitle}</span>}
            </h1>
            <p className={styles.date}>{blog.date || "Oct 25, 2025"}</p>
          </header>

       



          <div className={styles.heroContentGap}>
            
            <div className={styles.imageWrapper}>
               <Image 
      src={blog.img} 
      alt={blog.title} 
      className={styles.heroImg}
      priority 
      width={1200}
      height={600}
    />
            </div>





            <div className={styles.Main}>
              <article className={styles.leftColumn}>
                <section className={styles.body}>
                  <h2 className={styles.sectionTitle}>What is Natural Processing?</h2>
                  <p className={styles.text}>
               Natural processing, also known as dry processing, is the oldest method of preparing coffee beans. Unlike washed coffee, where the fruit is removed immediately after harvest, natural process coffee is dried with the cherry still intact around the bean. <br />

Imagine leaving a grape in the sun until it becomes a raisin thats essentially whats happening to coffee cherries during natural processing. The beans rest inside the fruit for weeks, absorbing sugars and developing complex flavor compounds that will later emerge in your cup. <br/>
Walk into any specialty coffee shop today, and youll likely encounter tasting notes that read more like a fruit basket than a morning beverage: bright strawberry,juicy blueberry,tropical mango . But these fruity flavors don t come from added ingredients—they re the natural result of how coffee cherries are processed after harvest. <br/>
                  </p>
                  <div className={styles.inlineImage}>

                    <Image src={blog.img} alt="Coffee beans drying" width={910} height={346} />
                  </div>

                  
                 <p className={styles.text}>
    In the world of specialty coffee, the flavors in your cup are shaped long before 
    the roasting process begins. One of the most fascinating contributors to these 
    flavors is the natural processing method, often responsible for the vibrant 
    fruity notes found in many coffees. Unlike washed coffees, where the fruit is 
    removed before drying, natural processing keeps the coffee cherry intact while 
    the bean dries inside it. Freshly harvested cherries are spread across raised 
    beds or patios and left to dry under the sun for several weeks. During this 
    time, the sugars and compounds from the fruit slowly interact with the beans inside.
  </p>

  <p className={styles.text}>
    This extended contact between the coffee bean and its surrounding fruit is what 
    gives naturally processed coffees their distinct sweetness and fruit-forward profile. 
    Depending on the region and variety, you may notice notes of berries, tropical 
    fruits, dried fruit, or even wine-like characteristics.
  </p>


  <p className={styles.text}>
      However, natural processing is also one of the most challenging techniques for 
    producers. Farmers must carefully monitor temperature, humidity, and airflow 
    during drying. If the cherries ferment too quickly or unevenly, the coffee can 
    develop unwanted flavors. When executed well, though, the result is a cup that 
    feels lively, complex, and deeply expressive of its origin.
    For coffee lovers, naturally processed beans offer an entirely different tasting 
    experience. They tend to be full-bodied, aromatic, and intensely flavorful, 
    making them perfect for adventurous drinkers looking to explore beyond traditional 
    profiles. So the next time your coffee surprises you with hints of strawberry, 
    mango, or ripe blueberry, there’s a good chance you’re tasting the magic of the 
    natural process—where the fruit truly becomes part of the story.
  </p>
                  <h2 className={styles.sectionTitle}>Challenges in Processing</h2>



                <p className={styles.text}>
    Natural processing requires careful attention and ideal conditions. The drying 
    period typically takes 3-4 weeks, during which farmers must constantly turn the 
    cherries to ensure even drying and prevent mold or over-fermentation.  <br/>
    Climate plays a crucial role. Regions with consistent sunshine and low 
    humidity—like parts of Ethiopia, Brazil, and Yemen—are ideal for natural 
    processing. Too much moisture can lead to defects, while insufficient airflow 
    can cause uneven fermentation. <br />

       In the world of specialty coffee, the flavors in your cup are shaped long before 
    the roasting process begins. One of the most fascinating contributors to these 
    flavors is the natural processing method, often responsible for the vibrant 
    fruity notes found in many coffees. Unlike washed coffees, where the fruit is 
    removed before drying, natural processing keeps the coffee cherry intact while 
    the bean dries inside it. Freshly harvested cherries are spread across raised 
    beds or patios and left to dry under the sun for several weeks. During this 
    time, the sugars and compounds from the fruit slowly interact with the beans inside.
  </p>


 
  

  <p className={styles.text}>
    This extended contact between the coffee bean and its surrounding fruit is what 
    gives naturally processed coffees their distinct sweetness and fruit-forward profile. 
    Depending on the region and variety, you may notice notes of berries, tropical 
    fruits, dried fruit, or even wine-like characteristics.
  </p>

  <p className={styles.text}>
    However, natural processing is also one of the most challenging techniques for 
    producers. Farmers must carefully monitor temperature, humidity, and airflow 
    during drying. If the cherries ferment too quickly or unevenly, the coffee can 
    develop unwanted flavors. When executed well, though, the result is a cup that 
    feels lively, complex, and deeply expressive of its origin. 
  </p>

  <p className={styles.text}>
    For coffee lovers, naturally processed beans offer an entirely different tasting 
    experience. They tend to be full-bodied, aromatic, and intensely flavorful, 
    making them perfect for adventurous drinkers looking to explore beyond traditional 
    profiles. So the next time your coffee surprises you with hints of strawberry, 
    mango, or ripe blueberry, there’s a good chance you’re tasting the magic of the 
    natural process—where the fruit truly becomes part of the story.
  </p>
                </section>
              </article>

              <aside className={styles.rightColumn}>
                <h3 className={styles.rightTitle}>Explore more blogs</h3>
                <div className={styles.rightList}>
                  {moreBlogs.map((item) => (
                    <Link href={`/blog/${item.slug}`} key={item.id} className={styles.rightCard}>
                      <div className={styles.rightThumb}>
                        <Image src={item.img} alt={item.title} width={209} height={128} style={{objectFit: 'cover'}} />
                      </div>
                      
                      <div className={styles.sidebarInfo}>
                        <span className={styles.readTime}>5 Minutes Read</span>
                        <p className={styles.sidebarBlogTitle}>{item.title}</p>
                       <span className={styles.sidebarDate}>{item.date || "Oct 23, 2024"}</span>
                        
                      </div>
                    </Link>
                  ))}
                </div>
              
              </aside>
            </div>

          </div> 
        </div> 
      </div> 
    </main>
  );
}