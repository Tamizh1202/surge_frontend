"use client";
// ─── DeleteAccountPopup ───────────────────────────────────────────────────────
// Full-screen confirmation popup shown before permanently deleting the account.
// Displays subscription / active order warnings if present.
//
// Props:
//   accountStatus  object | null  — { activeSubscriptions, activeOrders } from the API
//   onKeep         () => void     — user chooses to keep the account
//   onConfirm      () => void     — user confirms deletion

import React from "react";
import styles from "../ProfileComponents.module.css";

const DeleteAccountPopup = ({ accountStatus, onKeep, onConfirm }) => {
  return (
    <div className={styles.DeletePopupOverlay} onClick={onKeep}>
      <div className={styles.DeletePopup} onClick={(e) => e.stopPropagation()}>
        <h3>Delete your Account ?</h3>

        {accountStatus ? (
          <>
            {accountStatus.activeSubscriptions?.count > 0 && (
              <p>
                You currently have an active subscription on this account, which
                will be cancelled.{" "}
                {accountStatus.activeOrders?.count > 0 &&
                  "If you have any pending orders, they will still be delivered."}
              </p>
            )}
            {accountStatus.activeSubscriptions?.count === 0 &&
              accountStatus.activeOrders?.count > 0 && (
                <p>Any pending orders will still be delivered.</p>
              )}
          </>
        ) : (
          <p>
         Deleting your account will permanently remove your profile, order history, and saved preferences. Any active order will still be delivered. This action cannot be undone.
          </p>
        )}

       

        <div className={styles.DeletePopupActions}>
          <button style={{ backgroundColor: "white", border: "1px solid #C4754E" , color: " #C4754E" }} onClick={onKeep}>Keep Account</button>
          <button className={styles.DeleteDanger} onClick={onConfirm}>
            Delete Anyway
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountPopup;
