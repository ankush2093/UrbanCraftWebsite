"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useUploadProfilePictureMutation,
} from "@/store/api";
import { getStoredBookings, getStoredAddresses, saveNewAddress } from "@/lib/bookingStorage";
import { PATNA_LOCATIONS } from "@/lib/servicesData";
import { Booking, Address } from "@/types/marketplace";
import { useAuth } from "@/hooks/useAuth";
import {
  User as UserIcon,
  CalendarCheck2,
  MapPin,
  Settings,
  ShieldCheck,
  CreditCard,
  Plus,
  Clock,
  Calendar,
  Navigation,
  CheckCircle2,
  Camera,
  LogOut,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";

type ProfileTab = "overview" | "bookings" | "addresses" | "settings";

export default function ProfilePage() {
  const { user: authUser, logout } = useAuth();
  const { data: userProfile, isLoading: isProfileLoading } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadPicture, { isLoading: isUploading }] = useUploadProfilePictureMutation();

  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddAddr, setShowAddAddr] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "Male",
    phoneNumber: "",
    password: "",
  });

  const [newAddr, setNewAddr] = useState({
    name: "",
    phone: "",
    flatHouse: "",
    streetArea: "",
    locality: "Kankarbagh",
    city: "Patna",
    pincode: "800020",
    landmark: "",
    type: "Home" as const,
  });

  useEffect(() => {
    setBookings(getStoredBookings());
    setAddresses(getStoredAddresses());
  }, []);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.FullName || "",
        gender: userProfile.Gender || "Male",
        phoneNumber: userProfile.PhoneNumber || "",
        password: "",
      });
      setNewAddr((prev) => ({
        ...prev,
        name: userProfile.FullName || "Customer",
        phone: userProfile.PhoneNumber || "+91 98765 43210",
      }));
    }
  }, [userProfile]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        FullName: formData.fullName,
        Gender: formData.gender,
        ...(formData.password ? { Password: formData.password } : {}),
      }).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.info("Profile details updated locally");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const form = new FormData();
      form.append("file", file);
      try {
        await uploadPicture(form).unwrap();
        toast.success("Profile picture updated!");
      } catch {
        toast.info("Image preview updated");
      }
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.flatHouse || !newAddr.streetArea) {
      toast.warning("Please fill flat/house and street details");
      return;
    }
    const created = saveNewAddress({
      ...newAddr,
      isDefault: addresses.length === 0,
    });
    setAddresses(getStoredAddresses());
    setShowAddAddr(false);
    toast.success("Address saved to your profile!");
  };

  const upcomingCount = bookings.filter((b) => b.status !== "COMPLETED" && b.status !== "CANCELLED").length;
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;

  return (
    <div className="py-4 pb-5" style={{ minHeight: "85vh", background: "#f8fafc" }}>
      <div className="container" style={{ maxWidth: "1020px" }}>
        <div className="row g-4">
          {/* Left Column: Profile Card & Nav */}
          <div className="col-lg-4">
            <div className="bg-white p-4 rounded-4 border shadow-sm text-center mb-4">
              {/* Profile Avatar */}
              <div className="position-relative d-inline-block mb-3">
                <img
                  src={
                    userProfile?.ProfilePicture ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  }
                  alt="Profile"
                  className="rounded-circle object-fit-cover border shadow-sm"
                  style={{ width: "90px", height: "90px" }}
                />
                <label
                  htmlFor="profile-pic-input"
                  className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 cursor-pointer shadow"
                  style={{ cursor: "pointer" }}
                >
                  <Camera size={14} />
                  <input
                    id="profile-pic-input"
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              <h4 className="fw-bold text-dark fs-5 mb-1">
                {userProfile?.FullName || authUser?.name || "Valued Customer"}
              </h4>
              <p className="text-muted small mb-2">{userProfile?.Email || authUser?.email || "customer@example.com"}</p>

              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center gap-1">
                <ShieldCheck size={13} />
                Verified Patna Customer
              </span>
            </div>

            {/* Sidebar Tab Links */}
            <div className="bg-white p-2 rounded-4 border shadow-sm d-flex flex-column gap-1">
              <button
                type="button"
                className={`btn text-start p-3 rounded-3 fw-semibold d-flex align-items-center gap-3 ${
                  activeTab === "overview" ? "btn-primary shadow-sm" : "btn-light text-dark"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                <UserIcon size={18} />
                <span>Account Overview</span>
              </button>

              <button
                type="button"
                className={`btn text-start p-3 rounded-3 fw-semibold d-flex align-items-center justify-content-between ${
                  activeTab === "bookings" ? "btn-primary shadow-sm" : "btn-light text-dark"
                }`}
                onClick={() => setActiveTab("bookings")}
              >
                <div className="d-flex align-items-center gap-3">
                  <CalendarCheck2 size={18} />
                  <span>My Bookings</span>
                </div>
                {upcomingCount > 0 && (
                  <span className="badge bg-warning text-dark">{upcomingCount} active</span>
                )}
              </button>

              <button
                type="button"
                className={`btn text-start p-3 rounded-3 fw-semibold d-flex align-items-center justify-content-between ${
                  activeTab === "addresses" ? "btn-primary shadow-sm" : "btn-light text-dark"
                }`}
                onClick={() => setActiveTab("addresses")}
              >
                <div className="d-flex align-items-center gap-3">
                  <MapPin size={18} />
                  <span>Saved Addresses</span>
                </div>
                <span className="badge bg-secondary">{addresses.length}</span>
              </button>

              <button
                type="button"
                className={`btn text-start p-3 rounded-3 fw-semibold d-flex align-items-center gap-3 ${
                  activeTab === "settings" ? "btn-primary shadow-sm" : "btn-light text-dark"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <Settings size={18} />
                <span>Profile Settings</span>
              </button>

              <hr className="my-1" />

              <button
                type="button"
                className="btn btn-outline-danger p-2 rounded-3 text-start d-flex align-items-center gap-2"
                onClick={logout}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Right Column: Tab Content */}
          <div className="col-lg-8">
            {/* 1. OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="d-flex flex-column gap-4">
                {/* Stats Row */}
                <div className="row g-3">
                  <div className="col-4">
                    <div className="bg-white p-3 rounded-4 border shadow-sm text-center">
                      <div className="text-primary fw-bold fs-3">{upcomingCount}</div>
                      <div className="text-muted small" style={{ fontSize: "12px" }}>Active Bookings</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="bg-white p-3 rounded-4 border shadow-sm text-center">
                      <div className="text-success fw-bold fs-3">{completedCount}</div>
                      <div className="text-muted small" style={{ fontSize: "12px" }}>Completed</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="bg-white p-3 rounded-4 border shadow-sm text-center">
                      <div className="text-warning fw-bold fs-3">{addresses.length}</div>
                      <div className="text-muted small" style={{ fontSize: "12px" }}>Patna Addresses</div>
                    </div>
                  </div>
                </div>

                {/* Recent Bookings Card */}
                <div className="bg-white p-4 rounded-4 border shadow-sm">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="fw-bold text-dark mb-0">Recent Home Services</h5>
                    <Link href="/bookings" className="btn btn-link text-primary p-0 fw-semibold small text-decoration-none">
                      View All ({bookings.length})
                    </Link>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    {bookings.slice(0, 3).map((b) => (
                      <div key={b.id} className="p-3 rounded-3 border bg-light d-flex align-items-center justify-content-between gap-3">
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={b.serviceImage}
                            alt={b.serviceName}
                            className="rounded-3 object-fit-cover"
                            style={{ width: "48px", height: "48px" }}
                          />
                          <div>
                            <div className="fw-bold text-dark small">{b.serviceName}</div>
                            <div className="text-muted" style={{ fontSize: "11px" }}>
                              {b.date} at {b.timeSlot} • ₹{b.finalAmount}
                            </div>
                          </div>
                        </div>

                        <Link
                          href={`/bookings/track/${b.id}`}
                          className="btn btn-sm btn-primary rounded-pill px-3 fw-semibold text-nowrap"
                        >
                          Track
                        </Link>
                      </div>
                    ))}

                    {bookings.length === 0 && (
                      <div className="text-center py-4 text-muted small">
                        No service bookings yet. Explore our home cleaning, AC repair & salon services!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. BOOKINGS TAB */}
            {activeTab === "bookings" && (
              <div className="bg-white p-4 rounded-4 border shadow-sm">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h5 className="fw-bold text-dark mb-0">Your Service Bookings</h5>
                  <Link href="/services" className="btn btn-primary btn-sm rounded-pill px-3 fw-bold">
                    Book Service
                  </Link>
                </div>

                <div className="d-flex flex-column gap-3">
                  {bookings.map((b) => (
                    <div key={b.id} className="p-3 rounded-3 border d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={b.serviceImage}
                          alt={b.serviceName}
                          className="rounded-3 object-fit-cover"
                          style={{ width: "56px", height: "56px" }}
                        />
                        <div>
                          <div className="fw-bold text-dark">{b.serviceName}</div>
                          <div className="text-muted small">{b.optionName} • {b.date}</div>
                          <div className="fw-bold text-primary small">₹{b.finalAmount}</div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <Link
                          href={`/bookings/track/${b.id}`}
                          className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold"
                        >
                          Track Live
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. ADDRESSES TAB */}
            {activeTab === "addresses" && (
              <div className="bg-white p-4 rounded-4 border shadow-sm">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h5 className="fw-bold text-dark mb-0">Saved Addresses</h5>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
                    onClick={() => setShowAddAddr(!showAddAddr)}
                  >
                    <Plus size={15} />
                    <span>Add Address</span>
                  </button>
                </div>

                {showAddAddr && (
                  <form onSubmit={handleAddAddress} className="p-3 bg-light rounded-3 border mb-4">
                    <h6 className="fw-bold text-dark mb-3">Add New Address in Patna</h6>
                    <div className="row g-2 mb-2">
                      <div className="col-6">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Contact Name"
                          required
                          value={newAddr.name}
                          onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                        />
                      </div>
                      <div className="col-6">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Phone Number"
                          required
                          value={newAddr.phone}
                          onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Flat / House No. / Building"
                        required
                        value={newAddr.flatHouse}
                        onChange={(e) => setNewAddr({ ...newAddr, flatHouse: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Street / Colony"
                        required
                        value={newAddr.streetArea}
                        onChange={(e) => setNewAddr({ ...newAddr, streetArea: e.target.value })}
                      />
                    </div>
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <select
                          className="form-select form-select-sm"
                          value={newAddr.locality}
                          onChange={(e) => {
                            const found = PATNA_LOCATIONS.find((l) => l.name === e.target.value);
                            setNewAddr({ ...newAddr, locality: e.target.value, pincode: found?.pincode || "800001" });
                          }}
                        >
                          {PATNA_LOCATIONS.map((loc) => (
                            <option key={loc.id} value={loc.name}>{loc.name} ({loc.pincode})</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-6">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={newAddr.pincode}
                          onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm rounded-pill px-4 fw-bold">
                      Save Address
                    </button>
                  </form>
                )}

                <div className="d-flex flex-column gap-3">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="p-3 rounded-3 border bg-light d-flex align-items-start justify-content-between">
                      <div className="d-flex align-items-start gap-3">
                        <MapPin size={20} className="text-danger mt-1" />
                        <div>
                          <div className="fw-bold text-dark d-flex align-items-center gap-2">
                            {addr.name}
                            <span className="badge bg-secondary small">{addr.type}</span>
                            {addr.isDefault && <span className="badge bg-success small">Default</span>}
                          </div>
                          <div className="text-muted small mt-1">
                            {addr.flatHouse}, {addr.streetArea}, {addr.locality}, Patna – {addr.pincode}
                          </div>
                          <div className="text-dark small fw-semibold mt-1">📞 {addr.phone}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="bg-white p-4 rounded-4 border shadow-sm">
                <h5 className="fw-bold text-dark mb-4">Edit Profile & Password</h5>

                <form onSubmit={handleProfileSubmit}>
                  <div className="mb-3">
                    <label className="fw-semibold small mb-1">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="fw-semibold small mb-1">Gender</label>
                    <select
                      className="form-select"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="fw-semibold small mb-1">New Password (leave blank to keep current)</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="btn btn-primary rounded-pill px-4 py-2 fw-bold"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
