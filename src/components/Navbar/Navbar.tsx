"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ALL_SERVICES, SERVICE_CATEGORIES } from "@/lib/servicesData";
import { getSelectedLocation } from "@/lib/bookingStorage";
import LocationModal from "@/components/Marketplace/LocationModal";
import {
  MapPin,
  Search,
  ChevronDown,
  User as UserIcon,
  CalendarCheck2,
  Briefcase,
  HelpCircle,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  LogOut,
  PhoneCall,
  Home,
  Grid,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Kankarbagh, Patna");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchBoxRef = useRef<HTMLDivElement | null>(null);

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

  // Click outside search suggestions
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

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
      setShowSearchSuggestions(false);
    }
  };

  const handleSelectService = (slug: string) => {
    router.push(`/service/${slug}`);
    setShowSearchSuggestions(false);
    setSearchTerm("");
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header className="marketplace-header">
        {/* Top Info Bar */}
        <div className="marketplace-topbar d-none d-md-block">
          <div className="container d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <span className="d-flex align-items-center gap-1">
                <ShieldCheck size={14} className="text-success" />
                <span>Patna&apos;s #1 Verified Home Services Marketplace</span>
              </span>
              <span className="opacity-50">|</span>
              <span className="text-light opacity-75">30-Min Fast Doorstep Arrival</span>
            </div>

            <div className="d-flex align-items-center gap-4">
              <Link href="/become-a-partner" className="text-decoration-none">
                <span className="badge bg-warning text-dark fw-bold me-1">Join</span>
                Become a Service Partner
              </Link>
              <a href="tel:+919876543210" className="d-flex align-items-center gap-1 text-decoration-none">
                <PhoneCall size={13} />
                <span>Helpline: +91 98765 43210</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Navbar Bar */}
        <div className="container py-2">
          <div className="d-flex align-items-center justify-content-between gap-3">
            {/* Brand Logo */}
            <Link href="/" className="brand-badge me-2">
              <div className="brand-logo-icon">
               <img src="/img/logo.png" alt="" />
              </div>
            </Link>

            {/* Location Selector Button */}
            <button
              type="button"
              className="location-pill-btn d-none d-sm-flex"
              onClick={() => setLocationModalOpen(true)}
            >
              <MapPin size={15} />
              <span className="text-truncate" style={{ maxWidth: "160px" }}>
                {currentLocation}
              </span>
              <ChevronDown size={14} className="text-muted" />
            </button>

            {/* Global Search Bar (Desktop) */}
            <div className="global-search-container d-none d-lg-block" ref={searchBoxRef}>
              <form onSubmit={handleSearchSubmit} className="global-search-input-wrap">
                <Search size={16} className="text-muted" />
                <input
                  type="text"
                  placeholder="Search 'AC Service', 'Cleaning', 'Electrician'..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSearchSuggestions(true);
                  }}
                  onFocus={() => setShowSearchSuggestions(true)}
                />
              </form>

              {/* Suggestions Dropdown */}
              {showSearchSuggestions && debouncedSearch && (
                <div className="global-search-suggestions-dropdown">
                  <div className="p-2 px-3 bg-light border-bottom text-muted small fw-bold">
                    Suggested Services
                  </div>
                  {searchResults.map((s) => (
                    <div
                      key={s.id}
                      className="suggestion-item-row"
                      onClick={() => handleSelectService(s.slug)}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={s.image}
                          alt={s.name}
                          style={{ width: "32px", height: "32px", borderRadius: "6px", objectFit: "cover" }}
                        />
                        <div>
                          <div className="fw-semibold text-dark" style={{ fontSize: "13px" }}>{s.name}</div>
                          <div className="text-muted" style={{ fontSize: "11px" }}>{s.categoryName}</div>
                        </div>
                      </div>
                      <div className="fw-bold text-primary" style={{ fontSize: "13px" }}>
                        ₹{s.startingPrice}
                      </div>
                    </div>
                  ))}
                  {searchResults.length === 0 && (
                    <div className="p-3 text-center text-muted small">
                      No services found for &quot;{debouncedSearch}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <div className="d-none d-md-flex align-items-center gap-3 ms-auto">
              <Link
                href="/services"
                className={`fw-semibold text-decoration-none px-2 py-1 ${
                  isActive("/services") ? "text-primary" : "text-dark"
                }`}
                style={{ fontSize: "14px" }}
              >
                Services
              </Link>

              <Link
                href="/bookings"
                className={`fw-semibold text-decoration-none px-2 py-1 d-flex align-items-center gap-1 ${
                  isActive("/bookings") ? "text-primary" : "text-dark"
                }`}
                style={{ fontSize: "14px" }}
              >
                <CalendarCheck2 size={16} className="text-primary" />
                <span>My Bookings</span>
              </Link>

              <Link
                href="/become-a-partner"
                className="fw-semibold text-decoration-none text-dark px-2 py-1"
                style={{ fontSize: "14px" }}
              >
                Become a Partner
              </Link>

              {/* Auth / Profile Actions */}
              {isAuthenticated ? (
                <div className="dropdown ms-2">
                  <button
                    className="btn btn-outline-primary rounded-pill px-3 py-1 d-flex align-items-center gap-2 dropdown-toggle fw-semibold"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ fontSize: "13px" }}
                  >
                    <UserIcon size={14} />
                    <span className="text-truncate" style={{ maxWidth: "120px" }}>
                      {user?.name || user?.email?.split("@")[0] || "My Account"}
                    </span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 p-2 mt-2">
                    <li>
                      <Link className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2" href="/profile">
                        <UserIcon size={15} className="text-muted" />
                        <span>Profile & Addresses</span>
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2" href="/bookings">
                        <CalendarCheck2 size={15} className="text-muted" />
                        <span>My Bookings</span>
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider my-1" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item rounded-2 py-2 text-danger d-flex align-items-center gap-2"
                        onClick={logout}
                      >
                        <LogOut size={15} />
                        <span>Logout</span>
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2 ms-2">
                  <Link
                    href="/login"
                    className="btn btn-primary rounded-pill px-4 py-2 fw-bold"
                    style={{ fontSize: "13px" }}
                  >
                    Login / Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger & Location Button */}
            <div className="d-flex d-md-none align-items-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-light border rounded-pill p-1 px-2 d-flex align-items-center gap-1"
                onClick={() => setLocationModalOpen(true)}
              >
                <MapPin size={13} className="text-danger" />
                <span className="text-truncate" style={{ maxWidth: "90px", fontSize: "11px" }}>
                  {currentLocation.split(",")[0]}
                </span>
              </button>

              <button
                type="button"
                className="btn btn-light border rounded-circle p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Search Row */}
          <div className="d-block d-lg-none mt-2">
            <form onSubmit={handleSearchSubmit} className="global-search-input-wrap">
              <Search size={15} className="text-muted" />
              <input
                type="text"
                placeholder="Search services in Patna..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="d-md-none bg-white border-top p-3 shadow-lg">
            <div className="d-flex flex-column gap-2">
              <Link
                href="/"
                className="p-2 rounded-2 fw-semibold text-dark text-decoration-none d-flex align-items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home size={16} className="text-primary" />
                <span>Home</span>
              </Link>
              <Link
                href="/services"
                className="p-2 rounded-2 fw-semibold text-dark text-decoration-none d-flex align-items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Grid size={16} className="text-primary" />
                <span>All Categories & Services</span>
              </Link>
              <Link
                href="/bookings"
                className="p-2 rounded-2 fw-semibold text-dark text-decoration-none d-flex align-items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <CalendarCheck2 size={16} className="text-primary" />
                <span>My Bookings</span>
              </Link>
              <Link
                href="/become-a-partner"
                className="p-2 rounded-2 fw-semibold text-dark text-decoration-none d-flex align-items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Briefcase size={16} className="text-warning" />
                <span>Become a Partner</span>
              </Link>
              <Link
                href="/contact-us"
                className="p-2 rounded-2 fw-semibold text-dark text-decoration-none d-flex align-items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <HelpCircle size={16} className="text-info" />
                <span>Help & Support</span>
              </Link>

              <hr className="my-1" />

              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="p-2 rounded-2 fw-semibold text-dark text-decoration-none d-flex align-items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserIcon size={16} className="text-primary" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    type="button"
                    className="btn btn-outline-danger w-100 rounded-pill mt-2"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="btn btn-primary w-100 rounded-pill py-2 fw-bold text-center mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Location Modal */}
      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
