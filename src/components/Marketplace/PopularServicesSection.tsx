"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ALL_SERVICES } from "@/lib/servicesData";
import { useGetMarketplaceServicesQuery, useGetMarketplaceCategoriesQuery } from "@/store/api";
import ServiceCard from "./ServiceCard";
import { ArrowRight, Flame } from "lucide-react";

export const PopularServicesSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: servicesRes } = useGetMarketplaceServicesQuery();
  const { data: categoriesRes } = useGetMarketplaceCategoriesQuery();

  const servicesList =
    servicesRes?.data && servicesRes.data.length > 0
      ? servicesRes.data
      : ALL_SERVICES;

  const popularServices = servicesList.filter((s) => s.popular);

  const categories =
    categoriesRes?.data && categoriesRes.data.length > 0
      ? categoriesRes.data
      : [];

  const filterTabs = [
    { id: "all", label: "All Popular" },
    ...(categories.length > 0
      ? categories.slice(0, 6).map((c) => ({ id: c.slug, label: c.name }))
      : [
          { id: "ac-services", label: "AC Services" },
          { id: "home-cleaning", label: "Cleaning" },
          { id: "mens-salon", label: "Men's Salon" },
          { id: "womens-salon", label: "Women's Salon" },
          { id: "electrician", label: "Electrician" },
          { id: "plumber", label: "Plumber" },
        ]),
  ];

  const filtered = popularServices.filter((s) => {
    if (activeFilter === "all") return true;
    return s.categorySlug === activeFilter;
  });

  return (
    <section className="py-5" style={{ background: "#ffffff" }}>
      <div className="container">
        <div className="section-header-row flex-column flex-md-row align-items-start align-items-md-end gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-3 py-1 fw-bold d-inline-flex align-items-center gap-1" style={{ fontSize: "11px" }}>
                <Flame size={13} />
                MOST BOOKED IN PATNA
              </span>
            </div>
            <h2 className="section-title">Popular Doorstep Services</h2>
            <p className="section-subtitle">
              Verified top-rated professionals trusted by over 15,000 households
            </p>
          </div>

          {/* Filter Pills */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                  activeFilter === tab.id
                    ? "btn-primary shadow-sm"
                    : "btn-light border text-muted"
                }`}
                style={{ fontSize: "13px" }}
                onClick={() => setActiveFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="row g-4">
          {filtered.map((service) => (
            <div key={service.id || service.slug} className="col-12 col-sm-6 col-lg-3">
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

        {/* Explore CTA */}
        <div className="text-center mt-5">
          <Link
            href="/services"
            className="btn btn-outline-primary fw-bold px-5 py-3 rounded-pill d-inline-flex align-items-center gap-2"
          >
            <span>Explore All 50+ Home Services</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularServicesSection;

