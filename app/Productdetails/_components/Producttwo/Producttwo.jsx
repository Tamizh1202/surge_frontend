"use client";
import { useState, Fragment } from 'react';
import styles from './Product.module.css';

export default function Producttwo({ brewingGuide, serverUrl = '' }) {
  const tabs = brewingGuide?.tabs ?? [];
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? '');

  if (!brewingGuide || tabs.length === 0) return null;

  const currentTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  const resolveUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;      // already absolute
    return `${serverUrl}${url}`;                 // prepend backend origin
  };

  const videoUrl = resolveUrl(currentTab?.video?.url);

  return (
    <div className={styles.container}>
      <section className={styles.Section}>
        <h2 className={styles.title}>Brewing guide</h2>

        <div className={styles.tabs}>
          {tabs.map((tab, index) => (
            <Fragment key={tab.id}>
              <div
                className={`${styles.tab} ${activeTabId === tab.id ? styles.activeTab : ''}`}
                onClick={() => setActiveTabId(tab.id)}
              >
                {tab.tabName}
              </div>

              {index < tabs.length - 1 && (
                <span className={styles.separator}>
                  <svg width="1" height="20" viewBox="0 0 1 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line opacity="0.5" x1="0.5" y1="2.18554e-08" x2="0.499999" y2="20" stroke="#818686" />
                  </svg>
                </span>
              )}
            </Fragment>
          ))}
        </div>

        <div className={styles.infoTable}>
          {currentTab?.parameters?.map(({ id, label, value }) => (
            <div className={styles.row} key={id}>
              <span className={styles.label}>{label}</span>
              <span className={styles.value}>{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.imageSection}>
        {videoUrl && (
          <video
            key={videoUrl}
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </section>
    </div>
  );
}