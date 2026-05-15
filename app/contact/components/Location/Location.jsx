import Image from "next/image";
import styles from './Loation.module.css';
import mapImage from './location.webp';
import markerIcon from './map.png'; 

export default function Location() {
  const locations = [
    { name: "Bin Sougat Centre", area: "Rashidiya, Dubai", top: "42%", left: "38%" },
    { name: "Emarat Station", area: "Al Khawaneej, Dubai", top: "52%", left: "48%" },
    { name: "Last Exit", area: "Al Khawaneej, Dubai", top: "68%", left: "36%" },
  ];

  const jobs = [
    { id: 1, title: "Barista", desc: "Full-time position for experienced baristas" },
    { id: 2, title: "Barista", desc: "Full-time position for experienced baristas" },
    { id: 3, title: "Barista", desc: "Full-time position for experienced baristas" },
    { id: 4, title: "Barista", desc: "Full-time position for experienced baristas" }
  ];

  return (
    <div className={styles.container}>
      <section className={styles.topSection}>
        <h1 className={styles.mainHeading}>Find Your Nearest Surge.</h1>
        <p className={styles.topSubtext}>
       Discover Surge across Dubai. Whether you're grabbing a quick pick-up or settling in for a slow morning, every location delivers the same signature quality, warmth, and consistency.
        </p>

        <div className={styles.locationGrid}>
          {locations.map((loc, index) => (
            <div key={index} className={styles.locationItem}>
              <span className={styles.locName}>{loc.name}</span>
              <span className={styles.locArea}>{loc.area}</span>
              <a href="#" className={styles.goldLink}>
                View on Map 
                <svg width="9" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.351292 7.57668L7.3504 0.505443M1.0512 0.505443H7.3504V6.86956" stroke="#C4754E"/>
                </svg>
              </a>
            </div>
          ))}
        </div>

        <div className={styles.mapWrapper}>
          <div className={styles.mapContainer}>
            <Image 
              src={mapImage} 
              alt="UAE Map" 
              className={styles.mapImg}
              priority 
            />
            
            {locations.map((loc, index) => (
              <div 
                key={index} 
                className={styles.markerWrapper} 
                style={{ top: loc.top, left: loc.left }}
              >
                {/* Hover Card (Popup) */}
                <div className={styles.locationPopup}>
                  <span className={styles.popupName}>{loc.name}</span>
                  <span className={styles.popupArea}>{loc.area}</span>
                  <a href="#" className={styles.popupLink}>
                    View on Map 
                    <svg width="9" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.351292 7.57668L7.3504 0.505443M1.0512 0.505443H7.3504V6.86956" stroke="#C4754E"/>
                    </svg>
                  </a>
                </div>

                {/* Pin Icon */}
               <div className={styles.markerPin}>
  <Image 
    src={markerIcon} 
    alt="map marker" 
    fill 
    sizes="41px"
    style={{ objectFit: 'contain' }} 
  />
</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      <section className={styles.careersSection}>
        <h2 className={styles.heading}>Join the Surge Team</h2>
        <p className={styles.description}>
       We're always looking for talented, passionate people who live the craft. If you share our vision for exceptional coffee, reach out — tell us why you belong on the Surge team.
        </p>

        <div className={styles.jobGrid}>
          {jobs.map((job) => (
            <div key={job.id} className={styles.jobItem}>
              <div className={styles.jobInfo}>
                <h3>{job.title}</h3>
                <p>{job.desc}</p>
              </div>
              <a href="#" className={styles.detailLink}>
                View Details 
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.351292 7.57668L7.3504 0.505443M7.3504 0.505443V6.86956M7.3504 0.505443H1.0512" stroke="#C4754E"/>
                </svg>
              </a>
            </div>
          ))}
        </div>

        <div className={styles.emailFooter}>
         Don't see the right role? Reach out anyway at hello@surge.ae — great people always get our attention.<br /> 
          <a href="mailto:hello@surge.ae" className={styles.emailLink}>
            hello@surge.ae
          </a>
        </div>
      </section>
    </div>
  );
}