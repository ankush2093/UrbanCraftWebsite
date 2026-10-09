"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSelectedLocation } from "@/lib/bookingStorage";
import { ALL_SERVICES } from "@/lib/servicesData";
import {
  Search,
  MapPin,
  Sparkles,
  ShieldCheck,
  Clock,
  Star,
  ArrowRight,
  Zap,
} from "lucide-react";

interface HeroSectionProps {
  onOpenLocationModal: () => void;
}

const SUGGESTED_SEARCHES = [
  "AC Service",
  "Home Cleaning",
  "Salon at Home",
  "Electrician",
  "Plumber",
  "Carpenter",
  "Appliance Repair",
  "Pest Control",
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenLocationModal }) => {
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState("Kankarbagh, Patna");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setCurrentLocation(getSelectedLocation());
    const handleLocUpdate = () => {
      setCurrentLocation(getSelectedLocation());
    };
    window.addEventListener("location_updated", handleLocUpdate);
    return () => window.removeEventListener("location_updated", handleLocUpdate);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const searchResults = ALL_SERVICES.filter((s) => {
    if (!debouncedSearch) return false;
    const q = debouncedSearch.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.categoryName.toLowerCase().includes(q) ||
      s.shortDescription.toLowerCase().includes(q)
    );
  }).slice(0, 5);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowDropdown(false);
    }
  };

  const handleSelectSuggestion = (serviceSlug: string) => {
    router.push(`/service/${serviceSlug}`);
    setShowDropdown(false);
  };

  const handleChipClick = (tag: string) => {
    router.push(`/services?search=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="hero-wrapper">
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Left Column: Headlines and Search */}
          <div className="col-lg-7">
            <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
              <button
                type="button"
                className="hero-location-tag border-0 cursor-pointer"
                onClick={onOpenLocationModal}
              >
                <MapPin size={15} className="text-danger" />
                <span>Serving in: <strong>{currentLocation}</strong></span>
                <span className="badge bg-primary text-white ms-1 rounded-pill" style={{ fontSize: "10px" }}>Change</span>
              </button>

              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill py-1 px-3 fw-semibold d-flex align-items-center gap-1" style={{ fontSize: "12px" }}>
                <Zap size={13} />
                Guaranteed 30-Min Arrival
              </span>
            </div>

            <h1 className="hero-heading">
              Reliable services, <br />
              <span style={{ color: "#2563eb" }}>right at your doorstep</span>
            </h1>

            <p className="hero-description">
              Book trusted professionals for home, beauty, repair and maintenance services across Patna. Certified experts with transparent pricing.
            </p>

            {/* Global Hero Search Box */}
            <div className="position-relative">
              <form onSubmit={handleSearchSubmit} className="hero-search-box">
                <Search size={22} className="text-muted" />
                <input
                  type="text"
                  className="hero-search-input"
                  placeholder="What service are you looking for?"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                />
                <button type="submit" className="hero-search-btn">
                  <span>Search</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Suggestions Dropdown */}
              {showDropdown && debouncedSearch && (
                <div className="global-search-suggestions-dropdown">
                  <div className="p-2 px-3 bg-light border-bottom text-muted small fw-bold text-uppercase">
                    Matching Services for &quot;{debouncedSearch}&quot;
                  </div>
                  {searchResults.map((srv) => (
                    <div
                      key={srv.id}
                      className="suggestion-item-row"
                      onClick={() => handleSelectSuggestion(srv.slug)}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={srv.image}
                          alt={srv.name}
                          style={{ width: "42px", height: "42px", objectFit: "cover", borderRadius: "8px" }}
                        />
                        <div>
                          <div className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                            {srv.name}
                          </div>
                          <div className="text-muted" style={{ fontSize: "12px" }}>
                            {srv.categoryName} • {srv.duration}
                          </div>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold text-primary" style={{ fontSize: "14px" }}>
                          ₹{srv.startingPrice}
                        </div>
                        <div className="small text-muted" style={{ fontSize: "11px" }}>
                          ⭐ {srv.rating}
                        </div>
                      </div>
                    </div>
                  ))}

                  {searchResults.length === 0 && (
                    <div className="p-3 text-center text-muted small">
                      No exact services matched. Press Enter to search all categories.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Suggested Searches Chips */}
            <div className="suggested-chips">
              <span className="chip-label">Popular searches:</span>
              {SUGGESTED_SEARCHES.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="search-chip-btn"
                  onClick={() => handleChipClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Trust Metrics */}
            <div className="hero-stats-row">
              <div className="hero-stat-item">
                <div className="hero-stat-icon">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div className="hero-stat-val">100% Verified</div>
                  <div className="hero-stat-lbl">Background Checked</div>
                </div>
              </div>

              <div className="hero-stat-item">
                <div className="hero-stat-icon" style={{ background: "#ecfdf5", color: "#059669" }}>
                  <Star size={22} />
                </div>
                <div>
                  <div className="hero-stat-val">4.88 / 5.0</div>
                  <div className="hero-stat-lbl">15,000+ Patna Homes</div>
                </div>
              </div>

              <div className="hero-stat-item">
                <div className="hero-stat-icon" style={{ background: "#fffbeb", color: "#d97706" }}>
                  <Clock size={22} />
                </div>
                <div>
                  <div className="hero-stat-val">30-Min Arrival</div>
                  <div className="hero-stat-lbl">Quick Doorstep Service</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="col-lg-5 d-none d-lg-block">
            <div className="position-relative">
              {/* Main Visual Image */}
              <div
                className="rounded-4 overflow-hidden shadow-lg border"
                style={{ height: "440px", position: "relative" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"
                  alt="Home Services Professionals in Patna"
                  className="w-100 h-100 object-fit-cover"
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%)",
                  }}
                />
                <div className="position-absolute bottom-0 start-0 p-4 text-white">
                  <span className="badge bg-warning text-dark fw-bold mb-2">⭐ Patna's #1 Rated</span>
                  <h4 className="fw-bold mb-1">Professional Home Experts</h4>
                  <p className="small text-white-50 mb-0">Delivering hygiene, repairs and salon at your home.</p>
                </div>
              </div>

              {/* Floating Badge 1: Real-time booking */}
              <div
                className="position-absolute bg-white p-3 rounded-4 shadow-lg border d-flex align-items-center gap-3"
                style={{ top: "-20px", right: "-20px", zIndex: 3, maxWidth: "230px" }}
              >
                <div
                  className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
                  style={{ width: "42px", height: "42px", flexShrink: 0 }}
                >
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="fw-bold text-dark" style={{ fontSize: "13px" }}>₹100 Instant OFF</div>
                  <div className="text-muted" style={{ fontSize: "11px" }}>Use code: <strong>WELCOME100</strong></div>
                </div>
              </div>

              {/* Floating Badge 2: Certified Partner */}
              <div
                className="position-absolute bg-white p-3 rounded-4 shadow-lg border d-flex align-items-center gap-3"
                style={{ bottom: "-20px", left: "-20px", zIndex: 3 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Certified Professional"
                  className="rounded-circle"
                  style={{ width: "46px", height: "46px", objectFit: "cover" }}
                />
                <div>
                  <div className="fw-bold text-dark" style={{ fontSize: "13px" }}>Ranjeet S. (Certified)</div>
                  <div className="text-success fw-semibold" style={{ fontSize: "11px" }}>⭐ 4.9 • 840+ Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
