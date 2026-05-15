"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react"; // Added useEffect and useRef
import styles from "./Touch.module.css";
import one from './get.webp';
import whatsappIcon from './whatsapp.png';

export default function Touch() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseError, setResponseError] = useState(false);
  
  // Custom Select States
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");

  // Create a Ref for the dropdown container
  const dropdownRef = useRef(null);

  // --- ADDED: Click Outside Logic ---
  useEffect(() => {
    function handleClickOutside(event) {
      // Agar click dropdownRef ke bahar hua hai, toh close kar do
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // ----------------------------------

  const options = [
    { label: "Payments & Refunds", value: "Payments & Refunds" },
    { label: "Rewards & Loyalty", value: "Rewards & Loyalty" },
    { label: "Orders & Support", value: "Orders & Support" },
    { label: "Pickup & Delivery", value: "Pickup & Delivery" },
    { label: "General Enquiry", value: "General Enquiry" },
    { label: "Other", value: "Other" }
  ];

  const ENDPOINT = "/api/website/contact";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage("");
    setResponseError(false);

    if (!fullName.trim() || !email.trim()) {
      setResponseError(true);
      setResponseMessage("Please enter your name and email.");
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

      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || (json && json.success === false)) {
        setResponseError(true);
        setResponseMessage(json?.message || "Submission failed.");
      } else {
        setResponseError(false);
        setResponseMessage("Thank you! Your message has been submitted.");
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
                  <h3>Let’s Get In Touch</h3>
                  <p>Drop us a message and let’s start brewing something great.</p>
                </div>

                <Link href="https://wa.me/+9710589535337">
                  <Image src={whatsappIcon} alt="Whatsapp" width={28} height={28} />
                </Link>
              </div>

              <div className={styles.formBox}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />

                <div className={styles.row}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {/* Updated Container with Ref */}
                <div className={styles.container} ref={dropdownRef}>
                  <div
                    className={`${styles.selectTrigger} ${isOpen ? styles.open : ""}`}
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <span>
                        {selected ? options.find(o => o.value === selected)?.label : "Enquiry Type"}
                    </span>
                    <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ""}`}>▼</span>
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

                <textarea
                  placeholder="How we can help you."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
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
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '5px' }}>
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