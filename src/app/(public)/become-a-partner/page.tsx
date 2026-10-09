"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  ShieldCheck,
  TrendingUp,
  Banknote,
  Users,
  CheckCircle2,
  PhoneCall,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";

import { PATNA_LOCATIONS, SERVICE_CATEGORIES } from "@/lib/servicesData";
import { useApplyPartnerMutation, useGetMarketplaceCategoriesQuery } from "@/store/api";

export default function BecomePartnerPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    category: "ac-services",
    experienceYears: "3-5 years",
    city: "Patna",
    locality: "Kankarbagh",
    address: "",
    pincode: "800020",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [applyPartner, { isLoading: isSubmitting }] = useApplyPartnerMutation();
  const { data: categoriesData } = useGetMarketplaceCategoriesQuery();
  const categories = categoriesData?.data || SERVICE_CATEGORIES;

  const handleLocalityChange = (locName: string) => {
    const loc = PATNA_LOCATIONS.find((l) => l.name === locName);
    setFormData((prev) => ({
      ...prev,
      locality: locName,
      pincode: loc?.pincode || prev.pincode,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await applyPartner(formData).unwrap();
      setIsSubmitted(true);
      toast.success("Partner application received! Our onboarding team in Patna will contact you within 24 hours.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit partner application");
    }
  };

  return (
    <div className="py-5" style={{ minHeight: "85vh" }}>
      <div className="container">
        {/* Hero Banner */}
        <div
          className="p-4 p-md-5 rounded-4 text-white mb-5 shadow-lg position-relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}
        >
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="badge bg-warning text-dark fw-bold px-3 py-1 rounded-pill mb-2">
                JOIN PATNA&apos;S #1 PARTNER NETWORK
              </span>
              <h1 className="fw-bold fs-2 mb-3">
                Grow Your Home Service Business with UrbanCraft
              </h1>
              <p className="text-light opacity-90 fs-6 mb-4">
                Earn ₹35,000 – ₹70,000+ every month with steady high-ticket customer bookings in Patna, zero marketing hassle, and guaranteed weekly payouts.
              </p>

              <div className="d-flex flex-wrap gap-4 text-light small">
                <div className="d-flex align-items-center gap-2">
                  <TrendingUp size={18} className="text-warning" />
                  <span>3x Higher Income</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Banknote size={18} className="text-success" />
                  <span>Weekly Bank Payouts</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <ShieldCheck size={18} className="text-info" />
                  <span>Insurance & Safety Cover</span>
                </div>
              </div>
            </div>

            {/* Application Card Form */}
            <div className="col-lg-5">
              <div className="bg-white p-4 rounded-4 text-dark shadow-sm">
                <h4 className="fw-bold text-dark fs-5 mb-1">Quick Partner Registration</h4>
                <p className="text-muted small mb-3">Join in less than 2 minutes</p>

                {isSubmitted ? (
                  <div className="text-center py-4">
                    <CheckCircle2 size={48} className="text-success mx-auto mb-2" />
                    <h5 className="fw-bold text-dark">Application Submitted!</h5>
                    <p className="text-muted small mb-0">
                      Our partner manager in Patna will call you on <strong>{formData.phone}</strong> for document verification.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                      <label className="fw-semibold small mb-1">Full Name</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="mb-2">
                      <label className="fw-semibold small mb-1">Mobile Number (WhatsApp)</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="mb-2">
                      <label className="fw-semibold small mb-1">Select Skill / Service</label>
                      <select
                        className="form-select form-select-sm"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {categories.map((c: any) => (
                          <option key={c.id || c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-2">
                      <label className="fw-semibold small mb-1">Experience in Patna</label>
                      <select
                        className="form-select form-select-sm"
                        value={formData.experienceYears}
                        onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                      >
                        <option value="1-2 years">1 - 2 Years</option>
                        <option value="3-5 years">3 - 5 Years</option>
                        <option value="5+ years">5+ Years (Master)</option>
                      </select>
                    </div>

                    <div className="row g-2 mb-2">
                      <div className="col-7">
                        <label className="fw-semibold small mb-1">Patna Locality / Area *</label>
                        <select
                          className="form-select form-select-sm"
                          value={formData.locality}
                          onChange={(e) => handleLocalityChange(e.target.value)}
                          required
                        >
                          {PATNA_LOCATIONS.map((loc) => (
                            <option key={loc.id} value={loc.name}>
                              {loc.name} ({loc.pincode})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-5">
                        <label className="fw-semibold small mb-1">Pincode *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          required
                          placeholder="800020"
                          value={formData.pincode}
                          onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="fw-semibold small mb-1">Shop / House / Street Address *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        placeholder="e.g. Shop No 4, Main Road, Near PC Colony"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-2 rounded-pill fw-bold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting Application..." : "Submit Partner Application"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Cards */}
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="bg-white p-4 rounded-4 border h-100 shadow-sm text-center">
              <div
                className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: "56px", height: "56px" }}
              >
                <Users size={28} />
              </div>
              <h5 className="fw-bold text-dark mb-2">Steady Daily Customers</h5>
              <p className="text-muted small mb-0">
                No need to search for work or bargain. Receive verified bookings matching your location in Patna automatically.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="bg-white p-4 rounded-4 border h-100 shadow-sm text-center">
              <div
                className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: "56px", height: "56px" }}
              >
                <Banknote size={28} />
              </div>
              <h5 className="fw-bold text-dark mb-2">Guaranteed On-Time Payouts</h5>
              <p className="text-muted small mb-0">
                Weekly bank deposits with complete financial transparency and incentives on 5-star ratings.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="bg-white p-4 rounded-4 border h-100 shadow-sm text-center">
              <div
                className="rounded-circle bg-warning-subtle text-warning d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: "56px", height: "56px" }}
              >
                <Sparkles size={28} />
              </div>
              <h5 className="fw-bold text-dark mb-2">Skill Upgradation & Kits</h5>
              <p className="text-muted small mb-0">
                Receive professional safety uniforms, tool subsidy assistance and masterclass certification training.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
