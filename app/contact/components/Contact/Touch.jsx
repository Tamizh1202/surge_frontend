"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./Touch.module.css";
import one from './get.png';
import whatsappIcon from './whatsapp.png';

export default function Touch() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [enquiryType, setEnquiryType] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseError, setResponseError] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
 const options = [
  "Order issue",
  "Payment or refund",
  "Rewards & stamps",
  "Barista selection",
  "Pickup or timing",
  "Menu & availability",
  "Other"
];
  const ENDPOINT = "/api/website/contact";
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
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
        fullName: fullName.trim(),       // ✅ camelCase
        email: email.trim(),
        phone: phone.trim(),
        inquiryType: selected.trim(),    // ✅ also note: inquiryType not enquiryType
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
        setFullName(""); setEmail(""); setPhone(""); setEnquiryType(""); setMessage("");
      }
    } catch {
      setResponseError(true);
      setResponseMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setResponseMessage(""), 3000);
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
                />

                <div className={styles.row}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className={styles.container}>
                  {/* The Trigger (What the user sees) */}
                  <div
                    className={`${styles.selectTrigger} ${isOpen ? styles.open : ""}`}
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <span>{selected ? options.find(o => o.value === selected)?.label : "Enquiry Type"}</span>
                    <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ""}`}>▼</span>
                  </div>

                  {/* The Actual Dropdown Menu */}
                  {isOpen && (
                    <ul className={styles.optionsList}>
                      {options.map((option) => (
                        <li
                          key={option.value}
                          className={styles.optionItem}
                          onClick={() => {
                            setSelected(option.value);
                            setEnquiryType(option.value);
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
                <p>Instagram <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
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