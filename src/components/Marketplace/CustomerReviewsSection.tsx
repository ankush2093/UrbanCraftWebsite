"use client";

import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Quote } from "lucide-react";

export const CustomerReviewsSection: React.FC = () => {
  const reviews = [
    {
      id: "1",
      name: "Dr. Ananya Mishra",
      location: "Boring Road, Patna",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      service: "Intense Bathroom Cleaning",
      review:
        "Booked deep bathroom cleaning for our flat on Boring Road. The team came with mechanized single disc scrubbers and removed years of hard water scale in 45 mins. Truly impressive standard of hygiene!",
    },
    {
      id: "2",
      name: "Vikramaditya Roy",
      location: "Kankarbagh, Patna",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      service: "AC Service & Foam Jet Wash",
      review:
        "Technician Ranjeet was very polite and thorough. Used proper waterproof spill jackets to avoid dirtying our walls and cleaned the condenser coils completely. Cooling feels brand new!",
    },
    {
      id: "3",
      name: "Pooja Srivastava",
      location: "Bailey Road, Patna",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      service: "Women's Salon & O3+ Facial",
      review:
        "The beautician arrived with single-use sealed kits, opened right in front of me. Such a relaxing salon experience in my own room without having to travel in Patna traffic.",
    },
    {
      id: "4",
      name: "Rameshwar Singh",
      location: "Patliputra Colony, Patna",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      service: "Electrician Visit & MCB Fix",
      review:
        "Short circuit caused my MCB to trip repeatedly. Booked an electrician who arrived in 25 minutes, identified the faulty wiring with a multimeter and fixed it safely. Transparent rate.",
    },
  ];

  return (
    <section className="py-5" style={{ background: "#f8fafc" }}>
      <div className="container">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-end justify-content-between mb-4 gap-3">
          <div>
            <span
              className="badge rounded-pill px-3 py-1 fw-bold mb-2 text-uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.8px",
                background: "#fef3c7",
                color: "#92400e",
                border: "1px solid #fde68a",
              }}
            >
              TESTIMONIALS
            </span>
            <h2 className="section-title">Loved by 15,000+ Patna Homes</h2>
            <p className="section-subtitle">Real reviews from verified customers across Patna</p>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="row g-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="col-12 col-md-6 col-lg-3">
              <div
                className="bg-white p-4 rounded-4 border shadow-sm h-100 d-flex flex-column justify-content-between"
                style={{
                  borderColor: "#e2e8f0",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                {/* Top: Stars & Verified Badge */}
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill="#f59e0b"
                          color="#f59e0b"
                        />
                      ))}
                    </div>
                    <span
                      className="badge rounded-pill px-2 py-1 fw-semibold"
                      style={{
                        fontSize: "10px",
                        background: "#f1f5f9",
                        color: "#475569",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      Verified
                    </span>
                  </div>

                  {/* Review Text */}
                  <p
                    className="text-muted small mb-4"
                    style={{
                      lineHeight: "1.65",
                      fontSize: "13.5px",
                      minHeight: "85px",
                    }}
                  >
                    &ldquo;{rev.review}&rdquo;
                  </p>
                </div>

                {/* Bottom: Customer Profile */}
                <div className="pt-3 border-top d-flex align-items-center gap-3">
                  <img
                    src={rev.photo}
                    alt={rev.name}
                    className="rounded-circle object-fit-cover shadow-sm"
                    style={{
                      width: "44px",
                      height: "44px",
                      flexShrink: 0,
                      border: "2px solid #e2e8f0",
                    }}
                  />
                  <div className="overflow-hidden">
                    <div
                      className="fw-bold text-dark d-flex align-items-center gap-1 text-truncate"
                      style={{ fontSize: "13.5px" }}
                    >
                      <span>{rev.name}</span>
                      <CheckCircle2
                        size={14}
                        fill="#2563eb"
                        color="#ffffff"
                        className="flex-shrink-0"
                      />
                    </div>
                    <div
                      className="text-muted text-truncate"
                      style={{ fontSize: "11px" }}
                    >
                      {rev.location}
                    </div>
                    <div
                      className="fw-semibold text-primary text-truncate mt-1"
                      style={{ fontSize: "10.5px" }}
                    >
                      {rev.service}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviewsSection;
