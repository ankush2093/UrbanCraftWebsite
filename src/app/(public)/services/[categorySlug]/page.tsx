"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ALL_SERVICES, SERVICE_CATEGORIES } from "@/lib/servicesData";
import { useGetMarketplaceServicesQuery, useGetMarketplaceCategoriesQuery } from "@/store/api";
import ServiceCard from "@/components/Marketplace/ServiceCard";
import {
  Search,
  Filter,
  Star,
  ChevronRight,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  ShieldCheck,
} from "lucide-react";

export default function CategoryServicesPage() {
  const params = useParams();
  const categorySlug = params?.categorySlug as string;

  const { data: servicesRes } = useGetMarketplaceServicesQuery({ category: categorySlug });
  const { data: categoriesRes } = useGetMarketplaceCategoriesQuery();

  const categoriesList =
    categoriesRes?.data && categoriesRes.data.length > 0
      ? categoriesRes.data
      : SERVICE_CATEGORIES;

  const categoryData = categoriesList.find((c) => c.slug === categorySlug) || SERVICE_CATEGORIES.find((c) => c.slug === categorySlug);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("popular");

  const rawServices =
    servicesRes?.data && servicesRes.data.length > 0
      ? servicesRes.data
      : ALL_SERVICES.filter((s) => s.categorySlug === categorySlug);

  const services = useMemo(() => {
    let list = rawServices.filter((s) => s.categorySlug === categorySlug || !categorySlug);

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          s.options.some((opt) => opt.name.toLowerCase().includes(q))
      );
    }

    if (selectedPriceRange === "under-300") {
      list = list.filter((s) => s.startingPrice < 300);
    } else if (selectedPriceRange === "300-600") {
      list = list.filter((s) => s.startingPrice >= 300 && s.startingPrice <= 600);
    } else if (selectedPriceRange === "600-1000") {
      list = list.filter((s) => s.startingPrice >= 600 && s.startingPrice <= 1000);
    } else if (selectedPriceRange === "above-1000") {
      list = list.filter((s) => s.startingPrice > 1000);
    }

    if (minRating > 0) {
      list = list.filter((s) => s.rating >= minRating);
    }

    if (sortBy === "price-low") {
      list.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [rawServices, categorySlug, searchTerm, selectedPriceRange, minRating, sortBy]);

  if (!categoryData) {
    return (
      <div className="container py-5 text-center">
        <h3>Category not found</h3>
        <p className="text-muted">The requested service category does not exist.</p>
        <Link href="/services" className="btn btn-primary rounded-pill px-4">
          View All Services
        </Link>
      </div>
    );
  }

  return (
    <div className="py-4" style={{ minHeight: "80vh" }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small text-muted">
            <li className="breadcrumb-item">
              <Link href="/" className="text-decoration-none text-muted">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/services" className="text-decoration-none text-muted">Services</Link>
            </li>
            <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">
              {categoryData.name}
            </li>
          </ol>
        </nav>

        {/* Category Hero Banner */}
        <div
          className="p-4 p-md-5 rounded-4 border mb-4 shadow-sm text-white position-relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          }}
        >
          <div className="row align-items-center g-4 position-relative" style={{ zIndex: 2 }}>
            <div className="col-lg-8">
              <span className="badge bg-primary text-white rounded-pill px-3 py-1 fw-bold mb-2">
                VERIFIED PATNA PROFESSIONALS
              </span>
              <h1 className="fw-bold fs-2 mb-2">{categoryData.name}</h1>
              <p className="text-light opacity-75 mb-3" style={{ maxWidth: "600px" }}>
                {categoryData.description}. Background verified technicians, transparent rates & 30-day service warranty.
              </p>
              <div className="d-flex align-items-center gap-3 text-light small">
                <span className="d-flex align-items-center gap-1">
                  <ShieldCheck size={16} className="text-success" />
                  <span>30-Day Guarantee</span>
                </span>
                <span>•</span>
                <span>⭐ 4.88+ Rated in Patna</span>
              </div>
            </div>
            <div className="col-lg-4 text-lg-end d-none d-lg-block">
              <img
                src={categoryData.image}
                alt={categoryData.name}
                className="rounded-4 object-fit-cover shadow"
                style={{ width: "160px", height: "130px" }}
              />
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-3 rounded-4 border mb-4 shadow-sm d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div className="position-relative w-100" style={{ maxWidth: "420px" }}>
            <Search size={16} className="text-muted position-absolute" style={{ top: "11px", left: "14px" }} />
            <input
              type="text"
              className="form-control ps-5 py-2"
              style={{ borderRadius: "10px", fontSize: "14px", borderColor: "#cbd5e1" }}
              placeholder={`Search in ${categoryData.name}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="d-flex align-items-center gap-3 w-100 w-md-auto justify-content-end">
            <select
              className="form-select form-select-sm"
              style={{ borderRadius: "8px", width: "auto" }}
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
            >
              <option value="all">All Prices</option>
              <option value="under-300">Under ₹300</option>
              <option value="300-600">₹300 - ₹600</option>
              <option value="600-1000">₹600 - ₹1000</option>
              <option value="above-1000">Above ₹1000</option>
            </select>

            <select
              className="form-select form-select-sm"
              style={{ borderRadius: "8px", width: "auto" }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popular">Popular</option>
              <option value="rating">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Services Grid */}
        <div className="row g-4">
          {services.map((service) => (
            <div key={service.id} className="col-12 col-md-6 col-lg-4">
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {services.length === 0 && (
          <div className="empty-state-card mt-3">
            <h4 className="fw-bold text-dark mb-1">No services found in this category</h4>
            <p className="text-muted small mb-4">
              Try searching with different terms or check other categories.
            </p>
            <Link href="/services" className="btn btn-primary rounded-pill px-4 fw-bold">
              View All Categories
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
