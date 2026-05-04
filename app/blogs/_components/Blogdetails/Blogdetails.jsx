
import Image from 'next/image';
import Link from 'next/link';
import styles from './Blogdetails.module.css';
import { formatImageUrl } from '@/lib/imageUtils';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function BlogDetail({ blog, contentHtml, moreBlogs }) {
  const titleParts = blog.title.split(':');
  const mainTitle = titleParts[0];
  const subTitle = titleParts.slice(1).join(':');

  const heroImageUrl = formatImageUrl(blog.featuredImage?.url);

  return (
    <main className={styles.container}>

      <div className={styles.breadcrumbsHeaderGap}>

        <nav className={styles.Breadcrumbs} aria-label="Breadcrumb">
          <p>
            <Link href="/">Home</Link>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.3446 14.4342L4.39844 13.488L9.8881 7.99833L4.39844 2.50867L5.3446 1.5625L11.7804 7.99833L5.3446 14.4342Z" fill="#818686" />
            </svg>
          </p>
          <p>
            <Link href="/blogs">Blogs</Link>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.3446 14.4342L4.39844 13.488L9.8881 7.99833L4.39844 2.50867L5.3446 1.5625L11.7804 7.99833L5.3446 14.4342Z" fill="#818686" />
            </svg>
          </p>
          <p className={styles.activePage}>{blog.title}</p>
        </nav>
        <div className={styles.headerHeroGap}>
          <header className={styles.header}>
            <h1 className={styles.mainTitle}>
              {mainTitle}{subTitle ? ':' : ''}
              {subTitle && <span className={styles.sourcingSubLine}>{subTitle}</span>}
            </h1>
            <p className={styles.date}>{formatDate(blog.createdAt)}</p>
          </header>

          <div className={styles.heroContentGap}>

            {heroImageUrl && (
              <div className={styles.imageWrapper}>
                <Image
                  src={heroImageUrl}
                  alt={blog.title}
                  className={styles.heroImg}
                  priority
                  width={1200}
                  height={600}
                />
              </div>
            )}

            <div className={styles.Main}>
              <article className={styles.leftColumn}>
                <section className={styles.body}>
                  <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                </section>
              </article>

              <aside className={styles.rightColumn}>
                <h3 className={styles.rightTitle}>Explore more blogs</h3>
                <div className={styles.rightList}>
                  {moreBlogs.map((item) => {
                    const thumbUrl = formatImageUrl(item.featuredImage?.url);
                    return (
                      <Link href={`/blogs/${item.slug}`} key={item.id} className={styles.rightCard}>
                        <div className={styles.rightThumb}>
                          {thumbUrl && (
                            <Image src={thumbUrl} alt={item.title} width={209} height={128} style={{ objectFit: 'cover' }} />
                          )}
                        </div>
                        <div className={styles.sidebarInfo}>
                          <span className={styles.readTime}>{item.readTime ? `${item.readTime} Minutes Read` : '5 Minutes Read'}</span>
                          <p className={styles.sidebarBlogTitle}>{item.title}</p>
                          <span className={styles.sidebarDate}>{formatDate(item.createdAt)}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </aside>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
