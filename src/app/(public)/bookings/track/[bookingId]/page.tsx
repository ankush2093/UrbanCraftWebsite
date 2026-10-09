"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getBookingById, updateBookingStatus } from "@/lib/bookingStorage";
import { Booking, BookingStatus } from "@/types/marketplace";
import {
  CheckCircle2,
  Clock,
  PhoneCall,
  MessageSquare,
  MapPin,
  Calendar,
  Navigation,
  ShieldCheck,
  ChevronLeft,
  RefreshCw,
  AlertCircle,
  Truck,
  UserCheck,
  Play,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";

const STATUS_STEPS: { key: BookingStatus; title: string; subtitle: string }[] = [
  { key: "CONFIRMED", title: "Booking Confirmed", subtitle: "We received your service request" },
  { key: "PROFESSIONAL_ASSIGNED", title: "Professional Assigned", subtitle: "Verified technician assigned" },
  { key: "ON_THE_WAY", title: "Professional On The Way", subtitle: "Technician is en route to your location" },
  { key: "ARRIVED", title: "Professional Arrived", subtitle: "Technician reached your doorstep" },
  { key: "IN_PROGRESS", title: "Service Started", subtitle: "Work is actively in progress" },
  { key: "COMPLETED", title: "Service Completed", subtitle: "Job finished with 30-day warranty" },
];

export default function BookingTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.bookingId as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [activeStatus, setActiveStatus] = useState<BookingStatus>("PROFESSIONAL_ASSIGNED");

  useEffect(() => {
    const b = getBookingById(bookingId);
    if (b) {
      setBooking(b);
      setActiveStatus(b.status === "CANCELLED" ? "CONFIRMED" : b.status);
    }
  }, [bookingId]);

  const getStepIndex = (status: BookingStatus) => {
    return STATUS_STEPS.findIndex((s) => s.key === status);
  };

  const currentStepIdx = getStepIndex(activeStatus);

  // Status simulation for testing
  const handleSimulateStatusChange = (newStatus: BookingStatus) => {
    setActiveStatus(newStatus);
    updateBookingStatus(bookingId, newStatus);
    toast.info(`Simulated Status: ${newStatus.replace(/_/g, " ")}`);
  };

  if (!booking) {
    return (
      <div className="container py-5 text-center">
        <h3>Booking not found</h3>
        <p className="text-muted">No active booking matched ID {bookingId}</p>
        <Link href="/bookings" className="btn btn-primary rounded-pill px-4">
          View All Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="py-4 pb-5" style={{ minHeight: "85vh" }}>
      <div className="container" style={{ maxWidth: "860px" }}>
        {/* Back Link */}
        <div className="mb-3">
          <Link href="/bookings" className="btn btn-link text-decoration-none text-muted p-0 d-inline-flex align-items-center gap-1 small">
            <ChevronLeft size={16} />
            <span>Back to My Bookings</span>
          </Link>
        </div>

        {/* Top Header Card */}
        <div className="bg-white p-4 rounded-4 border shadow-sm mb-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-primary text-white rounded-pill px-3 py-1">
                  LIVE STATUS
                </span>
                <span className="fw-bold text-dark fs-5">ID: {booking.id}</span>
              </div>
              <h2 className="fw-bold text-dark fs-4 mb-0">{booking.serviceName}</h2>
              <div className="text-muted small mt-1">
                {booking.optionName} • Booked for {booking.date} at {booking.timeSlot}
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-1">
                <span className="spinner-grow spinner-grow-sm text-success" role="status"></span>
                <span>Active Tracking</span>
              </span>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Left Column: Timeline & Map Simulation */}
          <div className="col-lg-7">
            {/* Real-time Timeline */}
            <div className="bg-white p-4 rounded-4 border shadow-sm mb-4">
              <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                <Navigation size={18} className="text-primary" />
                Service Timeline
              </h5>

              <div className="tracking-timeline">
                {STATUS_STEPS.map((st, idx) => {
                  const isCompleted = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div
                      key={st.key}
                      className={`timeline-step ${isCompleted ? "completed" : ""} ${
                        isCurrent ? "active" : ""
                      }`}
                    >
                      <div className="timeline-dot d-flex align-items-center justify-content-center">
                        {isCompleted && <Check size={12} className="text-white" strokeWidth={3} />}
                      </div>
                      <div className="timeline-content">
                        <div className={`fw-bold ${isCurrent ? "text-primary" : "text-dark"}`}>
                          {st.title}
                        </div>
                        <div className="text-muted small">{st.subtitle}</div>
                        {isCurrent && (
                          <div className="badge bg-primary-subtle text-primary mt-1 small">
                            Current Stage
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Live Status Simulator */}
            <div className="p-3 bg-light rounded-4 border mb-4">
              <div className="small fw-bold text-muted mb-2 text-uppercase d-flex align-items-center gap-1">
                <RefreshCw size={13} />
                <span>Simulate Stage Updates</span>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {STATUS_STEPS.map((st) => (
                  <button
                    key={st.key}
                    type="button"
                    className={`btn btn-sm rounded-pill ${
                      activeStatus === st.key ? "btn-primary fw-bold" : "btn-white bg-white border text-dark"
                    }`}
                    style={{ fontSize: "11px" }}
                    onClick={() => handleSimulateStatusChange(st.key)}
                  >
                    {st.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Simulated Map Tracker */}
            <div className="bg-white rounded-4 border overflow-hidden shadow-sm">
              <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-light">
                <span className="fw-bold text-dark small d-flex align-items-center gap-1">
                  <MapPin size={15} className="text-danger" />
                  Live Route in Patna ({booking.address?.locality})
                </span>
                <span className="badge bg-success text-white small">Estimated: 12 Mins</span>
              </div>
              <div
                className="position-relative d-flex align-items-center justify-content-center"
                style={{
                  height: "200px",
                  background: "radial-gradient(circle at center, #e2e8f0 10%, #cbd5e1 90%)",
                }}
              >
                {/* Visual Roadmap markers */}
                <div className="text-center p-4">
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-2 shadow-lg"
                    style={{ width: "48px", height: "48px", animation: "pulseDot 2s infinite" }}
                  >
                    <Truck size={24} />
                  </div>
                  <div className="fw-bold text-dark small">Partner is en route via Boring Road Crossing</div>
                  <div className="text-muted small">Destination: {booking.address?.flatHouse}, {booking.address?.locality}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Assigned Professional & Actions */}
          <div className="col-lg-5">
            {/* Professional Card */}
            {booking.professional && (
              <div className="bg-white p-4 rounded-4 border shadow-sm mb-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 className="fw-bold text-dark mb-0">Assigned Professional</h6>
                  <span className="badge bg-success-subtle text-success border border-success-subtle small">
                    Verified
                  </span>
                </div>

                <div className="d-flex align-items-center gap-3 mb-4">
                  <img
                    src={booking.professional.photo}
                    alt={booking.professional.name}
                    className="rounded-circle object-fit-cover border"
                    style={{ width: "56px", height: "56px" }}
                  />
                  <div>
                    <div className="fw-bold text-dark fs-6">{booking.professional.name}</div>
                    <div className="text-muted small">{booking.professional.role}</div>
                    <div className="text-warning small fw-bold mt-1">
                      ⭐ {booking.professional.rating} ({booking.professional.completedJobs}+ jobs in Patna)
                    </div>
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="row g-2">
                  <div className="col-6">
                    <a
                      href={`tel:${booking.professional.phone}`}
                      className="btn btn-outline-primary w-100 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 text-decoration-none"
                      style={{ fontSize: "13px" }}
                    >
                      <PhoneCall size={15} />
                      <span>Call Partner</span>
                    </a>
                  </div>
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
                      style={{ fontSize: "13px" }}
                      onClick={() => toast.info("Opening instant in-app chat with partner...")}
                    >
                      <MessageSquare size={15} />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Service & Address Summary Card */}
            <div className="bg-white p-4 rounded-4 border shadow-sm mb-4">
              <h6 className="fw-bold text-dark mb-3">Appointment Details</h6>

              <div className="d-flex flex-column gap-2 text-muted small">
                <div className="d-flex align-items-center gap-2">
                  <Calendar size={15} className="text-primary" />
                  <span>Date: <strong>{booking.date}</strong></span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Clock size={15} className="text-primary" />
                  <span>Time Window: <strong>{booking.timeSlot}</strong></span>
                </div>
                <div className="d-flex align-items-start gap-2 pt-2 border-top">
                  <MapPin size={15} className="text-danger mt-1 flex-shrink-0" />
                  <span>
                    {booking.address?.flatHouse}, {booking.address?.streetArea},{" "}
                    {booking.address?.locality}, Patna – {booking.address?.pincode}
                  </span>
                </div>
                <div className="d-flex justify-content-between pt-2 border-top fw-bold text-dark">
                  <span>Amount Paid</span>
                  <span className="text-primary">₹{booking.finalAmount}</span>
                </div>
              </div>
            </div>

            {/* Need Help CTA */}
            <div className="p-3 bg-light rounded-4 border text-center">
              <div className="fw-bold text-dark small mb-1">Need help with your booking?</div>
              <p className="text-muted small mb-2">Our Patna support team is available 8 AM – 9 PM</p>
              <Link href="/contact-us" className="btn btn-sm btn-outline-dark rounded-pill px-4 fw-semibold">
                Contact Customer Care
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
