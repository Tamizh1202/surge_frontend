import styles from './Coffeepackage.module.css';

async function getCoffeePackages() {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://surge-backend-seven.vercel.app';
  const res = await fetch(
    `${baseUrl}/api/coffee-packages?limit=10&depth=0&sort=_order`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.docs ?? [];
}

async function getServiceAreas() {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://surge-backend-seven.vercel.app';
  const res = await fetch(
    `${baseUrl}/api/service-areas?limit=100&depth=0&sort=_order`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.docs ?? [];
}

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

export default async function CoffeePackages() {
  const [packages, serviceAreas] = await Promise.all([getCoffeePackages(), getServiceAreas()]);

  return (
    <section className={styles.container}>
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
              <ul className={styles.inclusionList}>
                {pkg.features.map((f) => (
                  <li key={f.id}>
                    <BulletIcon />
                    <span>{f.value}</span>
                  </li>
                ))}
              </ul>

              <div className={styles.sectionGroup}>
                <h4 className={styles.sectionHeading}>{pkg.servingOptions.title}</h4>
                <div className={styles.sectionContent}>
                  <div className={styles.priceRows}>
                    {pkg.servingOptions.tiers.map((tier) => (
                      <div key={tier.id} className={styles.priceRow}>
                        <span className={styles.label}>{tier.cups} Cups</span>
                        <span className={styles.value}>AED {tier.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.sectionGroup}>
                <h4 className={styles.sectionHeading}>{pkg.optionalAddOns.title}</h4>
                <ul className={styles.addonList}>
                  {pkg.optionalAddOns.items.map((addon) => (
                    <li key={addon.id}>
                      <BulletIcon />
                      <span>{addon.label}</span>
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

      <div className={styles.locationFooter}>
        <h3 className={styles.locationTitle}>Serving Events Across UAE</h3>
        <div className={styles.locationGrid}>
          {serviceAreas.map((area) => (
            <div key={area.id} className={styles.locationCard}>
              <span className={styles.locCity}>{area.location}</span>
              <span className={styles.locPrice}>{area.fee === 0 ? 'Free' : `AED ${area.fee}`}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}