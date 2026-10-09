"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getBookingById } from "@/lib/bookingStorage";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  ArrowRight,
  PhoneCall,
  Share2,
  HelpCircle,
  Navigation,
} from "lucide-react";

export default function BookingSuccessPage() {
  const params = useParams();
  const bookingId = params?.bookingId as string;

  const booking = getBookingById(bookingId);

  return (
    <div className="py-5" style={{ minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: "680px" }}>
        {/* Success Card */}
        <div className="bg-white p-4 p-md-5 rounded-4 border shadow-sm text-center">
          {/* Animated Green Checkmark Bubble */}
          <div
            className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: "80px", height: "80px" }}
          >
            <CheckCircle2 size={46} strokeWidth={2.5} />
          </div>

          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 fw-bold mb-2">
            BOOKING CONFIRMED
          </span>
          <h2 className="fw-bold text-dark fs-3 mb-2">Thank You for Your Order!</h2>
          <p className="text-muted small mb-4">
            Your service request has been confirmed. A certified professional has been reserved for your doorstep visit in Patna.
          </p>

          {/* Booking Summary Box */}
          <div className="bg-light p-4 rounded-4 border text-start mb-4">
            <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
              <div>
                <span className="text-muted small">Booking ID</span>
                <div className="fw-bold text-dark fs-6">{bookingId}</div>
              </div>
              <span className="badge bg-primary text-white rounded-pill px-3 py-1">
                {booking?.paymentStatus === "PAID" ? "Paid Online" : "Pay After Service"}
              </span>
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              {booking?.serviceImage && (
                <img
                  src={booking.serviceImage}
                  alt={booking.serviceName}
                  className="rounded-3 object-fit-cover"
                  style={{ width: "56px", height: "56px" }}
                />
              )}
              <div>
                <div className="fw-bold text-dark">{booking?.serviceName || "Home Service"}</div>
                <div className="text-muted small">
                  {booking?.optionName} • Qty: {booking?.quantity || 1}
                </div>
              </div>
            </div>

            {/* Date, Time & Address */}
            <div className="row g-2 small text-muted pt-2 border-top">
              <div className="col-sm-6 d-flex align-items-center gap-2">
                <Calendar size={15} className="text-primary" />
                <span>Date: <strong>{booking?.date || "Tomorrow"}</strong></span>
              </div>
              <div className="col-sm-6 d-flex align-items-center gap-2">
                <Clock size={15} className="text-primary" />
                <span>Slot: <strong>{booking?.timeSlot || "11:00 AM"}</strong></span>
              </div>
              <div className="col-12 d-flex align-items-start gap-2 mt-2">
                <MapPin size={15} className="text-danger mt-1 flex-shrink-0" />
                <span>
                  Address: {booking?.address?.flatHouse}, {booking?.address?.streetArea},{" "}
                  {booking?.address?.locality}, Patna ({booking?.address?.pincode})
                </span>
              </div>
            </div>

            {/* Assigned Pro Preview */}
            {booking?.professional && (
              <div className="mt-3 p-3 bg-white rounded-3 border d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={booking.professional.photo}
                    alt={booking.professional.name}
                    className="rounded-circle object-fit-cover"
                    style={{ width: "42px", height: "42px" }}
                  />
                  <div>
                    <div className="fw-bold text-dark small">{booking.professional.name}</div>
                    <div className="text-muted" style={{ fontSize: "11px" }}>
                      {booking.professional.role} • ⭐ {booking.professional.rating}
                    </div>
                  </div>
                </div>
                <span className="badge bg-success-subtle text-success small">Assigned</span>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top fw-bold text-dark">
              <span>Total Amount</span>
              <span className="text-primary fs-5">₹{booking?.finalAmount || 499}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center gap-3">
            <Link
              href={`/bookings/track/${bookingId}`}
              className="btn btn-primary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 w-100 w-sm-auto justify-content-center shadow"
            >
              <Navigation size={16} />
              <span>Track Booking Live</span>
            </Link>

            <Link
              href="/bookings"
              className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-semibold w-100 w-sm-auto justify-content-center"
            >
              <span>View All Bookings</span>
            </Link>

            <Link
              href="/contact-us"
              className="btn btn-light border rounded-pill px-4 py-2 fw-semibold w-100 w-sm-auto justify-content-center text-muted"
            >
              <HelpCircle size={15} />
              <span>Support</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
