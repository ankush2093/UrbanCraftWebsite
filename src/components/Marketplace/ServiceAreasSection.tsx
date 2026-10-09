"use client";

import React, { useState } from "react";
import { useGetMarketplaceZonesQuery } from "@/store/api";
import { PATNA_LOCATIONS } from "@/lib/servicesData";
import { MapPin, CheckCircle, ArrowUpRight, Zap, Navigation, Building } from "lucide-react";
import { setSelectedLocation } from "@/lib/bookingStorage";

interface ServiceAreasSectionProps {
  onSelectArea?: (areaName: string) => void;
}

export const ServiceAreasSection: React.FC<ServiceAreasSectionProps> = ({ onSelectArea }) => {
  const [selectedCity, setSelectedCity] = useState("ALL");
  const { data: zonesData } = useGetMarketplaceZonesQuery();

  const handleAreaClick = (areaName: string, city: string = "Patna") => {
    const formatted = `${areaName}, ${city}`;
    setSelectedLocation(formatted);
    if (onSelectArea) {
      onSelectArea(formatted);
    }
    // Dispatch custom event for navbar sync
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("location_updated"));
    }
  };

  const zones = Array.isArray(zonesData?.data) && zonesData.data.length > 0 ? zonesData.data : [];

  // Get unique cities from database zones or default list
  const availableCities = Array.from(
    new Set(["ALL", ...zones.map((z: any) => z.City || z.city || "Patna"), "Patna", "Delhi NCR", "Bengaluru", "Mumbai"])
  );

  const filteredZones = zones.filter((z: any) => {
    if (selectedCity === "ALL") return true;
    return (z.City || z.city) === selectedCity;
  });

  return (
    <section className="py-5" style={{ background: "#ffffff" }}>
      <div className="container">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-end justify-content-between mb-4 gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-primary text-white rounded-pill px-3 py-1 fw-bold" style={{ fontSize: "11px" }}>
                LIVE GEO-COVERAGE
              </span>
              <span className="text-muted small">
                {zones.length > 0 ? `${zones.length} Active Service Zones Configured` : "All Core Zones Active"}
              </span>
            </div>
            <h2 className="section-title">Serving Patna & Major Cities Across India</h2>
            <p className="section-subtitle">
              Instant 30-minute doorstep service across all residential colonies, tech hubs, and commercial sectors.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 text-success fw-bold small">
            <CheckCircle size={18} />
            <span>100% Verified Partners & On-Time Arrival Guarantee</span>
          </div>
        </div>

        {/* City Filter Pills */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {availableCities.map((city) => (
            <button
              key={city}
              type="button"
              className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${
                selectedCity === city
                  ? "btn-primary text-white shadow-sm"
                  : "btn-light border text-muted"
              }`}
              style={{ fontSize: "12px" }}
              onClick={() => setSelectedCity(city)}
            >
              {city === "ALL" ? "All Service Locations" : city}
            </button>
          ))}
        </div>

        {/* Dynamic Service Zones Grid from Database */}
        {filteredZones.length > 0 ? (
          <div className="row g-3">
            {filteredZones.map((zone: any) => {
              const name = zone.Name || zone.name;
              const city = zone.City || zone.city;
              const state = zone.State || zone.state || "Bihar";
              const localities = Array.isArray(zone.Localities || zone.localities) ? zone.Localities || zone.localities : [];
              const pincodes = Array.isArray(zone.Pincodes || zone.pincodes) ? zone.Pincodes || zone.pincodes : [];
              const surge = zone.SurgeMultiplier || zone.surgeMultiplier || 1.0;
              const statusMsg = zone.StatusMessage || zone.statusMessage || "Live • Fast dispatch";

              return (
                <div key={zone.ZoneId || zone.zoneId || zone.id || name} className="col-12 col-md-6 col-lg-4">
                  <div
                    className="p-3 border rounded-3 bg-light bg-opacity-50 h-100 d-flex flex-column justify-content-between"
                    style={{
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      borderColor: "#e2e8f0",
                    }}
                    onClick={() => handleAreaClick(localities[0] || name, city)}
                  >
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle mb-1" style={{ fontSize: "11px" }}>
                            {city}, {state}
                          </span>
                          <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-1">
                            <MapPin size={15} className="text-danger flex-shrink-0" />
                            <span>{name}</span>
                          </h6>
                        </div>

                        {surge > 1.0 ? (
                          <span className="badge bg-warning text-dark d-inline-flex align-items-center gap-1" style={{ fontSize: "11px" }}>
                            <Zap size={11} fill="#d97706" /> {surge}x Surge
                          </span>
                        ) : (
                          <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: "11px" }}>
                            Live
                          </span>
                        )}
                      </div>

                      <div className="text-muted small mb-2" style={{ fontSize: "12px" }}>
                        {statusMsg}
                      </div>

                      {/* Localities Preview */}
                      <div className="d-flex flex-wrap gap-1 mb-2">
                        {localities.slice(0, 4).map((loc: string, idx: number) => (
                          <span key={idx} className="badge bg-white text-secondary border" style={{ fontSize: "11px" }}>
                            {loc}
                          </span>
                        ))}
                        {localities.length > 4 && (
                          <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: "11px" }}>
                            +{localities.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-top d-flex justify-content-between align-items-center mt-2">
                      <span className="text-muted" style={{ fontSize: "11px", fontFamily: "monospace" }}>
                        PINs: {pincodes.slice(0, 3).join(", ")}
                      </span>
                      <span className="text-primary fw-bold small d-flex align-items-center gap-1">
                        Select Zone <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Fallback Localities Grid */
          <div className="row g-3">
            {PATNA_LOCATIONS.map((loc) => (
              <div key={loc.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div
                  className="patna-area-card"
                  onClick={() => handleAreaClick(loc.name, "Patna")}
                >
                  <div>
                    <div className="patna-area-name d-flex align-items-center gap-1">
                      <MapPin size={14} className="text-danger" />
                      <span>{loc.name}</span>
                    </div>
                    <div className="patna-area-pincode mt-1">
                      PIN: {loc.pincode} • {loc.landmark.split("/")[0]}
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-1">
                    <span className="patna-area-live-badge">Live</span>
                    <ArrowUpRight size={14} className="text-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Coverage Note Card */}
        <div className="mt-4 p-3 bg-light rounded-3 border d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div className="small text-muted text-center text-md-start">
            Don&apos;t see your specific apartment or street listed? Don&apos;t worry, our mobile units cover all active geo-zones within 30 minutes!
          </div>
          <button
            type="button"
            className="btn btn-sm btn-primary text-nowrap rounded-pill px-4 fw-semibold"
            onClick={() => handleAreaClick("Boring Road", "Patna")}
          >
            Check My Location
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreasSection;

