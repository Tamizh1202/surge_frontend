"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import styles from "./Touch.module.css";
import one from './get.webp';
import whatsappIcon from './whatsapp.png';

export default function Touch() {
  // Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseError, setResponseError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [isTextareaActive, setIsTextareaActive] = useState(false);

  const dropdownRef = useRef(null);
  const characterLimit = 150;

  // Options for Inquiry Type
  const options = [
    { label: "Order issue", value: "Order issue" },
    { label: "Payment or refund", value: "Payment or refund" },
    { label: "Rewards & stamps", value: "Rewards & stamps" },
    { label: "Barista selection", value: "Barista selection" },
    { label: "Pickup or timing", value: "Pickup or timing" },
    { label: "Menu & availability", value: "Menu & availability" },
    { label: "Other", value: "Other" }
  ];

  // Click Outside logic for Dropdown
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

    // Basic Validation
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

      const res = await fetch("/api/website/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || json?.success === false) {
        setResponseError(true);
        setResponseMessage(json?.message || "Submission failed.");
      } else {
        setResponseError(false);
        setResponseMessage("Thank you! Your message has been submitted.");
        
        // --- CLEAR ALL FIELDS ON SUCCESS ---
        setFullName(""); 
        setEmail(""); 
        setPhone(""); 
        setSelected(""); 
        setMessage("");
      }
    } catch (err) {
      setResponseError(true);
      setResponseMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
      // Status message disappears after 5 seconds
      setTimeout(() => setResponseMessage(""), 5000);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.MainContainer}>

        <div className={styles.LeftConatiner}>
          <Image
            src={one}
            alt="Contact Form Image"
            className={styles.image}
            priority
          />
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
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />

                <div className={styles.row}>
                  {/* Email */}
                  <input
                    type="email"
                    placeholder="Email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {/* Phone */}
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {/* Inquiry Type Dropdown */}
                <div className={styles.container} ref={dropdownRef}>
                  <div
                    className={`${styles.selectTrigger} ${isOpen ? styles.open : ""}`}
                    onClick={() => setIsOpen(!isOpen)}
                  >
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
                        <li
                          key={option.value}
                          className={styles.optionItem}
                          onClick={() => {
                            setSelected(option.value);
                            setIsOpen(false);
                          }}
                        >
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Message Textarea with 0/150 counter */}
                <div className={styles.textareaWrapper} style={{ position: 'relative' }}>
                  <textarea
                    placeholder="How we can help you. *"
                    value={message}
                    maxLength={characterLimit}
                    onFocus={() => setIsTextareaActive(true)}
                    onBlur={() => setIsTextareaActive(false)}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                  {(isTextareaActive || message.length > 0) && (
                    <span className={styles.charLimit}>
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