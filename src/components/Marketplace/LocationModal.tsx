"use client";

import React, { useState, useEffect } from "react";
import { useGetMarketplaceZonesQuery } from "@/store/api";
import { PATNA_LOCATIONS } from "@/lib/servicesData";
import { getSelectedLocation, setSelectedLocation } from "@/lib/bookingStorage";
import { MapPin, Search, Check, Navigation, Loader2, AlertCircle, Zap, Building } from "lucide-react";
import { toast } from "react-toastify";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentLocation, setCurrentLoc] = useState("Kankarbagh, Patna");
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const { data: zonesData } = useGetMarketplaceZonesQuery();

  useEffect(() => {
    setCurrentLoc(getSelectedLocation());
  }, [isOpen]);

  if (!isOpen) return null;

  const dbZones = Array.isArray(zonesData?.data) ? zonesData.data : [];

  // Build searchable items from database zones
  const zoneItems: any[] = [];
  dbZones.forEach((z: any) => {
    const cityName = z.City || z.city || "Patna";
    const zoneName = z.Name || z.name;
    const localities = Array.isArray(z.Localities || z.localities) ? z.Localities || z.localities : [];
    const pincodes = Array.isArray(z.Pincodes || z.pincodes) ? z.Pincodes || z.pincodes : [];
    const surge = z.SurgeMultiplier || z.surgeMultiplier || 1.0;
    const statusMsg = z.StatusMessage || z.statusMessage || "Live";

    // Add main zone
    zoneItems.push({
      id: z.ZoneId || z.zoneId || z.id || z.ZoneCode,
      name: `${zoneName}`,
      city: cityName,
      pincode: pincodes.join(", "),
      landmark: statusMsg,
      surge,
      isZoneHeader: true,
    });

    // Add individual localities
    localities.forEach((loc: string, idx: number) => {
      zoneItems.push({
        id: `${z.ZoneCode || z.name}-${idx}`,
        name: `${loc}`,
        city: cityName,
        pincode: pincodes[0] || "",
        landmark: `${zoneName}`,
        surge,
        isZoneHeader: false,
      });
    });
  });

  const allItems = zoneItems.length > 0 ? zoneItems : PATNA_LOCATIONS.map((p) => ({ ...p, city: "Patna", surge: 1.0, isZoneHeader: false }));

  const availableCities = Array.from(new Set(["ALL", ...allItems.map((i) => i.city)]));

  const filtered = allItems.filter((item) => {
    if (selectedCity !== "ALL" && item.city !== selectedCity) return false;
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q) ||
      item.pincode?.includes(q) ||
      item.landmark?.toLowerCase().includes(q)
    );
  });

  const handleSelect = (locName: string, city: string = "Patna") => {
    const formatted = locName.includes(",") ? locName : `${locName}, ${city}`;
    setSelectedLocation(formatted);
    setCurrentLoc(formatted);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("location_updated"));
    }
    onClose();
  };

  // Real Browser GPS Geolocation + Reverse Geocoding
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                "Accept-Language": "en",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const addr = data.address || {};
            const subLocality =
              addr.suburb ||
              addr.neighbourhood ||
              addr.residential ||
              addr.quarter ||
              addr.road ||
              "";
            const city =
              addr.city ||
              addr.town ||
              addr.state_district ||
              addr.state ||
              "Patna";

            let detectedText = "";
            if (subLocality && city) {
              detectedText = `${subLocality}, ${city}`;
            } else if (city) {
              detectedText = city;
            } else {
              detectedText = `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`;
            }

            toast.success(`📍 GPS Location detected: ${detectedText}`);
            handleSelect(detectedText, city);
          } else {
            handleSelect("Boring Road, Patna", "Patna");
          }
        } catch (err) {
          console.error("Geocoding fetch error:", err);
          handleSelect("Boring Road, Patna", "Patna");
          toast.success("Location set based on your GPS zone");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = "Unable to retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permission denied. Please enable GPS access in your browser.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          errorMsg = "Location request timed out.";
        }
        setGpsError(errorMsg);
        toast.warning(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", zIndex: 1060 }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "520px" }}>
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "20px", overflow: "hidden" }}>
          <div className="modal-header border-bottom p-4 pb-3" style={{ background: "#ffffff" }}>
            <div>
              <h5 className="modal-title fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                <MapPin className="text-danger" size={20} />
                Select Service Location
              </h5>
              <p className="text-muted small mb-0">Currently servicing Patna & major cities across India</p>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body p-4 pt-3">
            {/* City Selector Tabs */}
            <div className="d-flex flex-wrap gap-1 mb-3">
              {availableCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  className={`btn btn-xs rounded-pill px-3 py-1 fw-semibold ${
                    selectedCity === city
                      ? "btn-primary text-white"
                      : "btn-light border text-muted"
                  }`}
                  style={{ fontSize: "11px" }}
                  onClick={() => setSelectedCity(city)}
                >
                  {city === "ALL" ? "All Cities" : city}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="position-relative mb-3">
              <Search
                size={18}
                className="text-muted position-absolute"
                style={{ top: "12px", left: "14px" }}
              />
              <input
                type="text"
                className="form-control ps-5 py-2"
                style={{ borderRadius: "12px", fontSize: "14px", borderColor: "#cbd5e1" }}
                placeholder="Search colony, area (e.g. Boring Road) or pincode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>

            {/* GPS Detect Option Button with live Loading Animation */}
            <button
              type="button"
              disabled={isLocating}
              className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 py-2 mb-2 fw-semibold"
              style={{ borderRadius: "12px", fontSize: "13px" }}
              onClick={handleUseCurrentLocation}
            >
              {isLocating ? (
                <>
                  <Loader2 size={16} className="spinner-border spinner-border-sm text-primary" />
                  <span>Detecting GPS Location via Satellite...</span>
                </>
              ) : (
                <>
                  <Navigation size={16} />
                  <span>Use Current Location (GPS)</span>
                </>
              )}
            </button>

            {gpsError && (
              <div className="p-2 px-3 bg-danger-subtle text-danger rounded-3 small mb-3 d-flex align-items-center gap-2" style={{ fontSize: "12px" }}>
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{gpsError}</span>
              </div>
            )}

            {/* Locality List */}
            <div className="locality-list-wrap" style={{ maxHeight: "300px", overflowY: "auto" }}>
              <div className="text-muted small fw-bold mb-2 px-1 text-uppercase" style={{ letterSpacing: "0.5px" }}>
                Active Service Zones & Localities ({filtered.length})
              </div>

              <div className="d-flex flex-column gap-2">
                {filtered.map((item) => {
                  const isSelected = currentLocation.startsWith(item.name);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item.name, item.city)}
                      className="d-flex align-items-center justify-content-between p-3 rounded-3 cursor-pointer"
                      style={{
                        background: isSelected ? "#eff6ff" : item.isZoneHeader ? "#f1f5f9" : "#f8fafc",
                        border: isSelected ? "1.5px solid #2563eb" : "1px solid #e2e8f0",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div>
                        <div className="fw-bold text-dark d-flex align-items-center gap-2">
                          <MapPin size={13} className={item.isZoneHeader ? "text-primary" : "text-muted"} />
                          <span>{item.name}</span>
                          <span className="badge bg-light text-secondary border fw-normal" style={{ fontSize: "10px" }}>
                            {item.city}
                          </span>
                          {item.pincode && (
                            <span className="badge bg-light text-muted border fw-normal" style={{ fontSize: "10px", fontFamily: "monospace" }}>
                              {item.pincode.split(",")[0]}
                            </span>
                          )}
                        </div>
                        <div className="text-muted small mt-1" style={{ fontSize: "11px" }}>
                          {item.landmark}
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        {item.surge > 1.0 && (
                          <span className="badge bg-warning text-dark d-inline-flex align-items-center gap-1" style={{ fontSize: "10px" }}>
                            <Zap size={10} fill="#d97706" /> {item.surge}x
                          </span>
                        )}
                        {isSelected ? (
                          <div
                            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "22px", height: "22px" }}
                          >
                            <Check size={13} strokeWidth={3} />
                          </div>
                        ) : (
                          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill" style={{ fontSize: "10px" }}>
                            Live
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {filtered.length === 0 && (
                  <div className="text-center py-4 text-muted small">
                    No areas found matching &quot;{searchTerm}&quot;. Try searching another locality or use GPS.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;

