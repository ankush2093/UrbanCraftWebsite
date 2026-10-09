"use client";

import React from "react";
import Link from "next/link";
import { SERVICE_CATEGORIES } from "@/lib/servicesData";
import { useGetMarketplaceCategoriesQuery } from "@/store/api";
import {
  Sparkles,
  Scissors,
  Brush,
  Wind,
  Wrench,
  Zap,
  Droplets,
  Hammer,
  ShieldAlert,
  Paintbrush,
  ShieldCheck,
  Home,
  Heart,
  Layers,
  ArrowRight,
} from "lucide-react";

// Icon mapping helper
const getCategoryIcon = (iconName: string, color?: string) => {
  const props = { size: 26, strokeWidth: 1.8, style: { color: color || "#2563eb" } };
  switch (iconName) {
    case "Sparkles":
      return <Sparkles {...props} />;
    case "Scissors":
      return <Scissors {...props} />;
    case "Brush":
      return <Brush {...props} />;
    case "Wind":
      return <Wind {...props} />;
    case "Wrench":
      return <Wrench {...props} />;
    case "Zap":
      return <Zap {...props} />;
    case "Droplets":
      return <Droplets {...props} />;
    case "Hammer":
      return <Hammer {...props} />;
    case "ShieldAlert":
      return <ShieldAlert {...props} />;
    case "Paintbrush":
      return <Paintbrush {...props} />;
    case "ShieldCheck":
      return <ShieldCheck {...props} />;
    case "Home":
      return <Home {...props} />;
    case "Heart":
      return <Heart {...props} />;
    default:
      return <Layers {...props} />;
  }
};

export const CategorySection: React.FC = () => {
  const { data: categoriesRes } = useGetMarketplaceCategoriesQuery();
  const categories =
    categoriesRes?.data && categoriesRes.data.length > 0
      ? categoriesRes.data
      : SERVICE_CATEGORIES;

  return (
    <section className="category-section-wrap">
      <div className="container">
        <div className="section-header-row">
          <div>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 fw-bold mb-2" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
              EXPLORE OUR EXPERTISE
            </span>
            <h2 className="section-title">All Service Categories</h2>
            <p className="section-subtitle">
              Choose from 14+ home care, grooming, repair and maintenance categories
            </p>
          </div>
          <Link
            href="/services"
            className="d-none d-md-inline-flex align-items-center gap-2 fw-bold text-primary text-decoration-none"
            style={{ fontSize: "14px" }}
          >
            <span>View All Services</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Mobile Horizontal Scroll / Swiper */}
        <div className="d-block d-md-none mb-3">
          <div className="mobile-category-scroll">
            {categories.map((cat) => (
              <div key={cat.id || cat.slug} className="mobile-category-item">
                <Link
                  href={`/services/${cat.slug}`}
                  className="category-card p-3"
                  style={{ minHeight: "140px" }}
                >
                  <div
                    className="category-icon-bubble"
                    style={{
                      backgroundColor: `${cat.color || "#2563eb"}15`,
                      width: "48px",
                      height: "48px",
                      overflow: "hidden",
                    }}
                  >
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
                      />
                    ) : (
                      getCategoryIcon(cat.icon, cat.color)
                    )}
                  </div>
                  <div className="category-card-name text-center" style={{ fontSize: "12px" }}>
                    {cat.name}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Grid Layout (4-5 per row) */}
        <div className="d-none d-md-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "16px" }}>
          {categories.map((cat) => (
            <Link
              key={cat.id || cat.slug}
              href={`/services/${cat.slug}`}
              className="category-card"
            >
              <div
                className="category-icon-bubble"
                style={{
                  backgroundColor: `${cat.color || "#2563eb"}15`,
                  overflow: "hidden",
                }}
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "14px" }}
                  />
                ) : (
                  getCategoryIcon(cat.icon, cat.color)
                )}
              </div>

              <div className="text-center">
                <div className="category-card-name">{cat.name}</div>
                <div className="category-card-desc">{cat.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

