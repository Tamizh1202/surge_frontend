"use client";
import { useState, useEffect, useRef } from "react";
import styles from "../page.module.css";

// TODO: replace with Surge's actual toast
const toast = { error: (msg) => console.error(msg), success: (msg) => console.log(msg) };

// TODO: replace with Surge's actual validators
const validateRequired = (val, label) =>
  !val || !val.trim() ? `${label} is required` : "";
const validateUAEPhone = (val) =>
  !val ? "Phone is required" : !/^\d{9}$/.test(val) ? "Enter a valid UAE phone" : "";

// TODO: replace with Surge's UAE_STATES + ADDRESS_LABELS
const UAE_STATES = [
  { value: "dubai", label: "Dubai" },
  { value: "abu-dhabi", label: "Abu Dhabi" },
  { value: "sharjah", label: "Sharjah" },
  { value: "ajman", label: "Ajman" },
  { value: "fujairah", label: "Fujairah" },
  { value: "ras-al-khaimah", label: "Ras Al Khaimah" },
  { value: "umm-al-quwain", label: "Umm Al Quwain" },
];
const ADDRESS_LABELS = ["Home", "Work", "Others"];

// TODO: replace with Surge's profile API
const updateAddressAPI = async () => ({ success: true, updatedAddresses: [] });
const deleteAddressAPI = async () => ({ success: true });
const saveAddressAPI = async () => ({ success: true, updatedAddresses: [] });

// TODO: replace with Surge's actual DeleteAddressPopup
const DeleteAddressPopup = ({ onConfirm, onCancel }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ background: "#fff", padding: "24px", borderRadius: "6px", maxWidth: "400px" }}>
      <h3 style={{ marginTop: 0 }}>Delete address?</h3>
      <p>Are you sure you want to delete this address?</p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "16px" }}>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onConfirm} style={{ background: "#c00", color: "#fff" }}>Delete</button>
      </div>
    </div>
  </div>
);

// TODO: replace with Surge's actual AddressFormPopup
const AddressFormPopup = ({ mode, onSave, onCancel }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ background: "#fff", padding: "24px", borderRadius: "6px", maxWidth: "500px" }}>
      <h3 style={{ marginTop: 0 }}>{mode === "edit" ? "Edit Address" : "Add Address"}</h3>
      <p>Address form placeholder — wire to Surge's real popup later.</p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "16px" }}>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onSave}>Save</button>
      </div>
    </div>
  </div>
);

export default function ShippingAddressSection({
  delivery, status, savedAddresses, setSavedAddresses,
  selectedAddressId, setSelectedAddressId, shippingForm, setShippingForm,
  validationErrors, clearError, setValidationErrors, session,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [addressDeletePopup, setAddressDeletePopup] = useState(false);
  const [addressFormPopup, setAddressFormPopup] = useState(false);
  const [addressPopupMode, setAddressPopupMode] = useState("add");
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const menuRef = useRef(null);
  const emirateRef = useRef(null);
  const [isEmirateOpen, setIsEmirateOpen] = useState(false);

  const emptyAddressForm = {
    addressFirstName: "", addressLastName: "", address: "", apartment: "",
    city: "", state: "", phone: "", label: ADDRESS_LABELS[0], isDefault: false,
  };
  const [addressForm, setAddressForm] = useState(emptyAddressForm);
  const [activeLabelBtn, setActiveLabelBtn] = useState(ADDRESS_LABELS[0]);

  useEffect(() => {
    if (!savedAddresses || savedAddresses.length === 0) return;
    if (selectedAddressId) return;
    const defaultAddr = savedAddresses.find((a) => a.isDefault || a.isDefaultAddress);
    setSelectedAddressId(defaultAddr ? defaultAddr.id : savedAddresses[0].id);
  }, [savedAddresses]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuId(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emirateRef.current && !emirateRef.current.contains(event.target)) {
        setIsEmirateOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleEditAddress(addr) {
    setAddressToEdit(addr);
    setAddressPopupMode("edit");
    setAddressForm({
      addressFirstName: addr.addressFirstName || "",
      addressLastName: addr.addressLastName || "",
      address: addr.street || addr.address || "",
      apartment: addr.apartment || "",
      city: addr.city || "",
      state: addr.emirates || addr.state || "",
      phone: addr.phoneNumber || addr.phone || "",
      label: addr.label || ADDRESS_LABELS[0],
      isDefault: addr.isDefault || addr.isDefaultAddress || false,
    });
    setActiveLabelBtn(addr.label || ADDRESS_LABELS[0]);
    setAddressFormPopup(true);
  }

  function handleDeleteAddress(addr) {
    setAddressToDelete(addr);
    setAddressDeletePopup(true);
  }

  async function confirmDeleteAddress() {
    if (!addressToDelete) return;
    const newAddresses = savedAddresses.filter((a) => a.id !== addressToDelete.id);
    setSavedAddresses(newAddresses);
    if (selectedAddressId === addressToDelete.id) setSelectedAddressId(null);
    setAddressDeletePopup(false);
    setAddressToDelete(null);
    // TODO: call real deleteAddressAPI when wiring backend
  }

  function cancelDeleteAddress() {
    setAddressDeletePopup(false);
    setAddressToDelete(null);
  }

  async function handleSaveAddressPopup() {
    // TODO: wire real saveAddressAPI / updateAddressAPI
    setAddressFormPopup(false);
    setAddressToEdit(null);
    setAddressForm(emptyAddressForm);
  }

  function handleAddAddress() {
    setAddressPopupMode("add");
    setAddressToEdit(null);
    setAddressForm(emptyAddressForm);
    setActiveLabelBtn(ADDRESS_LABELS[0]);
    setAddressFormPopup(true);
  }

  const showInlineForm =
    delivery === "ship" &&
    (status !== "authenticated" || (status === "authenticated" && savedAddresses.length === 0));

  return (
    <div className={styles.Four}>
      {addressDeletePopup && (
        <DeleteAddressPopup onConfirm={confirmDeleteAddress} onCancel={cancelDeleteAddress} />
      )}
      {addressFormPopup && (
        <AddressFormPopup
          mode={addressPopupMode}
          onSave={handleSaveAddressPopup}
          onCancel={() => {
            setAddressFormPopup(false);
            setAddressToEdit(null);
            setAddressForm(emptyAddressForm);
            setActiveLabelBtn(ADDRESS_LABELS[0]);
          }}
        />
      )}

      {delivery === "ship" && (
        <>
          {/* <div className={styles.Three}>
            <h3>Ship to</h3>
          </div> */}

          {status === "authenticated" && savedAddresses.length > 0 && (
            <>
              <div className={styles.AddressList}>
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`${styles.AddressCard} ${selectedAddressId === addr.id ? styles.Selected : ""}`}
                    onClick={() => setSelectedAddressId(addr.id)}
                  >
                    <span className={styles.Radio}>
                      {selectedAddressId === addr.id && <span className={styles.RadioInner} />}
                    </span>

                    <div className={styles.AddressContent}>
                      <p className={styles.AddrLabel}>{addr.label || "Others"}</p>
                      <p className={styles.AddrName}>
                        {`${addr.addressFirstName || ""} ${addr.addressLastName || ""}`.trim()}
                      </p>
                      <hr className={styles.AddrDivider} />
                      <p className={styles.AddrName}>
                        {addr.street && <>{addr.street}, </>}
                        {addr.apartment && <>{addr.apartment}, </>}
                        {[
                          addr.city,
                          UAE_STATES.find((s) => s.value === addr.emirates)?.label || addr.emirates,
                          addr.country || "United Arab Emirates",
                        ].filter(Boolean).join(", ")}
                      </p>
                      <hr className={styles.AddrDivider} />
                      <p className={styles.AddrName}>Phone number: {addr.phoneNumber}</p>
                    </div>

                    <div
                      ref={openMenuId === addr.id ? menuRef : null}
                      className={styles.MenuContainer}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span
                        className={styles.MenuIcon}
                        onClick={() => setOpenMenuId(openMenuId === addr.id ? null : addr.id)}
                      >
                        <svg width="3" height="15" viewBox="0 0 3 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.5 14.5385C1.0875 14.5385 0.734417 14.3916 0.44075 14.0978C0.146917 13.8041 0 13.451 0 13.0385C0 12.626 0.146917 12.2728 0.44075 11.979C0.734417 11.6853 1.0875 11.5385 1.5 11.5385C1.9125 11.5385 2.26558 11.6853 2.55925 11.979C2.85308 12.2728 3 12.626 3 13.0385C3 13.451 2.85308 13.8041 2.55925 14.0978C2.26558 14.3916 1.9125 14.5385 1.5 14.5385ZM1.5 8.76925C1.0875 8.76925 0.734417 8.62233 0.44075 8.3285C0.146917 8.03483 0 7.68175 0 7.26925C0 6.85675 0.146917 6.50367 0.44075 6.21C0.734417 5.91617 1.0875 5.76925 1.5 5.76925C1.9125 5.76925 2.26558 5.91617 2.55925 6.21C2.85308 6.50367 3 6.85675 3 7.26925C3 7.68175 2.85308 8.03483 2.55925 8.3285C2.26558 8.62233 1.9125 8.76925 1.5 8.76925ZM1.5 3C1.0875 3 0.734417 2.85317 0.44075 2.5595C0.146917 2.26567 0 1.9125 0 1.5C0 1.0875 0.146917 0.734417 0.44075 0.44075C0.734417 0.146917 1.0875 0 1.5 0C1.9125 0 2.26558 0.146917 2.55925 0.44075C2.85308 0.734417 3 1.0875 3 1.5C3 1.9125 2.85308 2.26567 2.55925 2.5595C2.26558 2.85317 1.9125 3 1.5 3Z" fill="#6E736A" />
                        </svg>
                      </span>
                      {openMenuId === addr.id && (
                        <div className={styles.MenuDropdown}>
                          <button className={styles.MenuItem} onClick={() => { handleEditAddress(addr); setOpenMenuId(null); }}>Edit Address</button>
                          <button className={styles.MenuItem} onClick={() => { handleDeleteAddress(addr); setOpenMenuId(null); }}>Delete Address</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button className={styles.AddNewAddress} onClick={handleAddAddress}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 0V12M0 6H12" stroke="#6E736A" strokeWidth="1.5" />
                </svg>
                <p>Use a different address</p>
              </button>
            </>
          )}

          {showInlineForm && (
            <div data-lenis-prevent>

              <div className={styles.FieldWrap}>
                <input className={styles.Input} value="United Arab Emirates" readOnly />
                <label className={styles.FloatLabel}>Country / Region</label>
              </div>

              <div className={styles.Row}>
                <div className={styles.FieldWrap} style={{ flex: 1 }}>
                  <input
                    className={`${styles.Input} ${validationErrors.shippingFirstName ? styles.InputError : ""}`}
                    placeholder=" "
                    value={shippingForm.firstName}
                    onChange={(e) => { setShippingForm({ ...shippingForm, firstName: e.target.value }); clearError("shippingFirstName"); }}
                    onBlur={() => { const e = validateRequired(shippingForm.firstName, "First name"); if (e) setValidationErrors((p) => ({ ...p, shippingFirstName: e })); }}
                  />
                  <label className={styles.FloatLabel}>First Name</label>
                  {validationErrors.shippingFirstName && <span className={styles.ErrorMessage}>{validationErrors.shippingFirstName}</span>}
                </div>
                <div className={styles.FieldWrap} style={{ flex: 1 }}>
                  <input
                    className={`${styles.Input} ${validationErrors.shippingLastName ? styles.InputError : ""}`}
                    placeholder=" "
                    value={shippingForm.lastName}
                    onChange={(e) => { setShippingForm({ ...shippingForm, lastName: e.target.value }); clearError("shippingLastName"); }}
                    onBlur={() => { const e = validateRequired(shippingForm.lastName, "Last name"); if (e) setValidationErrors((p) => ({ ...p, shippingLastName: e })); }}
                  />
                  <label className={styles.FloatLabel}>Last Name</label>
                  {validationErrors.shippingLastName && <span className={styles.ErrorMessage}>{validationErrors.shippingLastName}</span>}
                </div>
              </div>

              <div className={styles.FieldWrap}>
                <input
                  className={`${styles.Input} ${validationErrors.shippingAddress ? styles.InputError : ""}`}
                  placeholder=" "
                  value={shippingForm.address}
                  onChange={(e) => { setShippingForm({ ...shippingForm, address: e.target.value }); clearError("shippingAddress"); }}
                  onBlur={() => { const e = validateRequired(shippingForm.address, "Address"); if (e) setValidationErrors((p) => ({ ...p, shippingAddress: e })); }}
                />
                <label className={styles.FloatLabel}>House number, Street name</label>
                {validationErrors.shippingAddress && <span className={styles.ErrorMessage}>{validationErrors.shippingAddress}</span>}
              </div>

              <div className={styles.FieldWrap}>
                <input
                  className={styles.Input}
                  placeholder=" "
                  value={shippingForm.apartment}
                  onChange={(e) => setShippingForm({ ...shippingForm, apartment: e.target.value })}
                />
                <label className={styles.FloatLabel}>Apartment, suite, etc. (optional)</label>
              </div>

              <div className={styles.Row}>
                <div className={styles.FieldWrap} style={{ flex: 1 }}>
                  <input
                    className={`${styles.Input} ${validationErrors.shippingCity ? styles.InputError : ""}`}
                    placeholder=" "
                    value={shippingForm.city}
                    onChange={(e) => { setShippingForm({ ...shippingForm, city: e.target.value }); clearError("shippingCity"); }}
                    onBlur={() => { const e = validateRequired(shippingForm.city, "City"); if (e) setValidationErrors((p) => ({ ...p, shippingCity: e })); }}
                  />
                  <label className={styles.FloatLabel}>City</label>
                  {validationErrors.shippingCity && <span className={styles.ErrorMessage}>{validationErrors.shippingCity}</span>}
                </div>
                <div className={styles.SelectContainer} ref={emirateRef} style={{ flex: 1 }}>
                  <div className={styles.CustomSelectTrigger} onClick={() => setIsEmirateOpen(!isEmirateOpen)}>
                    <span style={{ textTransform: "capitalize" }}>
                      {UAE_STATES.find((s) => s.value === (shippingForm.emirates || "dubai"))?.label || "Select Emirate"}
                    </span>
                    <span className={`${styles.Arrow} ${isEmirateOpen ? styles.Rotate : ""}`}>▼</span>
                  </div>
                  {isEmirateOpen && (
                    <div className={styles.CustomOptionsList}>
                      {UAE_STATES.map((opt) => (
                        <div
                          key={opt.value}
                          className={styles.OptionItem}
                          onClick={() => { setShippingForm({ ...shippingForm, emirates: opt.value }); setIsEmirateOpen(false); clearError("shippingEmirates"); }}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.FieldWrap}>
                <div className={`${styles.PhoneWrapper} ${validationErrors.shippingPhone ? styles.InputError : ""}`}>
                  <span className={styles.PhonePrefix}>+971</span>
                  <input
                    className={styles.PhoneInput}
                    placeholder="Phone"
                    value={shippingForm.phone}
                    inputMode="numeric"
                    onChange={(e) => { const numeric = e.target.value.replace(/\D/g, ""); setShippingForm({ ...shippingForm, phone: numeric }); clearError("shippingPhone"); }}
                    onBlur={() => { const e = validateUAEPhone(shippingForm.phone); if (e) setValidationErrors((p) => ({ ...p, shippingPhone: e })); }}
                  />
                </div>
                {validationErrors.shippingPhone && <span className={styles.ErrorMessage}>{validationErrors.shippingPhone}</span>}
              </div>

              {status === "authenticated" && (
                <label className={styles.CheckBox}>
                  <input
                    type="checkbox"
                    checked={shippingForm.saveAddress}
                    onChange={(e) => setShippingForm({ ...shippingForm, saveAddress: e.target.checked })}
                  />
                  <p>Save this for next time.</p>
                </label>
              )}
              <label className={styles.CheckBox}>
                <input type="checkbox" />
                <p>Save this for next time</p>
              </label>
            </div>
          )}
        </>
      )}

      {delivery === "pickup" && (
        <div className={styles.PickupList}>
          <p>Pickup Locations Near You</p>
          <div className={styles.PickupCard}>
            <input type="radio" style={{ accentColor: "var(--primary-color)" }} checked readOnly />
            <div>
              {/* TODO: replace with Surge's actual pickup location */}
              <h5>Surge Store - Main Branch</h5>
              <p>Your pickup address line, City</p>
              <span>10:00 AM – 7:00 PM</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}