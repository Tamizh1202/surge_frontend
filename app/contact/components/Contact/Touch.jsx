"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import styles from "./Touch.module.css";
import one from './get.webp';
import whatsappIcon from './whatsapp.png';
import axiosClient from "@/lib/axios";
import { validateUAEPhone } from "@/utils/validatorFunctions";

export default function Touch() {
  // Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  
  // UI States
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseError, setResponseError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [isTextareaActive, setIsTextareaActive] = useState(false);
  const [activeField, setActiveField] = useState(""); 

  const dropdownRef = useRef(null);
  const characterLimit = 150;
  const nameLimit = 40; 
  const phoneLimit = 9;

  const handlePhoneChange = (e) => {
    setPhone(e.target.value.replace(/\D/g, "").slice(0, phoneLimit));
    if (phoneError) setPhoneError("");
  };

const options = [
  { label: "Orders & Support", value: "order_issue" },
  { label: "Payments & Refunds", value: "payment_refund" },
  { label: "Rewards & Loyalty", value: "rewards_stamps" },
  { label: "Barista Selection", value: "barista_selection" },
  { label: "Pickup & Delivery", value: "pickup_timing" },
  { label: "Menu & Availability", value: "menu_availability" },
  { label: "Other", value: "other" }
];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage("");
    setResponseError(false);

    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setResponseError(true);
      setResponseMessage("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        inquiryType: selected,
        message: message.trim(),
      };

      const res = await axiosClient.post("/api/web-contact-form", payload);

      if (res.data?.success === false) {
        setResponseError(true);
        setResponseMessage(res.data?.message || "Submission failed.");
      } else {
        setResponseError(false);
        setResponseMessage("Thank you! Your message has been submitted.");
        setFullName(""); setEmail(""); setPhone(""); setSelected(""); setMessage("");
      }
    } catch (err) {
      setResponseError(true);
      setResponseMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setResponseMessage(""), 5000);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.MainContainer}>

        <div className={styles.LeftConatiner}>
          <Image src={one} alt="Contact Form Image" className={styles.image} priority />
        </div>

        <div className={styles.RightContainer}>
          <div className={styles.RightContent}>

            <form onSubmit={handleSubmit} className={styles.formMain}>
              <div className={styles.Top}>
                <div className={styles.TitleArea}>
                  <h3>Let's Get In Touch.</h3>
                  <p>Drop us a message and let's start brewing something great together.</p>
                </div>
                <Link href="https://wa.me/+9710589535337">
                  <Image src={whatsappIcon} alt="Whatsapp" width={28} height={28} />
                </Link>
              </div>

              <div className={styles.formBox}>
                
                {/* Full Name */}
                <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={fullName}
                    maxLength={nameLimit}
                    onFocus={() => setActiveField("fullName")}
                    onBlur={() => setActiveField("")}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                  {(activeField === "fullName" || fullName.length > 0) && (
                    <span style={{ position: 'absolute', right: '10px', fontSize: '10px', color: '#818686', pointerEvents: 'none', fontFamily: 'var(--font-montserrat)' }}>
                      {fullName.length}/{nameLimit}
                    </span>
                  )}
                </div>

                <div className={styles.row}>
                  <input
                    type="email"
                    placeholder="Email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  {/* Phone */}
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="Phone Number"
                      value={phone}
                      maxLength={phoneLimit}
                      onFocus={() => setActiveField("phone")}
                      onBlur={() => {
                        setActiveField("");
                        if (phone.length > 0) {
                          const err = validateUAEPhone(phone);
                          setPhoneError(err);
                        } else {
                          setPhoneError("");
                        }
                      }}
                      onChange={handlePhoneChange}
                      style={{ width: '100%' }}
                    />
                    {(activeField === "phone" || phone.length > 0) && (
                      <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: '#818686', pointerEvents: 'none', fontFamily: 'var(--font-montserrat)' }}>
                        {phone.length}/{phoneLimit}
                      </span>
                    )}
                    {phoneError && (
                      <span style={{ position: 'absolute', bottom: '-18px', left: 0, color: '#c0392b', fontSize: '11px', fontFamily: 'var(--font-raleway)' }}>
                        {phoneError}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.container} ref={dropdownRef}>
                  <div className={`${styles.selectTrigger} ${isOpen ? styles.open : ""}`} onClick={() => setIsOpen(!isOpen)}>
                    <span className={!selected ? styles.placeholderText : ""}>
                      {selected ? options.find(o => o.value === selected)?.label : "Enquiry Type"}
                    </span>
                    <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ""}`}>
                      <svg width="17" height="9" viewBox="0 0 17 9" fill="none">
                        <path opacity="0.9" d="M8.27175 9L-0.000935071 7.02781e-07L16.5444 -1.71995e-06L8.27175 9Z" fill="#818686"/>
                      </svg>
                    </span>
                  </div>
                  {isOpen && (
                    <ul className={styles.optionsList}>
                      {options.map((option) => (
                        <li key={option.value} className={styles.optionItem} onClick={() => { setSelected(option.value); setIsOpen(false); }}>
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Message Section */}
                <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center'}}>
                  <textarea
                    placeholder="How we can help you. *"
                    value={message}
                    maxLength={characterLimit}
                    onFocus={() => setIsTextareaActive(true)}
                    onBlur={() => setIsTextareaActive(false)}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    style={{ width: '100%',paddingBottom:"4px"  }}
                  />
                  {(isTextareaActive || message.length > 0) && (
                    <span style={{ position: 'absolute', right: '10px', bottom: '15px', fontSize: '10px', color: '#818686', pointerEvents: 'none', fontFamily: 'var(--font-montserrat)' }}>
                      {message.length}/{characterLimit}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.Bottom}>
                <button className={styles.btn} type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>

              {responseMessage && (
                <div className={styles.statusMsg} style={{ color: responseError ? "crimson" : "#197B5B" }}>
                  {responseMessage}
                </div>
              )}
            </form>

            <div className={styles.contactFooter}>
              <div className={styles.footerItem}>
                <span>Call</span>
                <p>+971 - 05 8953 5337</p>
              </div>
              <div className={styles.footerItem}>
                <span>Email</span>
                <p>hello@surge.ae</p>
              </div>
              <div className={styles.footerItem}>
                <span>Follow Us</span>
                <p>Instagram 
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" style={{ marginLeft: '5px' }}>
                    <path d="M0.351292 7.57278L7.3504 0.501536M7.3504 0.501536V6.86565M7.3504 0.501536H1.0512" stroke="#C4754E" />
                  </svg>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
