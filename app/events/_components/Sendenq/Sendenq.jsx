"use client";

import styles from './Sendenq.module.css';
import Image from "next/image";
import oneImg from './people.png';
import { useState } from "react";
export default function Sendenq() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    eventDate: "",
    timeWindow: "",
    expectedGuests: "",
    eventType: "",
    package: "",
    addons: "",
    location: "",
    message: ""
  });
  const [loading, setLoading] = useState(false); 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);   
    if (!formData.fullName || !formData.email) {
      setStatus({ message: "Name and Email are required.", error: true });
      setLoading(false);
      return;
    }
    setTimeout(() => {
      setLoading(false);
      setStatus({ message: "Thank you! Your enquiry has been received .", error: false });
      
    
      setFormData({
        fullName: "",
         email: "", 
         phone: "",
         eventDate: "", 
         timeWindow: "",
        expectedGuests: "",
         eventType: "", 
         package: "",
          addons: "",
        location: "",
         message: ""
      });
    }, 1000);
  };

  return (
    <div className={styles.main}>
      <div className={styles.MainContainer}>
        
    
        <div className={styles.LeftConatiner}>
          <Image
            src={oneImg}
            alt="Surge Coffee "
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
                <p>Fill out the form below and we ll get back to you within 24 hours.</p>
              </div>

              <div className={styles.formBox}>
                <input 
                  type="text" name="fullName" placeholder="Full Name" 
                  value={formData.fullName} onChange={handleChange} 
                />

                <div className={styles.row}>
                  <input 
                    type="email" name="email" placeholder="Email" 
                    value={formData.email} onChange={handleChange} 
                  />
                  <input 
                    type="number" name="phone" placeholder="Phone Number" 
                    value={formData.phone} onChange={handleChange} 
                  />
                </div>
                <div className={styles.row}>
                  <input 
                    type="text" name="eventDate" placeholder="Event Date" 
                    value={formData.eventDate} onChange={handleChange} 
                  />
                  <input 
                    type="text" name="timeWindow" placeholder="Time Window" 
                    value={formData.timeWindow} onChange={handleChange} 
                  />
                </div>
                <div className={styles.row}>
                  <input 
                    type="text" name="expectedGuests" placeholder="Expected Guests" 
                    value={formData.expectedGuests} onChange={handleChange} 
                  />
                  <input 
                    type="text" name="eventType" placeholder="Event Type" 
                    value={formData.eventType} onChange={handleChange} 
                  />
                </div>
                <div className={styles.row}>
                  <input 
                    type="number" name="package" placeholder="Package (e.g. 30, 50)" 
                    value={formData.package} onChange={handleChange} 
                  />
                  <input 
                    type="text" name="addons" placeholder="Add-ons (e.g. water, desserts)" 
                    value={formData.addons} onChange={handleChange} 
                  />
                </div>
                <input 
                  type="text" name="location" placeholder="Location" 
                  value={formData.location} onChange={handleChange} 
                />
                <input
                  name="message"
                  placeholder="Tell us about your event"
                  value={formData.message}
                  onChange={handleChange}
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