"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How do I book a service?",
      a: "Booking is very easy! Simply select your desired service or package, choose your convenient date and 1-hour time slot, enter your address in Patna, review your order details and confirm. You will receive immediate SMS and in-app confirmation with your assigned professional details.",
    },
    {
      q: "How are professionals verified?",
      a: "Every professional partner undergoes a rigorous 4-step verification process including Government ID & Aadhaar verification, police background clearance check, in-person hands-on skill evaluation, and training in customer etiquette and safety hygiene.",
    },
    {
      q: "Can I reschedule my booking?",
      a: "Yes! You can reschedule your upcoming booking at zero extra charge directly from the 'My Bookings' section up to 2 hours before the scheduled time slot. Simply select a new available date and time slot.",
    },
    {
      q: "Can I cancel my booking?",
      a: "Yes, you can easily cancel your booking from the 'My Bookings' tab. Free cancellation is provided up to 2 hours before the service slot. If you already paid online, 100% refund is processed automatically to your original payment method.",
    },
    {
      q: "How can I pay?",
      a: "We support multiple secure payment options: UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Pay after service via Cash or direct QR code scan when the job is done to your satisfaction.",
    },
    {
      q: "How long does a service take?",
      a: "Service duration depends on the specific job. Typical times are: AC Service (45-60 mins), Bathroom Cleaning (45-60 mins), Haircut & Grooming (30-45 mins), Electrical / Plumbing fixes (30-45 mins). Exact expected duration is shown on every service card.",
    },
    {
      q: "What happens if the professional doesn't arrive?",
      a: "We maintain a 99.2% on-time record in Patna. In the rare event of traffic delays or partner emergencies, you can track live status or contact support. If a technician fails to arrive on time, we immediately reassign a priority expert and credit ₹100 compensation to your wallet.",
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="py-5" style={{ background: "#f8fafc" }}>
      <div className="container" style={{ maxWidth: "860px" }}>
        <div className="text-center mb-5">
          <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle rounded-pill px-3 py-1 fw-bold mb-2" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
            GOT QUESTIONS?
          </span>
          <h2 className="section-title text-center">Frequently Asked Questions</h2>
          <p className="section-subtitle text-center">
            Everything you need to know about our home service booking experience
          </p>
        </div>

        <div className="d-flex flex-column gap-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-3 border overflow-hidden transition-all shadow-sm"
                style={{ borderColor: isOpen ? "#93c5fd" : "#e2e8f0" }}
              >
                <button
                  type="button"
                  className="w-100 p-3 px-4 text-start border-0 bg-white d-flex align-items-center justify-content-between gap-3 fw-bold text-dark"
                  style={{ fontSize: "15px", cursor: "pointer" }}
                  onClick={() => toggleFaq(idx)}
                >
                  <span className="d-flex align-items-center gap-2">
                    <HelpCircle size={18} className="text-primary flex-shrink-0" />
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className="text-muted flex-shrink-0"
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.25s ease",
                    }}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-muted small" style={{ lineHeight: "1.65", fontSize: "14px", borderTop: "1px solid #f1f5f9" }}>
                    <div className="pt-3">{item.a}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
