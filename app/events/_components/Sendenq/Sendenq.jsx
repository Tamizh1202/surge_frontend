"use client";

import styles from './Sendenq.module.css';
import Image from "next/image";
import oneImg from './people.webp';
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

// ── API VALID OPTIONS ──────────────────
const EVENT_TYPE_OPTIONS = [
  { value: "private", label: "Private Event" },
  { value: "corporate", label: "Corporate Event" },
];

const PACKAGE_OPTIONS = [
  { value: "30-cups", label: "30 Cups" },
  { value: "50-cups", label: "50 Cups" },
  { value: "100-cups", label: "100 Cups" },
  { value: "additional-cups", label: "Additional Cups" },
];

const EMIRATE_OPTIONS = [
  { value: "dubai", label: "Dubai" },
  { value: "sharjah", label: "Sharjah" },
  { value: "ras-al-khaimah", label: "Ras Al Khaimah" },
  { value: "ajman", label: "Ajman" },
  { value: "abu-dhabi", label: "Abu Dhabi" },
  { value: "fujairah", label: "Fujairah" },
  { value: "umm-al-quwain", label: "Umm Al Quwain" },
];

// ── Reusable Custom Dropdown ──────────────────────────────────────────────────
function CustomDropdown({ name, placeholder, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setOpen(false);
  };

  const selected = options.find((o) => o.value === value);

  return (
    <div className={styles.dropdown} ref={ref}>
      <div
        className={`${styles.dropdownTrigger} ${open ? styles.dropdownTriggerOpen : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={selected ? styles.dropdownValue : styles.dropdownPlaceholder}>
          {selected ? selected.label : placeholder}
        </span>
        <svg className={`${styles.dropdownChevron} ${open ? styles.chevronUp : ""}`} viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className={`${styles.dropdownPanel} ${open ? styles.dropdownPanelOpen : ""}`}>
        <div className={styles.dropdownInner}>
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`${styles.dropdownOption} ${value === opt.value ? styles.dropdownOptionActive : ""}`}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function Sendenq() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    eventDate: "",
    timeWindow: "",
    expectedGuests: "",
    eventType: "", 
    package: "",  
    addons: "",
    city: "",
    emirate: "", 
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const LIMITS = {
    firstName: 15,
    lastName: 15,
    phoneNumber: 9,
    city: 15,
    message: 200
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        eventDate: formData.eventDate ? new Date(formData.eventDate).toISOString() : null,
        timeWindow: formData.timeWindow.trim(),
        expectedGuests: Number(formData.expectedGuests),
        eventType: formData.eventType, 
        package: formData.package,     
        city: formData.city.trim(),
        emirate: formData.emirate,     
      };

      if (formData.addons.trim()) payload.addons = formData.addons.trim();
      if (formData.message.trim()) payload.message = formData.message.trim();

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://surge-backend-seven.vercel.app";
      await axios.post(`${serverUrl}/api/events`, payload);
      toast.success("Thank you! Your enquiry has been received.");
      
      setFormData({
        firstName: "", lastName: "", email: "", phoneNumber: "",
        eventDate: "", timeWindow: "", expectedGuests: "",
        eventType: "", package: "", addons: "", city: "", emirate: "", message: "",
      });

    } catch (error) {
      toast.error(error.response?.data?.message || "Please check all fields and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.main} id="enquiry-form">
      <div className={styles.MainContainer}>
        <div className={styles.LeftConatiner}>
          <Image src={oneImg} alt="Surge Coffee" width={835} height={790} priority className={styles.image} />
        </div>

        <div className={styles.RightContainer}>
          <div className={styles.RightContent}>
            <form onSubmit={handleSubmit} className={styles.formMain}>
              <div className={styles.Top}>
                <h3>Book Surge for Your Event</h3>
                <p>Fill out the form below and we'll get back to you within 24 hours.</p>
              </div>

              <div className={styles.formBox}>
                <div className={styles.row}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input type="text" name="firstName" placeholder="First Name *" value={formData.firstName} onChange={handleChange} onFocus={() => setFocusedField("firstName")} onBlur={() => setFocusedField("")} maxLength={LIMITS.firstName} required />
                    {focusedField === "firstName" && <span style={{ position: 'absolute', right: 0, bottom: '-15px', fontSize: '10px', color: '#818686' }}>{formData.firstName.length}/{LIMITS.firstName}</span>}
                  </div>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input type="text" name="lastName" placeholder="Last Name *" value={formData.lastName} onChange={handleChange} onFocus={() => setFocusedField("lastName")} onBlur={() => setFocusedField("")} maxLength={LIMITS.lastName} required />
                    {focusedField === "lastName" && <span style={{ position: 'absolute', right: 0, bottom: '-15px', fontSize: '10px', color: '#818686' }}>{formData.lastName.length}/{LIMITS.lastName}</span>}
                  </div>
                </div>

                <div className={styles.row}>
                  <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleChange} required />
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input type="tel" name="phoneNumber" placeholder="Phone (e.g. +971...) *" value={formData.phoneNumber} onChange={handleChange} onFocus={() => setFocusedField("phoneNumber")} onBlur={() => setFocusedField("")} maxLength={LIMITS.phoneNumber} required />
                    {focusedField === "phoneNumber" && <span style={{ position: 'absolute', right: 0, bottom: '-15px', fontSize: '10px', color: '#818686' }}>{formData.phoneNumber.length}/{LIMITS.phoneNumber}</span>}
                  </div>
                </div>

                <div className={styles.row}>
                  <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} required />
                  <input type="text" name="timeWindow" placeholder="Time (e.g. 6PM-10PM) *" value={formData.timeWindow} onChange={handleChange} required />
                </div>

                <div className={styles.row}>
                  <input type="number" name="expectedGuests" placeholder="Expected Guests *" value={formData.expectedGuests} onChange={handleChange} required />
                  <CustomDropdown name="eventType" placeholder="Event Type" options={EVENT_TYPE_OPTIONS} value={formData.eventType} onChange={handleChange} />
                </div>

                <div className={styles.row}>
                  <CustomDropdown name="package" placeholder="Package" options={PACKAGE_OPTIONS} value={formData.package} onChange={handleChange} />
                  <CustomDropdown name="emirate" placeholder="Emirate" options={EMIRATE_OPTIONS} value={formData.emirate} onChange={handleChange} />
                </div>

                <div className={styles.row}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input type="text" name="city" placeholder="City/Area *" value={formData.city} onChange={handleChange} onFocus={() => setFocusedField("city")} onBlur={() => setFocusedField("")} maxLength={LIMITS.city} required />
                    {focusedField === "city" && <span style={{ position: 'absolute', right: 0, bottom: '-15px', fontSize: '10px', color: '#818686' }}>{formData.city.length}/{LIMITS.city}</span>}
                  </div>
                  <input type="text" name="addons" placeholder="Add-ons (e.g. water)" value={formData.addons} onChange={handleChange} />
                </div>

                <div style={{ position: 'relative' }}>
                  <textarea
                    name="message"
                    placeholder="Tell us about your event"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField("")}
                    maxLength={LIMITS.message}
                    rows={1}
                    style={{ 
   
      resize: 'none', 
   
    }}
                  />
                  {focusedField === "message" && <span style={{ position: 'absolute', right: 0, bottom: '-15px', fontSize: '10px', color: '#818686' }}>{formData.message.length}/{LIMITS.message}</span>}
                </div>
              </div>

              <div className={styles.Bottom}>
                <button className={styles.btn} type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Submit Enquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}