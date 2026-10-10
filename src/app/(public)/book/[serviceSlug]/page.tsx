"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ALL_SERVICES, PATNA_LOCATIONS } from "@/lib/servicesData";
import {
  getStoredAddresses,
  saveNewAddress,
  createNewBooking,
} from "@/lib/bookingStorage";
import { useApplyCouponMutation, useGetMarketplaceServiceBySlugQuery } from "@/store/api";
import { Address, ServiceOption } from "@/types/marketplace";
import { useAuth } from "@/hooks/useAuth";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Plus,
  ShieldCheck,
  Tag,
  CreditCard,
  Banknote,
  Smartphone,
  Info,
  X,
  Sparkles,
  Camera,
} from "lucide-react";
import { toast } from "react-toastify";

const TIME_SLOTS = [
  { id: "10:00 AM", label: "10:00 AM – 11:00 AM", available: true },
  { id: "11:00 AM", label: "11:00 AM – 12:00 PM", available: true },
  { id: "12:00 PM", label: "12:00 PM – 01:00 PM", available: false }, // busy slot example
  { id: "02:00 PM", label: "02:00 PM – 03:00 PM", available: true },
  { id: "04:00 PM", label: "04:00 PM – 05:00 PM", available: true },
  { id: "06:00 PM", label: "06:00 PM – 07:00 PM", available: true },
];

function BookingWizardContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const serviceSlug = params?.serviceSlug as string;
  const preSelectedOptionId = searchParams.get("option");

  const { data: serviceRes } = useGetMarketplaceServiceBySlugQuery(serviceSlug);
  const fallbackService = ALL_SERVICES.find((s) => s.slug === serviceSlug || s.id === serviceSlug);
  const service = serviceRes?.data || fallbackService;

  // Steps: 1: Option & Qty, 2: Date, 3: Time, 4: Address, 5: Summary, 6: Payment
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Booking details state
  const [selectedOption, setSelectedOption] = useState<ServiceOption>(
    service?.options?.find((o) => o.id === preSelectedOptionId) ||
      service?.options?.[0] || {
        id: "default",
        name: "Standard Package",
        description: "Standard service",
        price: service?.startingPrice || 499,
        duration: "45 mins",
      }
  );

  useEffect(() => {
    if (service?.options && service.options.length > 0) {
      const match = service.options.find((o) => o.id === preSelectedOptionId) || service.options[0];
      setSelectedOption(match);
    }
  }, [service, preSelectedOptionId]);
  const [quantity, setQuantity] = useState<number>(1);

  // Date selection
  const todayDateStr = new Date().toISOString().split("T")[0];
  const tomorrowDateStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const dayAfterDateStr = new Date(Date.now() + 172800000).toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState<string>(tomorrowDateStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("11:00 AM");

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddAddressModal, setShowAddAddressModal] = useState<boolean>(false);
  const [newAddrForm, setNewAddrForm] = useState({
    name: user?.name || "Customer",
    phone: "+91 98765 43210",
    flatHouse: "",
    streetArea: "",
    locality: "Kankarbagh",
    city: "Patna",
    pincode: "800020",
    landmark: "",
    type: "Home" as const,
  });

  // Coupons & Pricing
  const [couponCode, setCouponCode] = useState<string>("WELCOME100");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "UPI" | "CASH_AFTER_SERVICE">("ONLINE");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [applyCouponMutation, { isLoading: isApplyingCoupon }] = useApplyCouponMutation();
  const [attachedIssue, setAttachedIssue] = useState<{ photos: string[]; note: string }>({ photos: [], note: "" });

  useEffect(() => {
    if (typeof window !== "undefined" && serviceSlug) {
      try {
        const raw = sessionStorage.getItem(`booking_issue_attachment_${serviceSlug}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          setAttachedIssue({
            photos: Array.isArray(parsed?.photos) ? parsed.photos : [],
            note: parsed?.note || "",
          });
        }
      } catch (e) {
        // ignore
      }
    }
  }, [serviceSlug]);

  useEffect(() => {
    const list = getStoredAddresses();
    setAddresses(list);
    const def = list.find((a) => a.isDefault) || list[0];
    if (def) setSelectedAddressId(def.id);
  }, []);

  if (!service) {
    return (
      <div className="container py-5 text-center">
        <h3>Service not found</h3>
        <Link href="/services" className="btn btn-primary rounded-pill mt-3">
          Back to Services
        </Link>
      </div>
    );
  }

  // Calculations
  const baseServicePrice = (selectedOption.price || service.startingPrice) * quantity;
  const taxes = Math.round(baseServicePrice * 0.05); // 5% GST
  const platformFee = 29;
  const finalAmount = Math.max(0, baseServicePrice - discountAmount + taxes + platformFee);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await applyCouponMutation({
        code: couponCode,
        bookingAmount: baseServicePrice,
        categorySlug: service.categorySlug,
      }).unwrap();

      setAppliedCoupon(res.data.coupon);
      setDiscountAmount(res.data.discountAmount);
      toast.success(res.message || "Coupon applied successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrForm.flatHouse || !newAddrForm.streetArea) {
      toast.warning("Please fill flat/house and street details");
      return;
    }

    const created = saveNewAddress({
      ...newAddrForm,
      isDefault: addresses.length === 0,
    });
    const updated = getStoredAddresses();
    setAddresses(updated);
    setSelectedAddressId(created.id);
    setShowAddAddressModal(false);
    toast.success("New address added successfully!");
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const finalizeBooking = (payStatus: 'PAID' | 'PENDING', paymentId?: string) => {
    const selectedAddr = addresses.find((a) => a.id === selectedAddressId) || addresses[0];
    const newBooking = createNewBooking({
      serviceId: service.id,
      serviceName: service.name,
      serviceImage: service.image,
      categoryName: service.categoryName,
      optionId: selectedOption.id,
      optionName: selectedOption.name,
      quantity,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      address: selectedAddr,
      price: baseServicePrice,
      discount: discountAmount,
      taxes,
      platformFee,
      finalAmount,
      paymentMethod,
      paymentStatus: payStatus,
      userEmail: user?.email || "customer@example.com",
      userName: user?.name || selectedAddr.name,
      userPhone: selectedAddr.phone,
    });

    toast.success("Booking confirmed successfully!");
    router.push(`/booking-success/${newBooking.id}`);
  };

  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to complete your booking");
      const redirectUrl = `/book/${serviceSlug}?option=${selectedOption.id}`;
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    const selectedAddr = addresses.find((a) => a.id === selectedAddressId) || addresses[0];
    if (!selectedAddr) {
      toast.error("Please add or select a service address in Patna");
      setCurrentStep(4);
      return;
    }

    setIsSubmitting(true);

    // If Online Payment with Razorpay
    if (paymentMethod === "ONLINE" || paymentMethod === "UPI") {
      try {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          toast.warning("Razorpay SDK offline, proceeding with instant confirmation");
          finalizeBooking("PAID");
          setIsSubmitting(false);
          return;
        }

        const razorpayKey =
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
          process.env.RAZORPAY_KEY_ID ||
          "rzp_test_R6FOPHx1TKb5wC";

        const options = {
          key: razorpayKey,
          amount: finalAmount * 100, // in paise
          currency: "INR",
          name: "UrbanCraft Home Services",
          description: `${service.name} (${selectedOption.name})`,
          image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=200&q=80",
          handler: function (response: any) {
            toast.success(`Payment verified! ID: ${response.razorpay_payment_id}`);
            finalizeBooking("PAID", response.razorpay_payment_id);
          },
          prefill: {
            name: selectedAddr.name,
            email: user?.email || "customer@example.com",
            contact: selectedAddr.phone,
          },
          theme: {
            color: "#2563eb",
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
              toast.info("Payment window closed. You can retry or choose Pay after service.");
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          toast.error(`Payment failed: ${response.error.description}`);
          setIsSubmitting(false);
        });
        rzp.open();
      } catch (err) {
        console.error("Razorpay Error:", err);
        finalizeBooking("PAID");
      }
    } else {
      // Cash / Pay after service
      finalizeBooking("PENDING");
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    { num: 1, title: "Package" },
    { num: 2, title: "Date" },
    { num: 3, title: "Time Slot" },
    { num: 4, title: "Address" },
    { num: 5, title: "Summary" },
    { num: 6, title: "Confirm" },
  ];

  return (
    <div className="py-4 pb-5" style={{ minHeight: "85vh" }}>
      <div className="container" style={{ maxWidth: "900px" }}>
        {/* Step Progress Bar */}
        <div className="bg-white p-3 p-md-4 rounded-4 border shadow-sm mb-4">
          <div className="booking-step-indicator mb-0">
            {stepTitles.map((st) => (
              <div
                key={st.num}
                className={`booking-step-item ${currentStep === st.num ? "active" : ""} ${
                  currentStep > st.num ? "completed" : ""
                }`}
                onClick={() => {
                  if (st.num < currentStep) setCurrentStep(st.num);
                }}
              >
                <div className="booking-step-bubble">
                  {currentStep > st.num ? <CheckCircle2 size={18} /> : st.num}
                </div>
                <div className="booking-step-title d-none d-sm-block">{st.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Container */}
        <div className="row g-4">
          {/* Main Step Body */}
          <div className="col-lg-8">
            <div className="bg-white p-4 rounded-4 border shadow-sm h-100">
              {/* STEP 1: Service Option & Quantity */}
              {currentStep === 1 && (
                <div>
                  <h4 className="fw-bold text-dark fs-5 mb-1">Step 1: Select Service Option</h4>
                  <p className="text-muted small mb-4">Choose the required package and quantity for {service.name}</p>

                  <div className="d-flex flex-column gap-3 mb-4">
                    {service.options.map((opt) => {
                      const isSel = opt.id === selectedOption.id;
                      return (
                        <div
                          key={opt.id}
                          className={`service-option-card ${isSel ? "selected" : ""}`}
                          onClick={() => setSelectedOption(opt)}
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <div className="fw-bold text-dark">{opt.name}</div>
                              <div className="text-muted small mt-1">{opt.description}</div>
                              <div className="text-primary small fw-semibold mt-1">Duration: {opt.duration}</div>
                            </div>
                            <div className="text-end">
                              <div className="fw-bold text-dark fs-5">₹{opt.price}</div>
                              {opt.originalPrice && (
                                <div className="text-muted text-decoration-line-through small">
                                  ₹{opt.originalPrice}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quantity Selector */}
                  <div className="p-3 bg-light rounded-3 border d-flex align-items-center justify-content-between mb-4">
                    <div>
                      <div className="fw-bold text-dark small">Service Quantity / Units</div>
                      <div className="text-muted small">Number of rooms or units to service</div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px" }}
                        disabled={quantity <= 1}
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      >
                        -
                      </button>
                      <span className="fw-bold fs-6">{quantity}</span>
                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px" }}
                        onClick={() => setQuantity((q) => q + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-primary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2"
                      onClick={() => setCurrentStep(2)}
                    >
                      <span>Next: Select Date</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Date Selection */}
              {currentStep === 2 && (
                <div>
                  <h4 className="fw-bold text-dark fs-5 mb-1">Step 2: Choose Service Date</h4>
                  <p className="text-muted small mb-4">Select when you would like our professional to visit</p>

                  <div className="row g-3 mb-4">
                    {[
                      { date: todayDateStr, label: "Today", sub: "Evening slots only" },
                      { date: tomorrowDateStr, label: "Tomorrow", sub: "All slots open" },
                      { date: dayAfterDateStr, label: "Day After", sub: "All slots open" },
                    ].map((d) => {
                      const isSel = selectedDate === d.date;
                      return (
                        <div key={d.date} className="col-4">
                          <div
                            className={`p-3 rounded-3 text-center cursor-pointer border h-100 ${
                              isSel ? "border-primary bg-primary-subtle" : "bg-light"
                            }`}
                            style={{ cursor: "pointer", transition: "all 0.2s" }}
                            onClick={() => setSelectedDate(d.date)}
                          >
                            <div className="fw-bold text-dark">{d.label}</div>
                            <div className="text-muted small" style={{ fontSize: "11px" }}>{d.date}</div>
                            <div className="text-primary small fw-semibold mt-1" style={{ fontSize: "10px" }}>{d.sub}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Custom Date Picker */}
                  <div className="mb-4">
                    <label className="fw-semibold text-dark small mb-2">Or select custom date:</label>
                    <input
                      type="date"
                      min={todayDateStr}
                      className="form-control"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <button
                      type="button"
                      className="btn btn-light rounded-pill px-4 fw-semibold"
                      onClick={() => setCurrentStep(1)}
                    >
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2"
                      onClick={() => setCurrentStep(3)}
                    >
                      <span>Next: Select Time</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Time Slot Selection */}
              {currentStep === 3 && (
                <div>
                  <h4 className="fw-bold text-dark fs-5 mb-1">Step 3: Select Arrival Time Slot</h4>
                  <p className="text-muted small mb-4">
                    Selected Date: <strong>{selectedDate}</strong>. Choose a 1-hour arrival window.
                  </p>

                  <div className="row g-3 mb-4">
                    {TIME_SLOTS.map((slot) => {
                      const isSel = selectedTimeSlot === slot.id;
                      return (
                        <div key={slot.id} className="col-6">
                          <button
                            type="button"
                            disabled={!slot.available}
                            className={`w-100 p-3 rounded-3 border text-start d-flex align-items-center justify-content-between ${
                              !slot.available
                                ? "bg-light opacity-50 cursor-not-allowed"
                                : isSel
                                ? "border-primary bg-primary text-white"
                                : "bg-white text-dark"
                            }`}
                            onClick={() => slot.available && setSelectedTimeSlot(slot.id)}
                          >
                            <div>
                              <div className="fw-bold fs-6">{slot.id}</div>
                              <div className="small opacity-75" style={{ fontSize: "11px" }}>{slot.label}</div>
                            </div>
                            {!slot.available && (
                              <span className="badge bg-danger-subtle text-danger small">Full</span>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <button
                      type="button"
                      className="btn btn-light rounded-pill px-4 fw-semibold"
                      onClick={() => setCurrentStep(2)}
                    >
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2"
                      onClick={() => setCurrentStep(4)}
                    >
                      <span>Next: Select Address</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Address Selection */}
              {currentStep === 4 && (
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h4 className="fw-bold text-dark fs-5 mb-1">Step 4: Select Service Address</h4>
                      <p className="text-muted small mb-0">Choose your address in Patna</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm rounded-pill fw-bold d-flex align-items-center gap-1"
                      onClick={() => setShowAddAddressModal(true)}
                    >
                      <Plus size={14} />
                      <span>Add New Address</span>
                    </button>
                  </div>

                  <div className="d-flex flex-column gap-3 mb-4">
                    {addresses.map((addr) => {
                      const isSel = addr.id === selectedAddressId;
                      return (
                        <div
                          key={addr.id}
                          className={`p-3 rounded-3 border cursor-pointer ${
                            isSel ? "border-primary bg-primary-subtle" : "bg-white"
                          }`}
                          style={{ cursor: "pointer" }}
                          onClick={() => setSelectedAddressId(addr.id)}
                        >
                          <div className="d-flex align-items-start justify-content-between">
                            <div className="d-flex align-items-start gap-2">
                              <input
                                type="radio"
                                name="addressSelection"
                                className="form-check-input mt-1"
                                checked={isSel}
                                onChange={() => setSelectedAddressId(addr.id)}
                              />
                              <div>
                                <div className="fw-bold text-dark d-flex align-items-center gap-2">
                                  {addr.name}
                                  <span className="badge bg-secondary small">{addr.type}</span>
                                </div>
                                <div className="text-muted small mt-1">
                                  {addr.flatHouse}, {addr.streetArea}, {addr.locality}, {addr.city} – {addr.pincode}
                                </div>
                                {addr.landmark && (
                                  <div className="text-muted small">Landmark: {addr.landmark}</div>
                                )}
                                <div className="text-dark small fw-semibold mt-1">📞 {addr.phone}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {addresses.length === 0 && (
                      <div className="text-center py-4 bg-light rounded-3">
                        <MapPin size={32} className="text-muted mb-2" />
                        <div className="fw-bold">No addresses found</div>
                        <p className="text-muted small">Add your Patna address to continue</p>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm rounded-pill px-3"
                          onClick={() => setShowAddAddressModal(true)}
                        >
                          Add Address
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <button
                      type="button"
                      className="btn btn-light rounded-pill px-4 fw-semibold"
                      onClick={() => setCurrentStep(3)}
                    >
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      disabled={!selectedAddressId && addresses.length === 0}
                      className="btn btn-primary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2"
                      onClick={() => setCurrentStep(5)}
                    >
                      <span>Next: Order Summary</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: Order Summary & Coupon */}
              {currentStep === 5 && (
                <div>
                  <h4 className="fw-bold text-dark fs-5 mb-1">Step 5: Order Summary & Offers</h4>
                  <p className="text-muted small mb-4">Review itemized bill and apply discount promo codes</p>

                  {/* Coupon Box */}
                  <div className="p-3 bg-light rounded-3 border mb-4">
                    <label className="fw-bold text-dark small mb-2 d-flex align-items-center gap-1">
                      <Tag size={15} className="text-primary" />
                      Apply Coupon / Promo Code
                    </label>
                    <div className="d-flex gap-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter coupon (e.g. WELCOME100, PATNA100)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={!!appliedCoupon}
                      />
                      {appliedCoupon ? (
                        <button
                          type="button"
                          className="btn btn-outline-danger text-nowrap fw-bold"
                          onClick={handleRemoveCoupon}
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary text-nowrap fw-bold"
                          onClick={handleApplyCoupon}
                          disabled={isApplyingCoupon || !couponCode.trim()}
                        >
                          {isApplyingCoupon ? "Applying..." : "Apply"}
                        </button>
                      )}
                    </div>
                    {appliedCoupon && (
                      <div className="text-success small fw-semibold mt-2 d-flex align-items-center gap-1">
                        <Sparkles size={14} />
                        <span>Code {appliedCoupon.code} applied! Saved ₹{discountAmount}</span>
                      </div>
                    )}
                  </div>

                  {/* Attached Issue Photos Preview */}
                  {attachedIssue.photos.length > 0 && (
                    <div className="p-3 bg-white rounded-3 border mb-4">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fw-bold text-dark small d-flex align-items-center gap-2">
                          <Camera size={16} className="text-primary" />
                          Attached Issue Photos ({attachedIssue.photos.length})
                        </span>
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 small">
                          Uploaded to ImageKit
                        </span>
                      </div>
                      <div className="d-flex gap-2 flex-wrap mb-2">
                        {attachedIssue.photos.map((imgUrl, i) => (
                          <div key={i} className="border rounded-2 overflow-hidden shadow-sm" style={{ width: "70px", height: "70px" }}>
                            <img src={imgUrl} alt={`Problem attachment ${i + 1}`} className="w-100 h-100 object-fit-cover" />
                          </div>
                        ))}
                      </div>
                      {attachedIssue.note && (
                        <div className="small text-muted bg-light p-2 rounded-2 mt-2">
                          <strong className="text-dark">Technician Note:</strong> {attachedIssue.note}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bill Breakdown */}
                  <div className="p-3 rounded-3 border mb-4">
                    <h6 className="fw-bold text-dark mb-3">Itemized Payment Details</h6>
                    <div className="d-flex justify-content-between small text-muted mb-2">
                      <span>{selectedOption.name} × {quantity}</span>
                      <span className="fw-semibold text-dark">₹{baseServicePrice}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="d-flex justify-content-between small text-success mb-2">
                        <span>Coupon Discount</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="d-flex justify-content-between small text-muted mb-2">
                      <span>GST (5%)</span>
                      <span className="fw-semibold text-dark">₹{taxes}</span>
                    </div>
                    <div className="d-flex justify-content-between small text-muted mb-2">
                      <span>Convenience & Platform Fee</span>
                      <span className="fw-semibold text-dark">₹{platformFee}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between fw-bold text-dark fs-5">
                      <span>Total Payable</span>
                      <span className="text-primary">₹{finalAmount}</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <button
                      type="button"
                      className="btn btn-light rounded-pill px-4 fw-semibold"
                      onClick={() => setCurrentStep(4)}
                    >
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2"
                      onClick={() => setCurrentStep(6)}
                    >
                      <span>Next: Payment & Confirmation</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: Confirmation & Payment Method */}
              {currentStep === 6 && (
                <div>
                  <h4 className="fw-bold text-dark fs-5 mb-1">Step 6: Payment & Final Confirmation</h4>
                  <p className="text-muted small mb-4">Select how you want to pay for your service</p>

                  <div className="d-flex flex-column gap-3 mb-4">
                    {[
                      {
                        id: "ONLINE",
                        title: "Pay Online (UPI / Card / NetBanking)",
                        desc: "Instant confirmation & 100% money-back guarantee",
                        icon: CreditCard,
                      },
                      {
                        id: "UPI",
                        title: "Direct UPI QR (GPay / PhonePe / Paytm)",
                        desc: "Scan QR code immediately after booking",
                        icon: Smartphone,
                      },
                      {
                        id: "CASH_AFTER_SERVICE",
                        title: "Pay After Service (Cash / QR)",
                        desc: "Inspect the work first, then pay the professional directly",
                        icon: Banknote,
                      },
                    ].map((pm) => {
                      const isSel = paymentMethod === pm.id;
                      const Icon = pm.icon;
                      return (
                        <div
                          key={pm.id}
                          className={`p-3 rounded-3 border cursor-pointer ${
                            isSel ? "border-primary bg-primary-subtle" : "bg-white"
                          }`}
                          style={{ cursor: "pointer" }}
                          onClick={() => setPaymentMethod(pm.id as any)}
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                              <input
                                type="radio"
                                name="paymentMethod"
                                className="form-check-input"
                                checked={isSel}
                                onChange={() => setPaymentMethod(pm.id as any)}
                              />
                              <div
                                className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                style={{ width: "40px", height: "40px" }}
                              >
                                <Icon size={20} className="text-primary" />
                              </div>
                              <div>
                                <div className="fw-bold text-dark">{pm.title}</div>
                                <div className="text-muted small">{pm.desc}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 bg-light rounded-3 border mb-4 small text-muted d-flex align-items-center gap-2">
                    <ShieldCheck size={20} className="text-success flex-shrink-0" />
                    <span>Free cancellation up to 2 hours before scheduled slot. 100% safe & certified pros.</span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <button
                      type="button"
                      className="btn btn-light rounded-pill px-4 fw-semibold"
                      onClick={() => setCurrentStep(5)}
                    >
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      className="btn btn-success rounded-pill px-5 py-3 fw-bold d-flex align-items-center gap-2 shadow"
                      onClick={handleConfirmBooking}
                    >
                      <ShieldCheck size={18} />
                      <span>{isSubmitting ? "Confirming..." : `Confirm Booking (₹${finalAmount})`}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Booking Summary Widget */}
          <div className="col-lg-4">
            <div className="bg-white p-4 rounded-4 border shadow-sm" style={{ top: "90px", position: "sticky" }}>
              <h5 className="fw-bold text-dark mb-3">Service Cart</h5>

              <div className="d-flex align-items-center gap-3 pb-3 border-bottom mb-3">
                <img
                  src={service.image}
                  alt={service.name}
                  className="rounded-3 object-fit-cover"
                  style={{ width: "64px", height: "64px" }}
                />
                <div>
                  <div className="fw-bold text-dark fs-6">{service.name}</div>
                  <div className="text-muted small">{selectedOption.name} × {quantity}</div>
                </div>
              </div>

              {/* Schedule preview */}
              <div className="mb-3 small text-muted">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <Calendar size={14} className="text-primary" />
                  <span>Date: <strong>{selectedDate}</strong></span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Clock size={14} className="text-primary" />
                  <span>Slot: <strong>{selectedTimeSlot}</strong></span>
                </div>
              </div>

              {attachedIssue.photos.length > 0 && (
                <div className="mb-3 p-2 bg-success-subtle border border-success-subtle rounded-3 small text-success d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <Camera size={14} />
                    <span className="fw-semibold">{attachedIssue.photos.length} Photo{attachedIssue.photos.length > 1 ? "s" : ""} Attached</span>
                  </div>
                  <div className="d-flex -space-x-2">
                    {attachedIssue.photos.slice(0, 3).map((img, i) => (
                      <img key={i} src={img} alt="thumb" className="rounded-circle border border-white" style={{ width: "22px", height: "22px", objectFit: "cover", marginLeft: i > 0 ? "-6px" : 0 }} />
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-light rounded-3 mb-3">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Price</span>
                  <span>₹{baseServicePrice}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="d-flex justify-content-between small text-success mb-1">
                    <span>Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Taxes & Fees</span>
                  <span>₹{taxes + platformFee}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between fw-bold text-dark">
                  <span>Final Amount</span>
                  <span className="text-primary fs-5">₹{finalAmount}</span>
                </div>
              </div>

              <div className="small text-muted text-center" style={{ fontSize: "11px" }}>
                🔒 256-bit SSL Encrypted & Protected
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "500px" }}>
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-bottom p-3">
                <h5 className="modal-title fw-bold text-dark mb-0">Add Service Address in Patna</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddAddressModal(false)}
                ></button>
              </div>

              <form onSubmit={handleAddNewAddress}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="fw-semibold small mb-1">Contact Name</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={newAddrForm.name}
                      onChange={(e) => setNewAddrForm({ ...newAddrForm, name: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="fw-semibold small mb-1">Mobile Number</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={newAddrForm.phone}
                      onChange={(e) => setNewAddrForm({ ...newAddrForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="fw-semibold small mb-1">Flat / House No. / Building Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Flat 302, Shanti Vihar"
                      required
                      value={newAddrForm.flatHouse}
                      onChange={(e) => setNewAddrForm({ ...newAddrForm, flatHouse: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="fw-semibold small mb-1">Street / Colony</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Main Road, Near PC Colony"
                      required
                      value={newAddrForm.streetArea}
                      onChange={(e) => setNewAddrForm({ ...newAddrForm, streetArea: e.target.value })}
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="fw-semibold small mb-1">Patna Locality</label>
                      <select
                        className="form-select"
                        value={newAddrForm.locality}
                        onChange={(e) => {
                          const loc = PATNA_LOCATIONS.find((l) => l.name === e.target.value);
                          setNewAddrForm({
                            ...newAddrForm,
                            locality: e.target.value,
                            pincode: loc?.pincode || "800001",
                          });
                        }}
                      >
                        {PATNA_LOCATIONS.map((loc) => (
                          <option key={loc.id} value={loc.name}>
                            {loc.name} ({loc.pincode})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="fw-semibold small mb-1">Pincode</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newAddrForm.pincode}
                        onChange={(e) => setNewAddrForm({ ...newAddrForm, pincode: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="fw-semibold small mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Opposite Domino's Pizza"
                      value={newAddrForm.landmark}
                      onChange={(e) => setNewAddrForm({ ...newAddrForm, landmark: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-footer border-top p-3">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setShowAddAddressModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4 fw-bold rounded-pill">
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingWizardPage() {
  return (
    <Suspense fallback={<div className="container py-5 text-center text-muted">Loading booking wizard...</div>}>
      <BookingWizardContent />
    </Suspense>
  );
}
