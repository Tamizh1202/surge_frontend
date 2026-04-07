"use client";
import { useState } from "react";
import styles from "../Checkout.module.css"
import { emirates } from "../data/data";
import CountrySelect from "../../account/countryDropdown/CountrySelect";
import EmiratesPopup from "../../account/emiratesDropdown/EmiratesDropdown";
export default function ContactForm() {
    const [method, setMethod] = useState("ship");
    const [emailOffers, setEmailOffers] = useState(false);
    const [saveInfo, setSaveInfo] = useState(false);
    const [showEmirates, setShowEmirates] = useState(false);
    const [form, setForm] = useState({
        email: "",
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
        <div>
            {/* ── Express Checkout ── */}
            <div className={styles.expressCheckout}>
                <p className={styles.expressCheckoutLabel}>Express Checkout</p>
                <button className={styles.gpayBtn}>
                    <span className={styles.gpayIcon}>G</span> Pay
                </button>
            </div>

            <div className={styles.signInRow}>
                <a href="#">Sign in</a>
            </div>

            {/* ── Contact – Email ── */}
            <div className={styles.section} style={{ borderTop: "none", marginTop: 0 }}>
                <h2 className={styles.sectionTitle}>Contact</h2>

                <div className={styles.fieldGroup}>
                    <div className={styles.field}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={update("email")}
                        />
                    </div>
                </div>

                <div className={styles.checkRow}>
                    <input
                        type="checkbox"
                        id="emailOffers"
                        checked={emailOffers}
                        onChange={(e) => setEmailOffers(e.target.checked)}
                    />
                    <label htmlFor="emailOffers">Email me with news and offers</label>
                </div>
            </div>

            {/* ── Contact – Delivery Method ── */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Contact</h2>

                <div className={styles.methodRow}>
                    {["ship", "delivery"].map((m) => (
                        <div
                            key={m}
                            className={styles.methodOption}
                            onClick={() => setMethod(m)}
                        >
                            <div className={`${styles.radioCustom} ${method === m ? styles.active : ""}`}>
                                {method === m && <span className={styles.radioDot} />}
                            </div>
                            <span className={styles.methodLabel}>
                                {m.charAt(0).toUpperCase() + m.slice(1)}
                            </span>
                        </div>
                    ))}
                </div>

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
                    {/* comeback */}
                    <div className={styles.field}>
                        <div className={styles.selectWrap} style={{ position: 'relative' }}> {/* Ensure relative positioning */}
                            <div
                                className={styles.customSelect}
                                onClick={() => setShowEmirates(true)}
                            >
                                {form.emirate || "Select Emirate"}
                                <span className={styles.selectArrow}>▼</span>
                            </div>

                            {showEmirates && (
                                <EmiratesPopup
                                    selected={form.emirate}
                                    onSelect={(val) => {
                                        // This mimics your existing update("emirate") logic
                                        const event = { target: { value: val } };
                                        update("emirate")(event);
                                    }}
                                    onClose={() => setShowEmirates(false)}
                                />
                            )}
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

                {/* Save */}
                <div className={styles.checkRow}>
                    <input
                        type="checkbox"
                        id="saveInfo"
                        checked={saveInfo}
                        onChange={(e) => setSaveInfo(e.target.checked)}
                    />
                    <label htmlFor="saveInfo">Save this for next time</label>
                </div>
            </div>
        </div>
    );
}