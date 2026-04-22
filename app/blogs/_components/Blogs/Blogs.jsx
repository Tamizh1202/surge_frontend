"use client";
import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from "next/image";
import styles from './Blogs.module.css';


// Assets
import oneImg from './one.png';
import square from './square.png';
import squaretwo from './square2.png';
import squarethree from './square3.png';


const BlogData = [
  {
    id: 1,

    image: oneImg,
    readTime: "6 min read",
    title: <>The craft behind every cup:<br /> Inside surge’s coffee journey</>,
    description: "How we work with producers and partners to bring exceptional coffee to your cup."
  },
  {
    id: 2,

    image: oneImg,
    readTime: "4 min read",
    title: <>Ethical Sourcing:<br /> Beyond the Bean</>,
    description: "Discover our commitment to sustainable farming and direct trade relationships."
  },
  {
    id: 3,

    image: oneImg,
    readTime: "5 min read",
    title: <>Roasting Mastery:<br /> Science meets Art</>,
    description: "A look inside our roasting process and how we dial in the perfect profile."
  }
];

export default function Blogs() {
  const autoplayOptions = { delay: 3000, stopOnInteraction: false };
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 50, align: 'start' }, [Autoplay(autoplayOptions)]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  return (
    <div className={styles.main}>
      <div className={styles.embla} ref={emblaRef}>
        <div className={styles.embla__container}>
          {/* FIX: Yahan 'BlogData' use karein, 'BLOG_DATA' nahi */}
          {BlogData.map((blog) => (
            <div className={styles.embla__slide} key={blog.id}>
              <div className={styles.MainContainer}>

                <div className={styles.LeftConatiner}>
                  <Image
                    src={blog.image}
                    alt="Coffee Journey"
                    fill
                    priority
                    className={styles.image}
                  />
                </div>

                <div className={styles.RightContainer}>
                  <div className={styles.RightContent}>
                    <div className={styles.top}>
                      <div className={styles.timeWrapper}>
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                          <path d="M10.0317 19.3129C15.1578 19.3129 19.3133 15.1575 19.3133 10.0315C19.3133 4.90545 15.1578 0.75 10.0317 0.75C4.90554 0.75 0.75 4.90545 0.75 10.0315C0.75 15.1575 4.90554 19.3129 10.0317 19.3129Z" stroke="#818686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9 5.90625V11.0626H14.1565" stroke="#818686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h3 className={styles.min}>{blog.readTime}</h3>
                      </div>

                      <div className={styles.textGroup}>
                        <h1 className={styles.head}>{blog.title}</h1>
                        <p className={styles.description}>{blog.description}</p>
                      </div>
                    </div>

                    <div className={styles.bottom}>

                      <h2 className={styles.read}>
                        Read More
                        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                          <path d="M0.350207 7.7921L7.56828 0.499646M7.56828 0.499646V7.06285M7.56828 0.499646H1.07201" stroke="#C4754E" />
                        </svg>
                      </h2>


                      <div className={styles.btn}>
                        {/* FIX: Yahan bhi 'BlogData' map karein */}
                        {BlogData.map((_, i) => {
                          const imageSource = i === selectedIndex ? squarethree : (i === 1 ? squaretwo : square);
                          return (
                            <Image
                              key={i}
                              src={imageSource}
                              alt={`navigation dot ${i + 1}`}
                              width={11}
                              height={11}
                              className={styles.dotImg}
                              onClick={() => scrollTo(i)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}