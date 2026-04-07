"use client";
import { useState } from "react";
import styles from "../Checkout.module.css"
import { emirates } from "../data/data";
import CountrySelect from "../../account/countryDropdown/CountrySelect";
export default function BillingAddress() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        houseStreet: "",
        apartment: "",
        city: "",
        emirate: "",
        phone: "",
    });

    const update = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Billing Address</h2>

            <div className={styles.fieldGroup}>
                {/* Country */}
                <div className={styles.field}>
                    <label>Country / Region</label>
                    {/* <div className={styles.selectWrap}>
                        <select defaultValue="uae">
                            <option value="uae">United Arab Emirates</option>
                            <option value="ksa">Saudi Arabia</option>
                            <option value="kw">Kuwait</option>
                            <option value="bh">Bahrain</option>
                            <option value="om">Oman</option>
                            <option value="qa">Qatar</option>
                        </select>
                        <span className={styles.selectArrow}>▼</span>
                    </div> */}
                    <CountrySelect />
                </div>

                {/* First / Last Name */}
                <div className={styles.fieldRow}>
                    <div className={styles.field}>
                        <input
                            type="text"
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={update("firstName")}
                        />
                    </div>
                    <div className={styles.field}>
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={update("lastName")}
                        />
                    </div>
                </div>

                {/* House / Street */}
                <div className={styles.field}>
                    <input
                        type="text"
                        placeholder="House Number, Street Name"
                        value={form.houseStreet}
                        onChange={update("houseStreet")}
                    />
                </div>

                {/* Apartment */}
                <div className={styles.field}>
                    <div className={styles.fieldOptional}>
                        <input
                            type="text"
                            placeholder="Apartment, Suite etc."
                            value={form.apartment}
                            onChange={update("apartment")}
                        />
                        <span className={styles.optionalTag}>(Optional)</span>
                    </div>
                </div>

                {/* City / Emirate */}
                <div className={styles.fieldRow}>
                    <div className={styles.field}>
                        <input
                            type="text"
                            placeholder="City"
                            value={form.city}
                            onChange={update("city")}
                        />
                    </div>
                    <div className={styles.field}>
                        <div className={styles.selectWrap}>
                            <select value={form.emirate} onChange={update("emirate")}>
                                <option value="" disabled>Emirate</option>
                                {emirates.map((em) => (
                                    <option key={em} value={em}>{em}</option>
                                ))}
                            </select>
                            <span className={styles.selectArrow}>▼</span>
                        </div>
                    </div>
                </div>

                {/* Phone */}
                <div className={styles.field}>
                    <input
                        type="tel"
                        placeholder="Phone"
                        value={form.phone}
                        onChange={update("phone")}
                    />
                </div>
            </div>
        </div>
    );
}