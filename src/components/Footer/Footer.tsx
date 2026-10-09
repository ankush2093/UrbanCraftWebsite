"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SERVICE_CATEGORIES, PATNA_LOCATIONS } from "@/lib/servicesData";
import {
  House,
  LayoutGrid,
  CalendarCheck,
  Headset,
  User,
  Sparkles,
  ShieldCheck,
  Award,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";

export const Footer: React.FC = () => {
  const pathname = usePathname();

  const mobileNavItems = [
    { href: "/", label: "Home", icon: House },
    { href: "/services", label: "Categories", icon: LayoutGrid },
    { href: "/bookings", label: "Bookings", icon: CalendarCheck },
    { href: "/contact-us", label: "Help", icon: Headset },
    { href: "/profile", label: "Profile", icon: User },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <footer className="bg-dark text-light pt-5 pb-4 mt-5" style={{ background: "#0f172a" }}>
        <div className="container">
          {/* Trust Highlights Strip */}
          <div className="row g-4 pb-4 mb-4 border-bottom border-secondary border-opacity-25">
            <div className="col-12 col-md-4 d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-primary bg-opacity-25 text-primary d-flex align-items-center justify-content-center"
                style={{ width: "48px", height: "48px", flexShrink: 0 }}
              >
                <ShieldCheck size={24} />
              </div>
              <div>
                <h6 className="fw-bold text-white mb-1">100% Verified Partners</h6>
                <p className="text-secondary small mb-0">Background checked & certified technicians</p>
              </div>
            </div>

            <div className="col-12 col-md-4 d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-success bg-opacity-25 text-success d-flex align-items-center justify-content-center"
                style={{ width: "48px", height: "48px", flexShrink: 0 }}
              >
                <Award size={24} />
              </div>
              <div>
                <h6 className="fw-bold text-white mb-1">Service Warranty</h6>
                <p className="text-secondary small mb-0">30-day revisit & satisfaction guarantee</p>
              </div>
            </div>

            <div className="col-12 col-md-4 d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-warning bg-opacity-25 text-warning d-flex align-items-center justify-content-center"
                style={{ width: "48px", height: "48px", flexShrink: 0 }}
              >
                <Clock size={24} />
              </div>
              <div>
                <h6 className="fw-bold text-white mb-1">30-Min Rapid Arrival</h6>
                <p className="text-secondary small mb-0">Prompt doorstep support across Patna</p>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-4">
            {/* Brand & Mission */}
            <div className="col-lg-4 col-md-6">
              <Link href="/" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-3">
                <div
                  className="rounded-3 bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{ width: "36px", height: "36px" }}
                >
                  <Sparkles size={18} />
                </div>
                <span className="fw-bold text-white fs-4">UrbanCraft</span>
              </Link>
              <p className="text-secondary small mb-4" style={{ lineHeight: "1.7" }}>
                UrbanCraft is Patna&apos;s leading on-demand home services platform, connecting skilled, background-verified professionals with households for cleaning, AC repair, plumbing, salon at home, and appliance care.
              </p>

              <div className="d-flex flex-column gap-2 text-secondary small">
                <div className="d-flex align-items-center gap-2">
                  <MapPin size={15} className="text-primary" />
                  <span>Patna, Bihar – 800001</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <PhoneCall size={15} className="text-primary" />
                  <span>+91 98765 43210 (8 AM – 9 PM)</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Mail size={15} className="text-primary" />
                  <span>support@urbancraft.in</span>
                </div>
              </div>
            </div>

            {/* Service Categories */}
            <div className="col-lg-3 col-6">
              <h6 className="text-white fw-bold mb-3 text-uppercase" style={{ fontSize: "13px", letterSpacing: "0.8px" }}>
                Top Services
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small text-secondary mb-0">
                {SERVICE_CATEGORIES.slice(0, 7).map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/services/${cat.slug}`}
                      className="text-secondary text-decoration-none hover-white"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links & Partners */}
            <div className="col-lg-2 col-6">
              <h6 className="text-white fw-bold mb-3 text-uppercase" style={{ fontSize: "13px", letterSpacing: "0.8px" }}>
                Company
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-2 small text-secondary mb-0">
                <li>
                  <Link href="/services" className="text-secondary text-decoration-none">All Services</Link>
                </li>
                <li>
                  <Link href="/bookings" className="text-secondary text-decoration-none">My Bookings</Link>
                </li>
                <li>
                  <Link href="/become-a-partner" className="text-warning text-decoration-none fw-semibold">Become a Partner</Link>
                </li>
                <li>
                  <Link href="/contact-us" className="text-secondary text-decoration-none">Contact Us</Link>
                </li>
                <li>
                  <Link href="/privacy-and-poliy" className="text-secondary text-decoration-none">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms-conditions" className="text-secondary text-decoration-none">Terms & Conditions</Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="text-secondary text-decoration-none">Refund Policy</Link>
                </li>
              </ul>
            </div>

            {/* Patna Service Localities */}
            <div className="col-lg-3 col-md-6">
              <h6 className="text-white fw-bold mb-3 text-uppercase" style={{ fontSize: "13px", letterSpacing: "0.8px" }}>
                Patna Service Hubs
              </h6>
              <div className="d-flex flex-wrap gap-1">
                {PATNA_LOCATIONS.map((loc) => (
                  <span
                    key={loc.id}
                    className="badge bg-secondary bg-opacity-25 text-light fw-normal py-1 px-2"
                    style={{ fontSize: "11px" }}
                  >
                    {loc.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="border-top border-secondary border-opacity-25 pt-3 d-flex flex-column flex-md-row align-items-center justify-content-between text-secondary small gap-2">
            <div>© {new Date().getFullYear()} UrbanCraft Technologies Pvt Ltd. All rights reserved.</div>
            <div>Built for fast, reliable doorstep home care in Patna.</div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav" aria-label="Mobile bottom navigation">
        {mobileNavItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`mobile-bottom-nav__item${isActive(href) ? " is-active" : ""}`}
          >
            <Icon size={22} strokeWidth={2} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="mobile-bottom-nav__spacer" />
    </>
  );
};

export default Footer;
