import styles from './Coffeepackage.module.css';

const packages = [
  {
    id: 1,
    name: "Package 01",
    inclusions: ["Coffee Setup", "Professional Barista", "Decors"],
    servingOptions: [
      { count: "50 cups", price: "AED 1500" },
      { count: "100 Cups", price: "AED 1500" },
      { count: "150 Cups", price: "AED 1500" }
    ],
    addons: ["Extra Cups — AED 30/cup", "Sweets Selection", "Small Bites"]
  },
  {
    id: 2,
    name: "Package 02",
    inclusions: ["Coffee Setup", "Professional Barista", "Decors", "Coffee Setup"],
    servingOptions: [
      { count: "50 cups", price: "AED 1500" },
      { count: "100 Cups", price: "AED 1500" },
      { count: "150 Cups", price: "AED 1500" }
    ],
    addons: ["Extra Cups — AED 30/cup", "Sweets Selection", "Small Bites"]
  },
  {
    id: 3,
    name: "Package 03",
    inclusions: ["Coffee Setup", "Professional Barista", "Decors"],
    servingOptions: [
      { count: "50 cups", price: "AED 1500" },
      { count: "100 Cups", price: "AED 1500" },
      { count: "150 Cups", price: "AED 1500" }
    ],
    addons: ["Extra Cups — AED 30/cup", "Sweets Selection", "Small Bites"]
  }
];

const locations = [
  { city: "Dubai", price: "Free" },
  { city: "Sharjah", price: "AED 300" },
  { city: "Ajman", price: "AED 300" },
  { city: "RAK", price: "AED 400" },
  { city: "Al Ain", price: "AED 500" },
  { city: "Abu Dhabi", price: "AED 500" }
];

// Reusable SVG Bullet Component for precise, clean rendering
const BulletIcon = () => (
  <svg
    width="6"
    height="6"
    viewBox="0 0 6 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.bulletSvg}
  >
    <circle cx="3" cy="3" r="3" fill="#C4754E" />
  </svg>
);

export default function CoffeePackages() {
  return (
    <section className={styles.container}>
      {/* --- Main Header --- */}
      <header className={styles.header}>
        <h2 className={styles.mainTitle}>Choose Your Coffee Package</h2>
        <p className={styles.subtitle}>
          From intimate gatherings to large-scale events, pick a package based on your guest
          count and serving needs. Simple, flexible, and crafted to keep every cup consistent.
        </p>
      </header>

      <div className={styles.grid}>
        {packages.map((pkg) => (
          <div key={pkg.id} className={styles.card}>

            <h3 className={styles.cardTitle}>{pkg.name}</h3>


            <div className={styles.cardInner}>
              {/* Core Inclusions */}
              <ul className={styles.inclusionList}>
                {pkg.inclusions.map((item, idx) => (
                  <li key={idx}>
                    <BulletIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>


              <div className={styles.sectionGroup}>

                <h4 className={styles.sectionHeading}>Serving Options</h4>
                <div className={styles.sectionContent}>
                  <div className={styles.priceRows}>
                    {pkg.servingOptions.map((option, idx) => (
                      <div key={idx} className={styles.priceRow}>
                        <span className={styles.label}>{option.count}</span>
                        <span className={styles.value}>{option.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.sectionGroup}>
                <h4 className={styles.sectionHeading}>Optional Add-ons</h4>
                <ul className={styles.addonList}>
                  {pkg.addons.map((addon, idx) => (
                    <li key={idx}>
                      <BulletIcon />
                      <span>{addon}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <a href="#enquiry-form" className={styles.button}>
              Enquire Now
            </a>
          </div>
        ))}
      </div>

      {/* --- Serving Locations Footer --- */}
      <div className={styles.locationFooter}>
        <h3 className={styles.locationTitle}>Serving Events Across UAE</h3>
        <div className={styles.locationGrid}>
          {locations.map((loc, idx) => (
            <div key={idx} className={styles.locationCard}>
              <span className={styles.locCity}>{loc.city}</span>
              <span className={styles.locPrice}>{loc.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}