"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getStoredBookings,
  rescheduleBooking,
  cancelBooking,
  addReviewToBooking,
} from "@/lib/bookingStorage";
import { Booking } from "@/types/marketplace";
import {
  CalendarCheck2,
  Clock,
  MapPin,
  Calendar,
  Navigation,
  RotateCcw,
  Star,
  FileText,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";

const TIME_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "04:00 PM",
  "06:00 PM",
];

const CANCEL_REASONS = [
  "Changed plans",
  "Found another provider",
  "Service no longer required",
  "Wrong booking",
  "Other",
];

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");

  // Modals state
  const [rescheduleModalBooking, setRescheduleModalBooking] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState<string>("");
  const [newTime, setNewTime] = useState<string>("11:00 AM");

  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState<string>(CANCEL_REASONS[0]);
  const [cancelDetails, setCancelDetails] = useState<string>("");

  const [reviewModalBooking, setReviewModalBooking] = useState<Booking | null>(null);
  const [overallRating, setOverallRating] = useState<number>(5);
  const [behaviorRating, setBehaviorRating] = useState<number>(5);
  const [qualityRating, setQualityRating] = useState<number>(5);
  const [valueRating, setValueRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");

  const loadBookings = () => {
    setBookings(getStoredBookings());
  };

  useEffect(() => {
    loadBookings();
    const handleUpdate = () => loadBookings();
    window.addEventListener("bookings_updated", handleUpdate);
    return () => window.removeEventListener("bookings_updated", handleUpdate);
  }, []);

  // Filter list by tab
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "upcoming") return b.status !== "COMPLETED" && b.status !== "CANCELLED";
    if (activeTab === "completed") return b.status === "COMPLETED";
    if (activeTab === "cancelled") return b.status === "CANCELLED";
    return true;
  });

  // Reschedule handler
  const handleConfirmReschedule = () => {
    if (!rescheduleModalBooking || !newDate || !newTime) return;
    const ok = rescheduleBooking(rescheduleModalBooking.id, newDate, newTime);
    if (ok) {
      toast.success("Booking rescheduled successfully!");
      setRescheduleModalBooking(null);
      loadBookings();
    }
  };

  // Cancel handler
  const handleConfirmCancel = () => {
    if (!cancelModalBooking) return;
    const ok = cancelBooking(cancelModalBooking.id, cancelReason, cancelDetails);
    if (ok) {
      toast.info("Booking has been cancelled");
      setCancelModalBooking(null);
      loadBookings();
    }
  };

  // Review handler
  const handleConfirmReview = () => {
    if (!reviewModalBooking) return;
    const ok = addReviewToBooking(reviewModalBooking.id, {
      rating: overallRating,
      comment: reviewComment,
      ratingsBreakdown: {
        overall: overallRating,
        behavior: behaviorRating,
        quality: qualityRating,
        valueForMoney: valueRating,
      },
    });
    if (ok) {
      toast.success("Thank you for your rating & review!");
      setReviewModalBooking(null);
      setReviewComment("");
      loadBookings();
    }
  };

  // Download invoice simulation
  const handleDownloadInvoice = (b: Booking) => {
    toast.success(`Invoice for ${b.id} downloaded successfully.`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1">Confirmed</span>;
      case "PROFESSIONAL_ASSIGNED":
        return <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle rounded-pill px-3 py-1">Pro Assigned</span>;
      case "ON_THE_WAY":
        return <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-3 py-1">On The Way</span>;
      case "ARRIVED":
        return <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1">Arrived</span>;
      case "IN_PROGRESS":
        return <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-3 py-1">In Progress</span>;
      case "COMPLETED":
        return <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1">Completed</span>;
      case "CANCELLED":
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-3 py-1">Cancelled</span>;
      default:
        return <span className="badge bg-secondary rounded-pill px-3 py-1">{status}</span>;
    }
  };

  return (
    <div className="py-4 pb-5" style={{ minHeight: "85vh" }}>
      <div className="container" style={{ maxWidth: "960px" }}>
        {/* Header */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h1 className="fw-bold text-dark fs-3 mb-1 d-flex align-items-center gap-2">
              <CalendarCheck2 size={26} className="text-primary" />
              My Service Bookings
            </h1>
            <p className="text-muted small mb-0">Track, reschedule, cancel or rebook your home appointments in Patna</p>
          </div>

          <Link href="/services" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
            Book New Service
          </Link>
        </div>

        {/* Tabs */}
        <div className="bg-white p-2 rounded-4 border shadow-sm mb-4 d-flex align-items-center gap-2">
          <button
            type="button"
            className={`btn flex-fill rounded-pill py-2 fw-semibold ${
              activeTab === "upcoming" ? "btn-primary shadow-sm" : "btn-light text-muted"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming (
            {bookings.filter((b) => b.status !== "COMPLETED" && b.status !== "CANCELLED").length}
            )
          </button>
          <button
            type="button"
            className={`btn flex-fill rounded-pill py-2 fw-semibold ${
              activeTab === "completed" ? "btn-primary shadow-sm" : "btn-light text-muted"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed ({bookings.filter((b) => b.status === "COMPLETED").length})
          </button>
          <button
            type="button"
            className={`btn flex-fill rounded-pill py-2 fw-semibold ${
              activeTab === "cancelled" ? "btn-primary shadow-sm" : "btn-light text-muted"
            }`}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled ({bookings.filter((b) => b.status === "CANCELLED").length})
          </button>
        </div>

        {/* Bookings List */}
        <div className="d-flex flex-column gap-3">
          {filteredBookings.map((b) => (
            <div key={b.id} className="bg-white p-4 rounded-4 border shadow-sm">
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between pb-3 border-bottom mb-3 gap-2">
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold text-dark fs-6">Booking #{b.id}</span>
                  {getStatusBadge(b.status)}
                </div>
                <div className="text-muted small">
                  Placed on: {new Date(b.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="row g-3 align-items-center">
                {/* Service Image & Details */}
                <div className="col-lg-6">
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={b.serviceImage}
                      alt={b.serviceName}
                      className="rounded-3 object-fit-cover shadow-sm"
                      style={{ width: "74px", height: "74px" }}
                    />
                    <div>
                      <h5 className="fw-bold text-dark fs-6 mb-1">{b.serviceName}</h5>
                      <div className="text-muted small">{b.optionName} • Qty: {b.quantity}</div>
                      <div className="fw-bold text-primary mt-1">₹{b.finalAmount}</div>
                    </div>
                  </div>
                </div>

                {/* Schedule & Address */}
                <div className="col-lg-6">
                  <div className="d-flex flex-column gap-1 text-muted small">
                    <div className="d-flex align-items-center gap-2">
                      <Calendar size={14} className="text-primary" />
                      <span>Date: <strong>{b.date}</strong></span>
                      <span>•</span>
                      <Clock size={14} className="text-primary" />
                      <span>Slot: <strong>{b.timeSlot}</strong></span>
                    </div>

                    <div className="d-flex align-items-start gap-2">
                      <MapPin size={14} className="text-danger mt-1 flex-shrink-0" />
                      <span className="text-truncate" style={{ maxWidth: "340px" }}>
                        {b.address?.flatHouse}, {b.address?.locality}, Patna
                      </span>
                    </div>

                    {b.professional && (
                      <div className="text-dark small fw-semibold">
                        Assigned: {b.professional.name} (⭐ {b.professional.rating})
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons depending on Tab */}
              <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 pt-3 mt-3 border-top">
                {/* Upcoming actions */}
                {activeTab === "upcoming" && (
                  <>
                    <Link
                      href={`/bookings/track/${b.id}`}
                      className="btn btn-primary btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1 shadow-sm"
                    >
                      <Navigation size={14} />
                      <span>Track Live</span>
                    </Link>

                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold"
                      onClick={() => {
                        setRescheduleModalBooking(b);
                        setNewDate(b.date);
                        setNewTime(b.timeSlot);
                      }}
                    >
                      Reschedule
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold"
                      onClick={() => {
                        setCancelModalBooking(b);
                      }}
                    >
                      Cancel Booking
                    </button>
                  </>
                )}

                {/* Completed actions */}
                {activeTab === "completed" && (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
                      onClick={() => {
                        router.push(`/book/${b.serviceId}?option=${b.optionId}`);
                      }}
                    >
                      <RotateCcw size={14} />
                      <span>Book Again</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-warning btn-sm text-dark rounded-pill px-3 fw-semibold d-flex align-items-center gap-1"
                      onClick={() => {
                        setReviewModalBooking(b);
                        if (b.review) {
                          setOverallRating(b.review.rating);
                          setReviewComment(b.review.comment);
                        }
                      }}
                    >
                      <Star size={14} className="text-warning fill-warning" />
                      <span>{b.review ? "View / Edit Review" : "Rate Service"}</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-light border btn-sm rounded-pill px-3 fw-semibold text-muted d-flex align-items-center gap-1"
                      onClick={() => handleDownloadInvoice(b)}
                    >
                      <FileText size={14} />
                      <span>Invoice</span>
                    </button>
                  </>
                )}

                {/* Cancelled actions */}
                {activeTab === "cancelled" && (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm rounded-pill px-4 fw-bold"
                      onClick={() => router.push(`/book/${b.serviceId}`)}
                    >
                      Rebook Service
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredBookings.length === 0 && (
            <div className="empty-state-card bg-white p-5">
              <div
                className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: "64px", height: "64px", color: "#94a3b8" }}
              >
                <CalendarCheck2 size={32} />
              </div>
              <h4 className="fw-bold text-dark mb-1">
                No {activeTab} bookings found
              </h4>
              <p className="text-muted small mb-4">
                Book trusted professionals for your home, cleaning and repair needs in Patna.
              </p>
              <Link href="/services" className="btn btn-primary rounded-pill px-4 fw-bold shadow">
                Explore Services
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleModalBooking && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "480px" }}>
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-bottom p-3">
                <h5 className="modal-title fw-bold text-dark mb-0">Reschedule Booking</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setRescheduleModalBooking(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <p className="text-muted small mb-3">
                  Reschedule <strong>{rescheduleModalBooking.serviceName}</strong> at no extra cost.
                </p>

                <div className="mb-3">
                  <label className="fw-semibold small mb-1">Select New Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="form-control"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="fw-semibold small mb-1">Select Available Time Slot</label>
                  <select
                    className="form-select"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer border-top p-3">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setRescheduleModalBooking(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-4 fw-bold rounded-pill"
                  onClick={handleConfirmReschedule}
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Booking Modal */}
      {cancelModalBooking && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "480px" }}>
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-bottom p-3 bg-danger-subtle">
                <h5 className="modal-title fw-bold text-danger mb-0 d-flex align-items-center gap-2">
                  <AlertTriangle size={18} />
                  Cancel Booking #{cancelModalBooking.id}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setCancelModalBooking(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                {/* Cancellation Policy Banner */}
                <div className="p-3 bg-light rounded-3 border mb-3 small text-muted">
                  <div className="fw-bold text-dark mb-1">Cancellation Policy & Refund</div>
                  <div>• Free cancellation up to 2 hours before scheduled time slot.</div>
                  <div>• 100% immediate refund to original source if paid online.</div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold small mb-1">Reason for Cancellation</label>
                  <select
                    className="form-select"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  >
                    {CANCEL_REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold small mb-1">Additional details (optional)</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Let us know why you are cancelling..."
                    value={cancelDetails}
                    onChange={(e) => setCancelDetails(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer border-top p-3">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setCancelModalBooking(null)}
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  className="btn btn-danger px-4 fw-bold rounded-pill"
                  onClick={handleConfirmCancel}
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rate & Review Modal */}
      {reviewModalBooking && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "520px" }}>
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-bottom p-3">
                <h5 className="modal-title fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <Star size={18} className="text-warning fill-warning" />
                  Rate & Review Service
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setReviewModalBooking(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="text-center mb-4">
                  <div className="text-muted small">Overall Experience</div>
                  <div className="d-flex justify-content-center gap-2 my-2 text-warning">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={32}
                        className={`cursor-pointer ${
                          star <= overallRating ? "fill-warning text-warning" : "text-muted"
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => setOverallRating(star)}
                      />
                    ))}
                  </div>
                  <div className="fw-bold text-dark fs-6">{overallRating} / 5 Stars</div>
                </div>

                {/* 4 Metric Ratings */}
                <div className="bg-light p-3 rounded-3 border mb-3">
                  <div className="row g-2 small">
                    <div className="col-6 d-flex align-items-center justify-content-between">
                      <span>Pro Behavior:</span>
                      <select
                        className="form-select form-select-sm w-auto"
                        value={behaviorRating}
                        onChange={(e) => setBehaviorRating(Number(e.target.value))}
                      >
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>{n}★</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-6 d-flex align-items-center justify-content-between">
                      <span>Service Quality:</span>
                      <select
                        className="form-select form-select-sm w-auto"
                        value={qualityRating}
                        onChange={(e) => setQualityRating(Number(e.target.value))}
                      >
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>{n}★</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-6 d-flex align-items-center justify-content-between mt-2">
                      <span>Value for Money:</span>
                      <select
                        className="form-select form-select-sm w-auto"
                        value={valueRating}
                        onChange={(e) => setValueRating(Number(e.target.value))}
                      >
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>{n}★</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold small mb-1">Your Written Review</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Share details of your experience to help other Patna customers..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer border-top p-3">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setReviewModalBooking(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-4 fw-bold rounded-pill"
                  onClick={handleConfirmReview}
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
