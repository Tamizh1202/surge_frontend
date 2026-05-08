"use client";

import styles from './Sendenq.module.css';
import Image from "next/image";
import oneImg from './people.png';
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

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
      {/* Trigger row */}
      <div
        className={`${styles.dropdownTrigger} ${open ? styles.dropdownTriggerOpen : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={selected ? styles.dropdownValue : styles.dropdownPlaceholder}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={`${styles.dropdownChevron} ${open ? styles.chevronUp : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Slide-down panel */}
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
// ─────────────────────────────────────────────────────────────────────────────

const EVENT_TYPE_OPTIONS = [
  { value: "private", label: "Private Event" },
  { value: "corporate", label: "Corporate Event" },
];

const PACKAGE_OPTIONS = [
  { value: "30", label: "30 Cups" },
  { value: "50", label: "50 Cups" },
  { value: "100", label: "100 Cups" },
  { value: "additional", label: "Additional Cups" },
];

const EMIRATE_OPTIONS = [
  { value: "dubai", label: "Dubai" },
  { value: "sharjah", label: "Sharjah" },
  { value: "ras_al_khaima", label: "Ras Al Khaima" },
  { value: "ajman", label: "Ajman" },
  { value: "abu_dhabi", label: "Abu Dhabi" },
];

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.firstName || !formData.email || !formData.phoneNumber) {
      toast.error("Name, Email and Phone Number are required.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        expectedGuests: Number(formData.expectedGuests),
        eventDate: formData.eventDate ? new Date(formData.eventDate).toISOString() : null,
      };

      const serverUrl =
        process.env.NEXT_PUBLIC_SERVER_URL || "https://surge-backend-seven.vercel.app";
      await axios.post(`${serverUrl}/api/events`, payload);

      toast.success("Thank you! Your enquiry has been received.");
      setFormData({
        firstName: "", lastName: "", email: "", phoneNumber: "",
        eventDate: "", timeWindow: "", expectedGuests: "",
        eventType: "", package: "", addons: "", city: "", emirate: "", message: "",
      });
    } catch (error) {
      console.error("Error sending enquiry:", error);
      toast.error(
        error.response?.data?.message || "Failed to send enquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.main} id="enquiry-form">
      <div className={styles.MainContainer}>
        <div className={styles.LeftConatiner}>
          <Image
            src={oneImg}
            alt="Surge Coffee"
            width={835}
            height={790}
            priority
            className={styles.image}
          />
        </div>

        <div className={styles.RightContainer}>
          <div className={styles.RightContent}>
            <form onSubmit={handleSubmit} className={styles.formMain}>
              <div className={styles.Top}>
                <h3>Book Surge for Your Event</h3>
                <p>Fill out the form below and we'll get back to you within 24 hours.</p>
              </div>

              <div className={styles.formBox}>

                {/* Full Name — full width */}
                <input
                  type="text" name="firstName" placeholder="Full Name"
                  value={formData.firstName} onChange={handleChange}
                />

                {/* Email | Phone */}
                <div className={styles.row}>
                  <input
                    type="email" name="email" placeholder="Email"
                    value={formData.email} onChange={handleChange}
                  />
                  <input
                    type="tel" name="phoneNumber" placeholder="Phone Number"
                    value={formData.phoneNumber} onChange={handleChange}
                  />
                </div>

                {/* Event Date | Time Window */}
                <div className={styles.row}>
                  <input
                    type="date" name="eventDate"
                    value={formData.eventDate} onChange={handleChange}
                    required
                  />
                  <input
                    type="text" name="timeWindow" placeholder="Time Window"
                    value={formData.timeWindow} onChange={handleChange}
                  />
                </div>

                {/* Expected Guests | Event Type */}
                <div className={styles.row}>
                  <input
                    type="number" name="expectedGuests" placeholder="Expected Guests"
                    value={formData.expectedGuests} onChange={handleChange}
                  />
                  <CustomDropdown
                    name="eventType"
                    placeholder="Event Type"
                    options={EVENT_TYPE_OPTIONS}
                    value={formData.eventType}
                    onChange={handleChange}
                  />
                </div>

                {/* Package | Add-ons */}
                <div className={styles.row}>
                  <CustomDropdown
                    name="package"
                    placeholder="Package (e.g. 30, 50)"
                    options={PACKAGE_OPTIONS}
                    value={formData.package}
                    onChange={handleChange}
                  />
                  <input
                    type="text" name="addons" placeholder="Add-ons (e.g. water, desserts)"
                    value={formData.addons} onChange={handleChange}
                  />
                </div>

                {/* Location — full width */}
                <input
                  type="text" name="city" placeholder="Location"
                  value={formData.city} onChange={handleChange}
                />

                {/* Message — full width */}
                <textarea
                  name="message"
                  placeholder="Tell us about your event"
                  value={formData.message}
                  onChange={handleChange}
                  rows={1}
                />

              </div>

              <div className={styles.Bottom}>
                <button className={styles.btn} type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Enquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}