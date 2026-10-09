"use client";

import React from "react";
import {
  ShieldCheck,
  ReceiptText,
  CreditCard,
  CalendarSync,
  Award,
  Headphones,
} from "lucide-react";

export const WhyChooseUsSection: React.FC = () => {
  const trustCards = [
    {
      title: "Verified Professionals",
      desc: "Every partner undergoes mandatory 4-level background check and skill audit.",
      icon: ShieldCheck,
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      title: "Transparent Pricing",
      desc: "Upfront standard rates with zero hidden charges or surprise surcharges.",
      icon: ReceiptText,
      color: "#059669",
      bg: "#ecfdf5",
    },
    {
      title: "Secure Payments",
      desc: "Pay online via UPI/Cards or choose convenient Cash/UPI after service completion.",
      icon: CreditCard,
      color: "#f59e0b",
      bg: "#fffbeb",
    },
    {
      title: "Easy Rescheduling",
      desc: "Change your appointment date or time slot with a single click at zero extra fee.",
      icon: CalendarSync,
      color: "#8b5cf6",
      bg: "#f5f3ff",
    },
    {
      title: "Service Warranty",
      desc: "Enjoy 30 to 90 days unconditional service warranty with free revisit guarantee.",
      icon: Award,
      color: "#ec4899",
      bg: "#fdf2f8",
    },
    {
      title: "Customer Support",
      desc: "Dedicated support team available 8 AM – 9 PM to resolve questions swiftly.",
      icon: Headphones,
      color: "#06b6d4",
      bg: "#ecfeff",
    },
  ];

  return (
    <section className="py-5" style={{ background: "#ffffff" }}>
      <div className="container">
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 fw-bold mb-2" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
            WHY CHOOSE US
          </span>
          <h2 className="section-title text-center">Your Safety & Satisfaction First</h2>
          <p className="section-subtitle text-center">
            We hold ourselves to the highest standards of reliability, safety and workmanship
          </p>
        </div>

        <div className="row g-4">
          {trustCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="col-12 col-md-6 col-lg-4">
                <div className="trust-card">
                  <div
                    className="trust-icon-box"
                    style={{ backgroundColor: card.bg, color: card.color }}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="trust-card-title">{card.title}</h3>
                    <p className="trust-card-desc">{card.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
