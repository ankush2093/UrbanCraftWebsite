"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Wind, ShieldCheck, Tag, ArrowRight } from "lucide-react";

export const PromotionalBanners: React.FC = () => {
  return (
    <section className="py-4">
      <div className="container">
        <div className="row g-4">
          {/* Banner 1: First Booking */}
          <div className="col-lg-6">
            <div
              className="promo-card h-100"
              style={{
                background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                borderColor: "#bfdbfe",
              }}
            >
              <div>
                <span className="promo-tag bg-primary text-white">
                  Limited Period Offer
                </span>
                <h3 className="promo-title">Get ₹100 OFF on your first booking</h3>
                <p className="promo-desc">
                  Enjoy premium home care with certified professionals in Patna. Use code <strong>WELCOME100</strong> at checkout.
                </p>
                <Link
                  href="/services"
                  className="btn btn-primary fw-bold px-4 py-2 rounded-pill d-inline-flex align-items-center gap-2"
                  style={{ fontSize: "13px" }}
                >
                  <span>Claim ₹100 Off</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
              <div
                className="d-none d-sm-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm flex-shrink-0"
                style={{ width: "80px", height: "80px", color: "#2563eb" }}
              >
                <Tag size={38} />
              </div>
            </div>
          </div>

          {/* Banner 2: AC & Cleaning Summer Season */}
          <div className="col-lg-6">
            <div
              className="promo-card h-100"
              style={{
                background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                borderColor: "#a7f3d0",
              }}
            >
              <div>
                <span className="promo-tag bg-success text-white">
                  Seasonal Special
                </span>
                <h3 className="promo-title">Professional AC & Cleaning at Doorstep</h3>
                <p className="promo-desc">
                  High-pressure jet foam cleaning with 30-day cooling guarantee. Slots filling fast in Patna.
                </p>
                <Link
                  href="/services/ac-services"
                  className="btn btn-success fw-bold px-4 py-2 rounded-pill d-inline-flex align-items-center gap-2 text-white"
                  style={{ fontSize: "13px" }}
                >
                  <span>Book AC Service</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
              <div
                className="d-none d-sm-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm flex-shrink-0"
                style={{ width: "80px", height: "80px", color: "#059669" }}
              >
                <Wind size={38} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanners;
