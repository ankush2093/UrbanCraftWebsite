"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
} from "lucide-react";

function ServicesContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { data: servicesRes } = useGetMarketplaceServicesQuery();
  const { data: categoriesRes } = useGetMarketplaceCategoriesQuery();

  const servicesList =
    servicesRes?.data && servicesRes.data.length > 0
      ? servicesRes.data
      : ALL_SERVICES;

  const categoriesList =
    categoriesRes?.data && categoriesRes.data.length > 0
      ? categoriesRes.data
      : SERVICE_CATEGORIES;

  const filteredServices = useMemo(() => {
    let list = [...servicesList];

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.categoryName.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          s.options.some((opt) => opt.name.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory !== "all") {
      list = list.filter((s) => s.categorySlug === selectedCategory);
    }

    // Price
    if (selectedPriceRange === "under-300") {
      list = list.filter((s) => s.startingPrice < 300);
    } else if (selectedPriceRange === "300-600") {
      list = list.filter((s) => s.startingPrice >= 300 && s.startingPrice <= 600);
    } else if (selectedPriceRange === "600-1000") {
      list = list.filter((s) => s.startingPrice >= 600 && s.startingPrice <= 1000);
    } else if (selectedPriceRange === "above-1000") {
      list = list.filter((s) => s.startingPrice > 1000);
    }

    // Rating
    if (minRating > 0) {
      list = list.filter((s) => s.rating >= minRating);
    }

    // Sorting
    if (sortBy === "price-low") {
      list.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "popular") {
      list.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return list;
  }, [servicesList, searchTerm, selectedCategory, selectedPriceRange, minRating, sortBy]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedPriceRange("all");
    setMinRating(0);
    setSortBy("popular");
  };

  const currentCategoryData = categoriesList.find((c) => c.slug === selectedCategory);

  return (
    <div className="py-4" style={{ minHeight: "80vh" }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small text-muted">
            <li className="breadcrumb-item">
              <Link href="/" className="text-decoration-none text-muted">Home</Link>
            </li>
            <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">
              {currentCategoryData ? currentCategoryData.name : "All Services"}
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="bg-white p-4 rounded-4 border mb-4 shadow-sm">
          <div className="row align-items-center g-3">
            <div className="col-lg-7">
              <h1 className="fw-bold text-dark fs-3 mb-1">
                {currentCategoryData ? currentCategoryData.name : "Doorstep Home Services in Patna"}
              </h1>
              <p className="text-muted small mb-0">
                {currentCategoryData
                  ? currentCategoryData.description
                  : "Book certified plumbers, electricians, cleaners, AC technicians and salon experts."}
              </p>
            </div>

            {/* Quick Search in Listing */}
            <div className="col-lg-5">
              <div className="position-relative">
                <Search size={18} className="text-muted position-absolute" style={{ top: "12px", left: "14px" }} />
                <input
                  type="text"
                  className="form-control ps-5 py-2"
                  style={{ borderRadius: "12px", borderColor: "#cbd5e1", fontSize: "14px" }}
                  placeholder="Filter by service name or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="btn btn-link position-absolute text-muted p-0"
                    style={{ top: "10px", right: "14px" }}
                    onClick={() => setSearchTerm("")}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar Filter & Grid */}
        <div className="row g-4">
          {/* Desktop Filter Sidebar */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="bg-white p-4 rounded-4 border shadow-sm" style={{ top: "90px", position: "sticky" }}>
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <span className="fw-bold text-dark d-flex align-items-center gap-2">
                  <SlidersHorizontal size={18} className="text-primary" />
                  Filters
                </span>
                <button
                  type="button"
                  className="btn btn-link text-primary text-decoration-none small p-0 fw-semibold"
                  onClick={resetFilters}
                >
                  Reset All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <label className="fw-bold text-dark small mb-2 text-uppercase" style={{ fontSize: "12px" }}>
                  Category
                </label>
                <div className="d-flex flex-column gap-1" style={{ maxHeight: "220px", overflowY: "auto" }}>
                  <button
                    type="button"
                    className={`btn btn-sm text-start py-1 px-2 rounded-2 ${
                      selectedCategory === "all" ? "btn-primary fw-bold" : "btn-light text-dark"
                    }`}
                    onClick={() => setSelectedCategory("all")}
                  >
                    All Categories ({servicesList.length})
                  </button>
                  {categoriesList.map((cat) => {
                    const count = servicesList.filter((s) => s.categorySlug === cat.slug).length;
                    return (
                      <button
                        key={cat.id || cat.slug}
                        type="button"
                        className={`btn btn-sm text-start py-1 px-2 rounded-2 d-flex align-items-center justify-content-between ${
                          selectedCategory === cat.slug ? "btn-primary fw-bold" : "btn-light text-dark"
                        }`}
                        onClick={() => setSelectedCategory(cat.slug)}
                      >
                        <span className="text-truncate" style={{ maxWidth: "160px" }}>{cat.name}</span>
                        <span className="small opacity-75">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-4">
                <label className="fw-bold text-dark small mb-2 text-uppercase" style={{ fontSize: "12px" }}>
                  Price Range
                </label>
                <div className="d-flex flex-column gap-1">
                  {[
                    { id: "all", label: "All Prices" },
                    { id: "under-300", label: "Under ₹300" },
                    { id: "300-600", label: "₹300 - ₹600" },
                    { id: "600-1000", label: "₹600 - ₹1000" },
                    { id: "above-1000", label: "₹1000 & Above" },
                  ].map((p) => (
                    <div key={p.id} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="priceFilter"
                        id={p.id}
                        checked={selectedPriceRange === p.id}
                        onChange={() => setSelectedPriceRange(p.id)}
                      />
                      <label className="form-check-label small text-muted" htmlFor={p.id}>
                        {p.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-4">
                <label className="fw-bold text-dark small mb-2 text-uppercase" style={{ fontSize: "12px" }}>
                  Minimum Rating
                </label>
                <div className="d-flex flex-column gap-1">
                  {[
                    { val: 0, label: "Any Rating" },
                    { val: 4.5, label: "4.5★ & Above" },
                    { val: 4.8, label: "4.8★ & Above" },
                  ].map((r) => (
                    <div key={r.val} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="ratingFilter"
                        id={`rating-${r.val}`}
                        checked={minRating === r.val}
                        onChange={() => setMinRating(r.val)}
                      />
                      <label className="form-check-label small text-muted d-flex align-items-center gap-1" htmlFor={`rating-${r.val}`}>
                        {r.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Services Grid */}
          <div className="col-lg-9">
            {/* Top Toolbar */}
            <div className="d-flex align-items-center justify-content-between mb-3 bg-white p-3 rounded-3 border">
              <div className="small text-muted fw-semibold">
                Showing <strong>{filteredServices.length}</strong> available services
              </div>

              <div className="d-flex align-items-center gap-2">
                {/* Mobile Filter Trigger Button */}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary d-lg-none d-flex align-items-center gap-1 rounded-pill px-3"
                  onClick={() => setMobileFilterOpen(true)}
                >
                  <Filter size={14} />
                  <span>Filters</span>
                </button>

                {/* Sort Dropdown */}
                <div className="d-flex align-items-center gap-2">
                  <span className="small text-muted d-none d-sm-inline">Sort by:</span>
                  <select
                    className="form-select form-select-sm"
                    style={{ borderRadius: "8px", width: "auto" }}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Top Rated (4.8+)</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="row g-4">
              {filteredServices.map((service) => (
                <div key={service.id} className="col-12 col-md-6 col-xl-4">
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredServices.length === 0 && (
              <div className="empty-state-card mt-3">
                <div
                  className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: "64px", height: "64px", color: "#94a3b8" }}
                >
                  <Search size={32} />
                </div>
                <h4 className="fw-bold text-dark mb-1">No services match your filters</h4>
                <p className="text-muted small mb-4">
                  Try adjusting your price range, clearing search terms, or resetting filters.
                </p>
                <button
                  type="button"
                  className="btn btn-primary rounded-pill px-4 fw-bold"
                  onClick={resetFilters}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet / Filter Modal */}
      {mobileFilterOpen && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-bottom m-0 position-fixed bottom-0 start-0 end-0">
            <div
              className="modal-content border-0 shadow-lg"
              style={{ borderTopLeftRadius: "24px", borderTopRightRadius: "24px", maxHeight: "85vh" }}
            >
              <div className="modal-header border-bottom p-3">
                <h6 className="modal-title fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <Filter size={18} className="text-primary" />
                  Filter Services
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMobileFilterOpen(false)}
                ></button>
              </div>

              <div className="modal-body p-4" style={{ overflowY: "auto" }}>
                {/* Category */}
                <div className="mb-4">
                  <label className="fw-bold small mb-2">Category</label>
                  <select
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categoriesList.map((c) => (
                      <option key={c.id || c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <label className="fw-bold small mb-2">Price</label>
                  <select
                    className="form-select"
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                  >
                    <option value="all">All Prices</option>
                    <option value="under-300">Under ₹300</option>
                    <option value="300-600">₹300 - ₹600</option>
                    <option value="600-1000">₹600 - ₹1000</option>
                    <option value="above-1000">₹1000 & Above</option>
                  </select>
                </div>

                {/* Min Rating */}
                <div className="mb-4">
                  <label className="fw-bold small mb-2">Rating</label>
                  <select
                    className="form-select"
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                  >
                    <option value={0}>Any Rating</option>
                    <option value={4.5}>4.5★ & Above</option>
                    <option value={4.8}>4.8★ & Above</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer border-top p-3 d-flex align-items-center justify-content-between">
                <button
                  type="button"
                  className="btn btn-light text-muted"
                  onClick={resetFilters}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-4 rounded-pill fw-bold"
                  onClick={() => setMobileFilterOpen(false)}
                >
                  Show Results ({filteredServices.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="container py-5 text-center text-muted">Loading services in Patna...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
