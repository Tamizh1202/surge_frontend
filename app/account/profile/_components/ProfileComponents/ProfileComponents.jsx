"use client";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useSession, signOut } from "next-auth/react"; // signOut import kiya gaya hai routing fix ke liye
import styles from "./ProfileComponents.module.css";
import { UAE_STATES } from "./profileConstants";
import {
  updateProfileAPI,
  saveAddressAPI,
  updateAddressAPI,
  deleteAddressAPI,
  removeProfileImageAPI,
  confirmDeleteAccountAPI,
  changeEmailOtpAPI,
  verifyChangeEmailOtpAPI,
} from "./profileApiUtils";
import {
  validateEmail,
  validateRequired,
  validateUAEPhone,
} from "@/utils/validatorFunctions";
import ProfilePictureSection from "./_components/ProfilePictureSection";
import PersonalInfoForm from "./_components/PersonalInfoForm";
import OtpVerificationPopup from "./_components/OtpVerificationPopup";
import AddressSection from "./_components/AddressSection";
import AddressFormPopup from "./_components/AddressFormPopup";
import DeleteAddressPopup from "./_components/DeleteAddressPopup";
import DeleteAccountPopup from "./_components/DeleteAccountPopup";

const ProfileComponents = ({ initialData }) => {
  const { update, data: session, status } = useSession();
  const token = session?.user?.["paylaod-token"];
  const isGuestUser = status === "unauthenticated";

  const userData = initialData?.user || initialData || {};

  const [profile, setProfile] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    phone: userData.phone || "",
    gender: userData.gender || "male",
    profileImage: userData.profileImage || null,
  });
  const [originalEmail, setOriginalEmail] = useState(userData.email || "");
  const [tempEmail, setTempEmail] = useState(userData.email || "");

  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  const [showOTP, popOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);
  const skipSyncRef = useRef(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => setCountdown((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    if (val && index < 3) inputRefs.current[index + 1].focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const [addresses, setAddresses] = useState(
    Array.isArray(userData.addresses) ? userData.addresses : [],
  );
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [showEditAddressPopup, setShowEditAddressPopup] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({});
  const [addressErrors, setAddressErrors] = useState({});
  const [addressGeneralError, setAddressGeneralError] = useState("");
  const [activeLabelBtn, setActiveLabelBtn] = useState(null);

  const [showDeleteAddressPopup, setShowDeleteAddressPopup] = useState(false);
  const [deleteAddressId, setDeleteAddressId] = useState(null);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [accountStatus, setAccountStatus] = useState(null);

  useEffect(() => {
    if (skipSyncRef.current) {
      skipSyncRef.current = false;
      return;
    }
    if ((initialData || session?.user) && !editMode) {
      const sUser = session?.user;
      const iData = initialData?.user || initialData?.data || initialData || {};

      setProfile((prev) => ({
        ...prev,
        firstName: sUser?.firstName || iData.firstName || prev.firstName,
        lastName: sUser?.lastName || iData.lastName || prev.lastName,
        email: sUser?.email !== undefined ? sUser.email : iData.email !== undefined ? iData.email : prev.email,
        phone: sUser?.phone !== undefined ? sUser.phone : iData.phone !== undefined ? iData.phone : prev.phone,
        gender: sUser?.gender !== undefined ? sUser.gender : iData.gender !== undefined ? iData.gender : prev.gender,
      }));
      setOriginalEmail(sUser?.email !== undefined ? sUser.email : iData.email !== undefined ? iData.email : originalEmail);
      setTempEmail(sUser?.email !== undefined ? sUser.email : iData.email !== undefined ? iData.email : originalEmail);
      if (Array.isArray(iData.addresses)) {
        setAddresses(iData.addresses);
      }
    }
  }, [initialData, session, status, editMode]);

  const handleFieldChange = (field, value) => {
    if (field === "__editMode__") {
      setEditMode(true);
      return;
    }
    if (field === "email") {
      if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
      setTempEmail(value);
      return;
    }
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    const newErrors = {};
    const fnErr = validateRequired((profile.firstName || "").trim(), "First name");
    const lnErr = validateRequired((profile.lastName || "").trim(), "Last name");
    if (fnErr) newErrors.firstName = fnErr;
    if (lnErr) newErrors.lastName = lnErr;
    if (profile.phone) {
      const phErr = validateUAEPhone(profile.phone);
      if (phErr) newErrors.phone = phErr;
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      phone: (profile.phone || "").trim(),
      gender: (profile.gender || "male").toLowerCase(),
    };

    const result = await updateProfileAPI(session?.user?.id, payload);
    if (result?.success) {
      await update({
        user: {
          ...session.user,
          firstName: payload.firstName,
          lastName: payload.lastName,
          phone: payload.phone,
          gender: payload.gender,
        },
      });
      skipSyncRef.current = true;
      setOriginalEmail(profile.email);
      setTempEmail(profile.email);
      setEditMode(false);
      toast.success(result.data?.message || "Profile updated successfully!");
    } else {
      const msg = result.message || "Failed to update profile";
      setErrors({ general: msg });
      toast.error(msg);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setTempEmail(originalEmail);
    setErrors({});
  };

  const handleVerifyEmail = async () => {
    const emailToVerify = tempEmail?.trim();
    if (!emailToVerify) return;
    const emailErr = validateEmail(emailToVerify);
    if (emailErr) {
      setErrors((prev) => ({ ...prev, email: emailErr }));
      return;
    }
    const result = await changeEmailOtpAPI(emailToVerify);
    if (result.success) {
      popOTP(true);
      setCountdown(60);
      toast.success(result.message || "OTP sent successfully!");
    } else {
      setErrors((prev) => ({ ...prev, email: result.message }));
      toast.error(result.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length < 4) {
      toast.error("Please enter the complete 4-digit code.");
      return;
    }
    const newEmail = tempEmail?.trim();
    const result = await verifyChangeEmailOtpAPI(newEmail, otpString);
    if (result.success) {
      setProfile((prev) => ({ ...prev, email: newEmail }));
      await update({ user: { ...session.user, email: newEmail } });
      skipSyncRef.current = true;
      popOTP(false);
      setOtp(["", "", "", ""]);
      setOriginalEmail(newEmail);
      setTempEmail(newEmail);
      toast.success(result.message || "Email updated successfully!");
    } else {
      toast.error(result.message || "Invalid OTP.");
    }
  };

  const handleUploadProfilePic = async (mediaDoc) => {
    if (!mediaDoc) return;
    setProfile((prev) => ({ ...prev, profileImage: mediaDoc }));
    const res = await updateProfileAPI(session?.user?.id, { profileImage: mediaDoc.id });
    if (res?.success) {
      await update({ user: { ...session.user, profileImage: mediaDoc } });
      skipSyncRef.current = true;
      toast.success("Profile picture uploaded!");
    }
  };

  const handleRemoveProfilePic = async () => {
    const res = await removeProfileImageAPI(session?.user?.id);
    if (res?.success) {
      setProfile((prev) => ({ ...prev, profileImage: null }));
      await update({ user: { ...session.user, profileImage: null } });
      skipSyncRef.current = true;
      toast.success("Profile picture removed!");
    }
  };

  const handleAddressFormChange = (field, value) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
    if (addressErrors[field]) setAddressErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const openAddAddress = () => {
    setEditingAddressId(null);
    setActiveLabelBtn("Home");
    setAddressForm({ isDefault: true, country: "United Arab Emirates", state: "dubai", label: "Home" });
    setAddressErrors({});
    setShowAddressPopup(true);
  };

  const openEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    const normalizedLabel = addr.label?.charAt(0).toUpperCase() + addr.label?.slice(1).toLowerCase();
    const finalLabel = ["Home", "Work"].includes(normalizedLabel) ? normalizedLabel : "Others";
    setActiveLabelBtn(finalLabel);
    setAddressForm({ ...addr, address: addr.street || addr.address || "", streetNumber: addr.streetNumber || "", phone: addr.phoneNumber || "", state: (addr.emirates || addr.state || "dubai").toLowerCase().replace(/\s+/g, "_"), label: finalLabel });
    setShowEditAddressPopup(true);
  };

  const handleSaveAddress = async () => {
    if (isSubmittingAddress) return;
    setIsSubmittingAddress(true);
    try {
      const payload = {
        label: addressForm.label,
        addressFirstName: addressForm.addressFirstName,
        addressLastName: addressForm.addressLastName,
        street: addressForm.address,
        streetNumber: addressForm.streetNumber,
        apartment: addressForm.apartment,
        city: addressForm.city,
        country: "United Arab Emirates",
        emirates: addressForm.state,
        phoneNumber: addressForm.phone,
        isDefaultAddress: addressForm.isDefault,
      };
      const result = await saveAddressAPI(session?.user?.id, payload, token);
      if (result?.success) {
        const sn = addressForm.streetNumber || "";
        const patched = result.updatedAddresses.map((a, idx, arr) =>
          idx === arr.length - 1 ? { ...a, streetNumber: a.streetNumber || sn } : a
        );
        setAddresses(patched);
        setShowAddressPopup(false);
        toast.success("Address saved!");
      }
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  const handleUpdateAddress = async () => {
    if (isSubmittingAddress) return;
    setIsSubmittingAddress(true);
    try {
      const payload = {
        addressId: editingAddressId,
        label: addressForm.label,
        addressFirstName: addressForm.addressFirstName,
        addressLastName: addressForm.addressLastName,
        street: addressForm.address,
        streetNumber: addressForm.streetNumber,
        apartment: addressForm.apartment,
        city: addressForm.city,
        country: "United Arab Emirates",
        emirates: addressForm.state,
        phoneNumber: addressForm.phone,
        isDefaultAddress: addressForm.isDefault,
      };
      const result = await updateAddressAPI(session?.user?.id, payload);
      if (result?.success) {
        const sid = editingAddressId;
        const sn = addressForm.streetNumber || "";
        const patched = result.updatedAddresses.map((a) =>
          a.id === sid ? { ...a, streetNumber: a.streetNumber || sn } : a
        );
        setAddresses(patched);
        setShowEditAddressPopup(false);
        toast.success("Address updated!");
      }
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  const handleDeleteRequest = (id) => {
    setDeleteAddressId(id);
    setShowDeleteAddressPopup(true);
  };

  const handleConfirmDeleteAddress = async () => {
    setAddresses(addresses.filter((a) => a.id !== deleteAddressId));
    setShowDeleteAddressPopup(false);
    await deleteAddressAPI(session?.user?.id, deleteAddressId);
  };

  const handleDeleteAccount = () => setShowDeletePopup(true);

  // FIX: ROUTING AND SESSION CLEARING
  const handleConfirmDeleteAccount = async () => {
    if (!session?.user?.id) return;
    const result = await confirmDeleteAccountAPI(session?.user?.id);
    if (result.success) {
      setShowDeletePopup(false);
      toast.success("Account deleted successfully.");
      // routing fix: signOut will clear the session and redirect to home
      await signOut({ callbackUrl: "/" });
    } else {
      toast.error(result.error || "Failed to delete account.");
    }
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.MainContainer}>
          <ProfilePictureSection
            profileImageUrl={profile.profileImage?.url || null}
            isGuestUser={isGuestUser}
            onUpload={handleUploadProfilePic}
            onRemove={handleRemoveProfilePic}
          />

          <div className={styles.Bottom}>
            <PersonalInfoForm
              profile={{ ...profile, email: tempEmail }}
              editMode={editMode}
              errors={errors}
              isGuestUser={isGuestUser}
              originalEmail={originalEmail}
              onFieldChange={handleFieldChange}
              onSave={handleSaveProfile}
              onCancel={handleCancelEdit}
              onVerifyEmail={handleVerifyEmail}
              showOtpPopup={showOTP}
              otpNode={
                <OtpVerificationPopup
                  email={tempEmail}
                  countdown={countdown}
                  otp={otp}
                  inputRefs={inputRefs}
                  onChange={handleOtpChange}
                  onKeyDown={handleOtpKeyDown}
                  onVerify={handleVerifyOtp}
                  onResend={handleVerifyEmail}
                  onClose={() => popOTP(false)}
                />
              }
            />

            {!isGuestUser && (
              <AddressSection
                addresses={addresses}
                onAddNew={openAddAddress}
                onEdit={openEditAddress}
                onDeleteRequest={handleDeleteRequest}
              />
            )}
            {!isGuestUser && (
              <div className={styles.DeleteAccount}>
                <h4>Delete Account</h4>
                <button onClick={handleDeleteAccount}>Delete My Account</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddressPopup && (
        <AddressFormPopup
          mode="add"
          addressForm={addressForm}
          addressErrors={addressErrors}
          activeLabelBtn={activeLabelBtn}
          UAE_STATES={UAE_STATES}
          isSubmitting={isSubmittingAddress}
          onFormChange={handleAddressFormChange}
          onLabelSelect={(label) => {
            setActiveLabelBtn(label);
            handleAddressFormChange("label", label);
          }}
          onSave={handleSaveAddress}
          onCancel={() => setShowAddressPopup(false)}
        />
      )}

      {showEditAddressPopup && (
        <AddressFormPopup
          mode="edit"
          addressForm={addressForm}
          addressErrors={addressErrors}
          activeLabelBtn={activeLabelBtn}
          UAE_STATES={UAE_STATES}
          isSubmitting={isSubmittingAddress}
          onFormChange={handleAddressFormChange}
          onLabelSelect={(label) => {
            setActiveLabelBtn(label);
            handleAddressFormChange("label", label);
          }}
          onSave={handleUpdateAddress}
          onCancel={() => setShowEditAddressPopup(false)}
        />
      )}

      {showDeleteAddressPopup && (
        <DeleteAddressPopup
          onConfirm={handleConfirmDeleteAddress}
          onCancel={() => setShowDeleteAddressPopup(false)}
        />
      )}

      {showDeletePopup && (
        <DeleteAccountPopup
          accountStatus={accountStatus}
          onKeep={() => setShowDeletePopup(false)}
          onConfirm={handleConfirmDeleteAccount}
        />
      )}
    </>
  );
};

export default ProfileComponents;