"use client";

import React from "react";
import styles from "../ProfileComponents.module.css";
import AddressCard from "./AddressCard";
import Image from "next/image";
import AddressZero from "./AddressZero.png";

const AddressSection = ({ addresses, onAddNew, onEdit, onDeleteRequest }) => {
 
  const mockAddresses = [
    {
      id: "default-1",
      firstName: "Ahmed",
      lastName: "Al-Mansouri",
      label: "Home",
      street: "Office 1502, Jumeirah Business Centre 1",
      apartment: "Jumeirah Lakes Towers (JLT), Cluster G",
      city: "Dubai",
      country: "UAE",
      postalCode: "450123",
      phone: "+971 50 123 4567",
      isDefaultAddress: true,
    },
    {
      id: "other-1",
      firstName: "Ahmed",
      lastName: "Al-Mansouri",
      label: "Office",
      street: "Office 1502, Jumeirah Business Centre 1",
      apartment: "Jumeirah Lakes Towers (JLT), Cluster G",
      city: "Dubai",
      country: "UAE",
      postalCode: "450123",
      phone: "+971 50 123 4567",
      isDefaultAddress: false,
    },
  ];

  // 2. Use mock data if the addresses prop is empty or not provided
  const addressList = addresses && addresses.length > 0 ? addresses : mockAddresses;

  // 3. Identification logic
  const defaultAddress = addressList.find((a) => a.isDefaultAddress);
  const otherAddresses = defaultAddress
    ? addressList.filter((a) => a.id !== defaultAddress.id)
    : addressList;
  return (
    <div className={styles.AddressSection}>
      {/* Header */}
      <div className={`${styles.AddressHeader} ${styles.SectionHeader}`}>
        <h4>Saved Address</h4>
        <button onClick={onAddNew} className={styles.AddAddressBtn}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.33333 12V6.66667H0V5.33333H5.33333V0H6.66667V5.33333H12V6.66667H6.66667V12H5.33333Z"
              fill="#C4754E"
            />
          </svg>
          <span>Add Address</span>
        </button>
      </div>

      {addressList.length > 0 ? (
        defaultAddress ? (
          <>
            <div className={styles.fixerOne}>
              <p style={{fontWeight:"600"}}>Default address</p>
              <AddressCard
                address={defaultAddress}
                onEdit={onEdit}
                onDelete={onDeleteRequest}
              />
            </div>

            {otherAddresses.length > 0 && (
              <div className={styles.fixerOne}>
                <h6 className={styles.other} style={{fontWeight:"600"}}>Other addresses</h6>
                {otherAddresses.map((addr) => (
                  <AddressCard
                    key={addr.id}
                    address={addr}
                    onEdit={onEdit}
                    onDelete={onDeleteRequest}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className={styles.fixerTwo}>
            {addressList.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                onEdit={onEdit}
                onDelete={onDeleteRequest}
              />
            ))}
          </div>
        )
      ) : (
        <div className={styles.NoAddressCard}>
          <Image
            src={AddressZero}
            alt="No addresses"
            width={200}
            height={135}
          />
          <div className={styles.NoAddressP}>
            <p style={{ color: "black", marginTop: "20px" }}>
              No Saved Addresses yet
            </p>
            <p>Add a delivery address to make checkout faster.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSection;