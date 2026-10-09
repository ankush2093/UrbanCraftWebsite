"use client";

import React from "react";
import { Search, Calendar, UserCheck, CheckCircle2 } from "lucide-react";

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Choose a service",
      desc: "Explore 50+ standardized services with transparent, upfront pricing.",
      icon: Search,
      color: "#2563eb",
    },
    {
      num: "02",
      title: "Select date & time",
      desc: "Pick your preferred 1-hour time slot and enter your Patna address.",
      icon: Calendar,
      color: "#059669",
    },
    {
      num: "03",
      title: "Professional arrives",
      desc: "Certified, background-verified partner arrives at your doorstep with equipment.",
      icon: UserCheck,
      color: "#f59e0b",
    },
    {
      num: "04",
      title: "Get the service done",
      desc: "Relax while the job is executed to perfection with 30-day service warranty.",
      icon: CheckCircle2,
      color: "#6366f1",
    },
  ];

  return (
    <section className="py-5" style={{ background: "#f8fafc" }}>
      <div className="container">
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 fw-bold mb-2" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
            HASSLE-FREE BOOKING
          </span>
          <h2 className="section-title text-center">How It Works</h2>
          <p className="section-subtitle text-center">
            Booking doorstep home services has never been simpler. Four easy steps to a better home.
          </p>
        </div>

        <div className="row g-4">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div key={st.num} className="col-12 col-sm-6 col-lg-3">
                <div className="step-card">
                  <div className="step-num-badge">{st.num}</div>
                  <div
                    className="step-icon-circle"
                    style={{ backgroundColor: `${st.color}15`, color: st.color }}
                  >
                    <Icon size={28} />
                  </div>
                  <h3 className="step-title">{st.title}</h3>
                  <p className="step-desc">{st.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
