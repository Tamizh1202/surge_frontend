"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./CountrySelect.module.css";

const countries = [
    { value: "uae", label: "United Arab Emirates" },
    { value: "ksa", label: "Saudi Arabia" },
    { value: "kw", label: "Kuwait" },
    { value: "bh", label: "Bahrain" },
    { value: "om", label: "Oman" },
    { value: "qa", label: "Qatar" },
];

export default function CountrySelect() {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(countries[0]);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className={`${styles.wrapper} ${open ? styles.open : ""}`} ref={ref}>
            <button type="button" className={styles.trigger} onClick={() => setOpen((p) => !p)}>
                <span>{selected.label}</span>
                <span className={`${styles.arrow} ${open ? styles.arrowUp : ""}`}>▼</span>
            </button>

            {open && (
                <ul className={styles.dropdown}>
                    {countries.map((c) => (
                        <li
                            key={c.value}
                            className={`${styles.option} ${c.value === selected.value ? styles.active : ""}`}
                            onClick={() => { setSelected(c); setOpen(false); }}
                        >
                            {c.label}
                            {c.value === selected.value && <span className={styles.check}>✓</span>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}