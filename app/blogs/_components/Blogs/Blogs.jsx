import styles from './Blogs.module.css';
import Image from "next/image";
import oneImg from './one.png';
import square from './square.png';
import squaretwo from './square2.png';
import squarethree from './square3.png';
export default function Blogs()  {
    return(

         <div className={styles.main}>
      <div className={styles.MainContainer}>
        
       
        <div className={styles.LeftConatiner}>
          <Image
          src={oneImg} 
          alt="Surge Coffee Journey"
          fill
          priority
          className={styles.image}
        />
         </div>


         <div className={styles.RightContainer}>
          <div className={styles.RightContent}>
            
        
    <div className={styles.top}>

  <div className={styles.timeWrapper}>
   <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.0317 19.3129C15.1578 19.3129 19.3133 15.1575 19.3133 10.0315C19.3133 4.90545 15.1578 0.75 10.0317 0.75C4.90554 0.75 0.75 4.90545 0.75 10.0315C0.75 15.1575 4.90554 19.3129 10.0317 19.3129Z" stroke="#818686" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 5.90625V11.0626H14.1565" stroke="#818686" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

    <h3 className={styles.min}>6 min read</h3>
  </div>

  <div className={styles.textGroup}>
    <h1 className={styles.head}>The craft behind every cup:<br /> Inside surge’s coffee journey</h1>
    <p className={styles.description}>
      How we work with producers and partners to bring exceptional coffee to your cup.
    </p>
  </div>
</div>



 <div className={styles.bottom}>
  <h2 className={styles.read}>
    Read More
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.350207 7.7921L7.56828 0.499646M7.56828 0.499646V7.06285M7.56828 0.499646H1.07201" stroke="#C4754E"/>
</svg>

  </h2>

<div className={styles.btn}>
  
    <Image src={square} alt="dot" width={11} height={11} className={styles.dotImg} />
<Image src={squaretwo} alt="dot" width={11} height={11} className={styles.dotImg} />
<Image src={squarethree} alt="dot active" width={11} height={11} className={styles.dotImg} />
  </div>
</div>
              </div>
              </div>
              </div>
         </div>
      )}
    
    