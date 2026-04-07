"use client";

import { useState } from "react";
import styles from "./EmiratesDropdown.module.css";

const emirates = [
    "Abu Dhabi",
    "Dubai",
    "Sharjah",
    "Ajman",
    "Umm Al Quwain",
    "Ras Al Khaimah",
    "Fujairah",
];

export default function EmiratesPopup({ selected, onSelect, onClose }) {
    const [search, setSearch] = useState("");

    const filtered = emirates.filter((em) =>
        em.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            {/* Transparent backdrop to detect clicks outside the dropdown */}
            <div className={styles.backdrop} onClick={onClose} />

            <div className={styles.dropdown}>
                {/* Search Input */}
                {/* <div className={styles.searchWrap}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search emirate..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                    />
                </div> */}

                {/* List of Emirates */}
                <ul className={styles.list}>
                    {filtered.length === 0 && (
                        <li className={styles.empty}>No results for "{search}"</li>
                    )}
                    {filtered.map((em) => (
                        <li
                            key={em}
                            className={`${styles.item} ${selected === em ? styles.itemSelected : ""}`}
                            onClick={() => {
                                onSelect(em);
                                onClose();
                            }}
                        >
                            <span>{em}</span>
                            {selected === em && <span className={styles.checkmark}>✓</span>}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}