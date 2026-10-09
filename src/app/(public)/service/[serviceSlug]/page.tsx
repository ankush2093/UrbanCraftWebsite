"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ALL_SERVICES } from "@/lib/servicesData";
import { useGetMarketplaceServiceBySlugQuery, useUploadMarketplaceImageMutation } from "@/store/api";
import {
  Star,
  Clock,
  ShieldCheck,
  Check,
  X,
  ChevronDown,
  ArrowRight,
  Shield,
  HelpCircle,
  ThumbsUp,
  Award,
  Sparkles,
  Zap,
  Camera,
  Upload,
  Trash2,
  Loader2,
  FileText,
  CheckCircle2,
  Image as ImageIcon,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceSlug = params?.serviceSlug as string;

  const { data: serviceRes, isLoading } = useGetMarketplaceServiceBySlugQuery(serviceSlug);
  const [uploadImage, { isLoading: isUploadingPhotos }] = useUploadMarketplaceImageMutation();

  const fallback = ALL_SERVICES.find((s) => s.slug === serviceSlug || s.id === serviceSlug);
  const service = serviceRes?.data || fallback;

  // Selected Option state
  const [selectedOptionId, setSelectedOptionId] = useState<string>("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Problem / Issue Multi-Photo Attachment State
  const [problemPhotos, setProblemPhotos] = useState<string[]>([]);
  const [problemNote, setProblemNote] = useState<string>("");

  useEffect(() => {
    if (service?.options?.[0]?.id) {
      setSelectedOptionId(service.options[0].id);
    }
  }, [service]);

  // Load any previously attached photos for this service from session
  useEffect(() => {
    if (typeof window !== "undefined" && serviceSlug) {
      try {
        const saved = sessionStorage.getItem(`booking_issue_attachment_${serviceSlug}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.photos)) setProblemPhotos(parsed.photos);
          if (parsed.note) setProblemNote(parsed.note);
        }
      } catch (e) {
        // ignore parse error
      }
    }
  }, [serviceSlug]);

  // Handle Multi-Photo upload to ImageKit.io
  const handleMultiplePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    let successCount = 0;

    for (const file of fileList) {
      try {
        const res: any = await uploadImage({ file, folder: "services" }).unwrap();
        const url = res?.url || res?.data?.url || res?.data?.data?.url;
        if (url) {
          setProblemPhotos((prev) => [...prev, url]);
          successCount++;
        }
      } catch (err: any) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} photo(s) uploaded to ImageKit.io successfully!`);
    }
    // reset input
    e.target.value = "";
  };

  const handleRemovePhoto = (index: number) => {
    setProblemPhotos((prev) => prev.filter((_, idx) => idx !== index));
    toast.info("Photo removed");
  };

  if (isLoading && !service) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-3">Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: "60vh" }}>
        <h3 className="fw-bold text-dark">Service Not Found</h3>
        <p className="text-muted">The requested home service could not be located.</p>
        <Link href="/services" className="btn btn-primary rounded-pill px-4">
          Explore All Services
        </Link>
      </div>
    );
  }

  const optionsList = Array.isArray(service.options) && service.options.length > 0
    ? service.options
    : [
        {
          id: "default-opt",
          name: service.name,
          price: service.startingPrice || 499,
          originalPrice: service.originalPrice || 799,
          duration: service.duration || "45-60 mins",
          description: service.shortDescription || "Standard doorstep service",
          features: [],
        },
      ];

  const selectedOption =
    optionsList.find((opt) => opt.id === selectedOptionId) ||
    optionsList[0];

  const parseImagesArray = (raw: any): string[] => {
    if (Array.isArray(raw)) return raw.filter(Boolean);
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch {
        if (raw.trim().length > 0) return [raw.trim()];
      }
    }
    return [];
  };

  const rawAdditional = parseImagesArray(
    service.additionalImages ??
    (service as any).AdditionalImages ??
    (service as any).gallery ??
    (service as any).images
  );

  const primaryImage = service.image || (service as any).Image || "";

  // Strictly images loaded from DB/API
  const allImages = Array.from(
    new Set([primaryImage, ...rawAdditional].filter(Boolean))
  );

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  const includedList: string[] = Array.isArray(service.included) && service.included.length > 0
    ? service.included
    : typeof service.included === "string"
    ? [service.included]
    : [
        "Certified & background-verified professional",
        "Doorstep service with standardized tools & kit",
        "30-day post-service warranty guarantee",
        "Transparent pricing with no hidden charges",
      ];

  const excludedList: string[] = Array.isArray(service.excluded) && service.excluded.length > 0
    ? service.excluded
    : typeof service.excluded === "string"
    ? [service.excluded]
    : [
        "Major spare parts replacements billed separately with MRP invoice",
        "Additional unlisted repair tasks requested on-site",
      ];

  const faqsList = Array.isArray(service.faqs) && service.faqs.length > 0
    ? service.faqs
    : [
        {
          question: `How quickly will the professional arrive for ${service.name}?`,
          answer: "Our certified professionals arrive within the selected 60-minute time slot. You can track their live status and arrival updates directly in your dashboard.",
        },
        {
          question: "What if I need to reschedule or cancel my booking?",
          answer: "You can easily reschedule or cancel anytime up to 2 hours before your booked slot with zero cancellation fees.",
        },
        {
          question: "Is there any warranty on this service?",
          answer: `Yes! All bookings include our ${service.warranty || "30-day doorstep service guarantee"} covering quality and rework.`,
        },
      ];

  const reviewsList = Array.isArray(service.reviews) && service.reviews.length > 0
    ? service.reviews
    : [
        {
          id: "rev-1",
          userName: "Rahul Sharma",
          date: "3 days ago",
          rating: 5,
          serviceOptionName: selectedOption.name,
          comment: "Punctual, professional and very thorough work done at our doorstep in Patna. Highly recommended!",
        },
        {
          id: "rev-2",
          userName: "Pooja Verma",
          date: "1 week ago",
          rating: 5,
          serviceOptionName: selectedOption.name,
          comment: "Clean service execution, no hidden fees and very polite technician.",
        },
      ];

  const handleBookNow = () => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          `booking_issue_attachment_${service.slug}`,
          JSON.stringify({ photos: problemPhotos, note: problemNote })
        );
      } catch (e) {
        // ignore
      }
    }
    router.push(`/book/${service.slug}?option=${selectedOption.id}`);
  };

  return (
    <div className="py-4 pb-5">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small text-muted">
            <li className="breadcrumb-item">
              <Link href="/" className="text-decoration-none text-muted">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/services" className="text-decoration-none text-muted">Services</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href={`/services/${service.categorySlug}`} className="text-decoration-none text-muted">
                {service.categoryName}
              </Link>
            </li>
            <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">
              {service.name}
            </li>
          </ol>
        </nav>

        <div className="row g-4">
          {/* Left Column: Details, Options, Inclusions, Reviews */}
          <div className="col-lg-8">
            {/* Image Gallery & Header Card */}
            <div className="bg-white rounded-4 border overflow-hidden shadow-sm mb-4">
              {/* Main Hero Slider */}
              <div className="position-relative" style={{ height: "380px", background: "#0f172a" }}>
                <img
                  src={allImages[activeImageIndex] || "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80"}
                  alt={`${service.name} - Photo ${activeImageIndex + 1}`}
                  className="w-100 h-100 object-fit-cover"
                  style={{ transition: "all 0.3s ease" }}
                />

                {/* Floating Top Badges */}
                <div className="position-absolute top-0 start-0 end-0 p-3 d-flex justify-content-between align-items-center" style={{ pointerEvents: "none" }}>
                  <span className="badge bg-dark bg-opacity-75 text-white px-3 py-2 rounded-pill shadow-sm d-flex align-items-center gap-1" style={{ pointerEvents: "auto", fontSize: "12px", backdropFilter: "blur(6px)" }}>
                    <Camera size={14} className="text-warning" />
                    <span>Photo {activeImageIndex + 1} of {allImages.length}</span>
                  </span>
                  <span className="badge bg-primary text-white px-3 py-2 rounded-pill shadow-sm fw-bold" style={{ pointerEvents: "auto", fontSize: "12px" }}>
                    {service.categoryName}
                  </span>
                </div>

                {/* Left & Right Slider Arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="btn position-absolute top-50 start-0 translate-middle-y ms-3 p-2 rounded-circle bg-dark bg-opacity-50 text-white border-0 shadow d-flex align-items-center justify-content-center"
                      style={{ width: "42px", height: "42px", backdropFilter: "blur(6px)", zIndex: 3 }}
                      onClick={handlePrevImage}
                      title="Previous Photo"
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <button
                      type="button"
                      className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-2 rounded-circle bg-dark bg-opacity-50 text-white border-0 shadow d-flex align-items-center justify-content-center"
                      style={{ width: "42px", height: "42px", backdropFilter: "blur(6px)", zIndex: 3 }}
                      onClick={handleNextImage}
                      title="Next Photo"
                    >
                      <ChevronRight size={22} />
                    </button>
                  </>
                )}
              </div>

              {/* Dedicated High-Res Thumbnail Gallery Bar */}
              {allImages.length > 1 && (
                <div className="p-3 bg-light border-bottom">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="small text-muted fw-semibold d-flex align-items-center gap-1">
                      <ImageIcon size={14} className="text-primary" />
                      All Service Photos & Angles ({allImages.length})
                    </span>
                    <span className="small text-muted" style={{ fontSize: "11px" }}>
                      Click any photo to preview
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2 overflow-auto pb-1" style={{ scrollbarWidth: "thin" }}>
                    {allImages.map((img, idx) => {
                      const isActive = activeImageIndex === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          className={`btn p-1 rounded-3 bg-white border position-relative overflow-hidden flex-shrink-0 ${
                            isActive
                              ? "border-primary shadow-sm ring-2 ring-primary"
                              : "opacity-75 hover-opacity-100"
                          }`}
                          style={{
                            width: "80px",
                            height: "64px",
                            borderColor: isActive ? "#0d6efd" : "#e2e8f0",
                            borderWidth: isActive ? "2px" : "1px",
                            transition: "all 0.2s ease",
                          }}
                          onClick={() => setActiveImageIndex(idx)}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-100 h-100 rounded-2 object-fit-cover"
                          />
                          {isActive && (
                            <span
                              className="position-absolute bottom-0 start-0 end-0 text-white bg-primary text-center fw-bold"
                              style={{ fontSize: "9px", lineHeight: "1.3" }}
                            >
                              Active
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="p-4">
                <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                  <span className="badge bg-primary text-white rounded-pill px-3 py-1 fw-bold" style={{ fontSize: "11px" }}>
                    {service.categoryName}
                  </span>
                  <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 fw-bold d-flex align-items-center gap-1">
                    <ShieldCheck size={13} />
                    Verified Partner
                  </span>
                </div>

                <h1 className="fw-bold text-dark fs-3 mb-2">{service.name}</h1>
                <p className="text-muted small mb-3" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                  {service.fullDescription || service.shortDescription}
                </p>

                {/* Rating & Stats Strip */}
                <div className="d-flex align-items-center gap-4 py-3 border-top border-bottom text-muted small flex-wrap">
                  <div className="d-flex align-items-center gap-1 text-dark fw-bold">
                    <Star size={16} className="text-warning fill-warning" />
                    <span>{service.rating || 4.8}</span>
                    <span className="text-muted fw-normal">({service.reviewCount || 120} reviews)</span>
                  </div>
                  <div>•</div>
                  <div className="d-flex align-items-center gap-1">
                    <Clock size={16} className="text-primary" />
                    <span>Duration: <strong>{selectedOption.duration || service.duration || "45-60 mins"}</strong></span>
                  </div>
                  <div>•</div>
                  <div className="d-flex align-items-center gap-1 text-success fw-semibold">
                    <Zap size={15} />
                    <span>Instant Booking in Patna</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Select Service Option / Variant */}
            <div className="bg-white rounded-4 border p-4 shadow-sm mb-4">
              <h4 className="fw-bold text-dark fs-5 mb-1 d-flex align-items-center gap-2">
                <Sparkles size={18} className="text-primary" />
                Select Package / Option
              </h4>
              <p className="text-muted small mb-3">
                Choose the best package suited for your requirements. Prices update automatically.
              </p>

              <div className="d-flex flex-column gap-3">
                {optionsList.map((opt) => {
                  const isSelected = opt.id === selectedOption.id;
                  return (
                    <div
                      key={opt.id}
                      className={`service-option-card ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedOptionId(opt.id)}
                    >
                      <div className="d-flex align-items-start justify-content-between gap-3">
                        <div className="d-flex align-items-start gap-3">
                          <input
                            type="radio"
                            name="serviceOption"
                            className="form-check-input mt-1"
                            checked={isSelected}
                            onChange={() => setSelectedOptionId(opt.id)}
                          />
                          <div>
                            <div className="fw-bold text-dark fs-6 d-flex align-items-center gap-2">
                              {opt.name}
                            </div>
                            <div className="text-muted small mt-1" style={{ fontSize: "13px" }}>
                              {opt.description}
                            </div>
                            <div className="text-primary small fw-semibold mt-2 d-flex align-items-center gap-1">
                              <Clock size={13} />
                              <span>Approx. {opt.duration}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-end flex-shrink-0">
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
            </div>

            {/* Multiple Photos / Problem Attachment Card */}
            <div className="bg-white rounded-4 border p-4 shadow-sm mb-4" style={{ borderColor: "#cbd5e1" }}>
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
                <div>
                  <h4 className="fw-bold text-dark fs-5 mb-1 d-flex align-items-center gap-2">
                    <Camera size={20} className="text-primary" />
                    Attach Problem Photos / Machine Model Label
                  </h4>
                  <p className="text-muted small mb-0">
                    Upload multiple images of the damaged part, error screen or appliance sticker. Helps technician bring exact tools & spare parts!
                  </p>
                </div>
                {problemPhotos.length > 0 && (
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold">
                    ✓ {problemPhotos.length} Photo{problemPhotos.length > 1 ? "s" : ""} Attached
                  </span>
                )}
              </div>

              {/* Upload Dropzone */}
              <label
                className={`w-100 border border-2 border-dashed rounded-3 p-3 p-md-4 text-center d-flex flex-column align-items-center justify-content-center mb-3 ${
                  isUploadingPhotos ? "bg-light opacity-75" : "bg-light bg-opacity-50"
                }`}
                style={{
                  cursor: isUploadingPhotos ? "not-allowed" : "pointer",
                  borderColor: "#94a3b8",
                  transition: "all 0.2s ease",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="d-none"
                  onChange={handleMultiplePhotoUpload}
                  disabled={isUploadingPhotos}
                />
                {isUploadingPhotos ? (
                  <div className="py-2 text-center">
                    <Loader2 size={32} className="text-primary spinner-border mb-2" />
                    <div className="fw-bold text-primary">Uploading photos to ImageKit.io CDN...</div>
                    <small className="text-muted">Optimizing and securing your attachments...</small>
                  </div>
                ) : (
                  <div className="py-2 text-center">
                    <div className="d-inline-flex p-3 rounded-circle bg-primary-subtle text-primary mb-2 shadow-sm">
                      <Upload size={24} />
                    </div>
                    <div className="fw-bold text-dark fs-6">
                      Click or Tap to Upload Multiple Photos
                    </div>
                    <div className="text-muted small mt-1">
                      PNG, JPG, WebP, HEIC. Upload appliance photos, error codes, leaking pipes, or model label.
                    </div>
                  </div>
                )}
              </label>

              {/* Uploaded Photos Preview Gallery */}
              {problemPhotos.length > 0 && (
                <div className="p-3 bg-light rounded-3 border mb-3">
                  <div className="fw-semibold text-dark small mb-2 d-flex align-items-center justify-content-between">
                    <span>Attached Issue Photos ({problemPhotos.length})</span>
                    <label className="btn btn-xs btn-outline-primary d-inline-flex align-items-center gap-1 mb-0 py-0 px-2" style={{ cursor: "pointer", fontSize: "11px" }}>
                      + Add More Photos
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="d-none"
                        onChange={handleMultiplePhotoUpload}
                        disabled={isUploadingPhotos}
                      />
                    </label>
                  </div>
                  <div className="row g-2">
                    {problemPhotos.map((photoUrl, pIdx) => (
                      <div key={pIdx} className="col-6 col-sm-4 col-md-3">
                        <div className="card border shadow-sm position-relative overflow-hidden h-100 rounded-3">
                          <img
                            src={photoUrl}
                            alt={`Problem attachment ${pIdx + 1}`}
                            className="w-100"
                            style={{ height: "95px", objectFit: "cover" }}
                          />
                          <div className="p-1 bg-white d-flex justify-content-between align-items-center">
                            <span className="badge bg-success-subtle text-success border border-success-subtle px-1" style={{ fontSize: "9px" }}>
                              ✓ ImageKit
                            </span>
                            <button
                              type="button"
                              className="btn btn-xs text-danger p-0 border-0 bg-transparent"
                              onClick={() => handleRemovePhoto(pIdx)}
                              title="Delete photo"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Issue Note */}
              <div>
                <label className="form-label fw-semibold text-dark small mb-1">
                  Describe Problem or Special Note for Technician (Optional)
                </label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="e.g. Washing machine vibrates violently in spin cycle. LG front load 7kg model. Please bring replacement belt or suspension springs."
                  value={problemNote}
                  onChange={(e) => setProblemNote(e.target.value)}
                  style={{ fontSize: "13px", borderRadius: "8px" }}
                />
              </div>

              {/* Why attach photos banner */}
              <div className="row g-2 mt-3 pt-3 border-top text-muted small">
                <div className="col-12 col-md-4 d-flex align-items-center gap-2">
                  <CheckCircle2 size={15} className="text-success flex-shrink-0" />
                  <span>Right spare parts on 1st visit</span>
                </div>
                <div className="col-12 col-md-4 d-flex align-items-center gap-2">
                  <CheckCircle2 size={15} className="text-success flex-shrink-0" />
                  <span>Accurate diagnostic estimation</span>
                </div>
                <div className="col-12 col-md-4 d-flex align-items-center gap-2">
                  <CheckCircle2 size={15} className="text-success flex-shrink-0" />
                  <span>Zero unnecessary delays</span>
                </div>
              </div>
            </div>

            {/* What's Included & What's Excluded */}
            <div className="bg-white rounded-4 border p-4 shadow-sm mb-4">
              <h4 className="fw-bold text-dark fs-5 mb-3">What&apos;s Included & Excluded</h4>

              <div className="row g-4">
                {/* Included */}
                <div className="col-md-6">
                  <div className="p-3 rounded-3 bg-success-subtle bg-opacity-25 border border-success-subtle h-100">
                    <h6 className="fw-bold text-success mb-3 d-flex align-items-center gap-2">
                      <Check size={18} />
                      What&apos;s Included
                    </h6>
                    <ul className="list-unstyled d-flex flex-column gap-2 mb-0 small text-dark">
                      {includedList.map((inc, i) => (
                        <li key={i} className="d-flex align-items-start gap-2">
                          <Check size={14} className="text-success mt-1 flex-shrink-0" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Excluded */}
                <div className="col-md-6">
                  <div className="p-3 rounded-3 bg-danger-subtle bg-opacity-25 border border-danger-subtle h-100">
                    <h6 className="fw-bold text-danger mb-3 d-flex align-items-center gap-2">
                      <X size={18} />
                      What&apos;s Not Included
                    </h6>
                    <ul className="list-unstyled d-flex flex-column gap-2 mb-0 small text-dark">
                      {excludedList.map((exc, i) => (
                        <li key={i} className="d-flex align-items-start gap-2">
                          <X size={14} className="text-danger mt-1 flex-shrink-0" />
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Warranty Card */}
            <div className="p-4 rounded-4 border mb-4 bg-primary text-white shadow-sm d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: "50px", height: "50px" }}
              >
                <Award size={26} />
              </div>
              <div>
                <h5 className="fw-bold mb-1">UrbanCraft Service Warranty</h5>
                <p className="small mb-0 opacity-90">{service.warranty || "30-Day Doorstep Service Guarantee"}</p>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-4 border p-4 shadow-sm mb-4">
              <h4 className="fw-bold text-dark fs-5 mb-3">Frequently Asked Questions</h4>
              <div className="d-flex flex-column gap-2">
                {faqsList.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={idx} className="border rounded-3 overflow-hidden">
                      <button
                        type="button"
                        className="w-100 p-3 text-start border-0 bg-white d-flex align-items-center justify-content-between gap-2 fw-semibold text-dark"
                        style={{ fontSize: "14px" }}
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          size={16}
                          style={{
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                          }}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-3 pb-3 text-muted small border-top pt-2">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="bg-white rounded-4 border p-4 shadow-sm">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h4 className="fw-bold text-dark fs-5 mb-0">Customer Reviews</h4>
                <div className="d-flex align-items-center gap-1 text-warning fw-bold">
                  <Star size={18} className="fill-warning text-warning" />
                  <span>{service.rating || 4.8} / 5.0</span>
                </div>
              </div>

              {/* Rating Metrics breakdown */}
              <div className="row g-3 p-3 bg-light rounded-3 mb-4 text-center">
                <div className="col-3 border-end">
                  <div className="fw-bold text-dark">4.9★</div>
                  <div className="text-muted small" style={{ fontSize: "11px" }}>Overall</div>
                </div>
                <div className="col-3 border-end">
                  <div className="fw-bold text-dark">4.9★</div>
                  <div className="text-muted small" style={{ fontSize: "11px" }}>Pro Behavior</div>
                </div>
                <div className="col-3 border-end">
                  <div className="fw-bold text-dark">4.8★</div>
                  <div className="text-muted small" style={{ fontSize: "11px" }}>Quality</div>
                </div>
                <div className="col-3">
                  <div className="fw-bold text-dark">5.0★</div>
                  <div className="text-muted small" style={{ fontSize: "11px" }}>Value</div>
                </div>
              </div>

              <div className="d-flex flex-column gap-3">
                {reviewsList.map((rev: any) => (
                  <div key={rev.id} className="border-bottom pb-3">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <div className="fw-bold text-dark">{rev.userName}</div>
                      <div className="text-muted small">{rev.date}</div>
                    </div>
                    <div className="d-flex align-items-center gap-1 text-warning mb-2">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} size={12} className="fill-warning text-warning" />
                      ))}
                      {rev.serviceOptionName && (
                        <span className="badge bg-light text-muted ms-2 fw-normal" style={{ fontSize: "10px" }}>
                          {rev.serviceOptionName}
                        </span>
                      )}
                    </div>
                    <p className="text-muted small mb-0">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Desktop Sticky Booking Summary Card */}
          <div className="col-lg-4 d-none d-lg-block">
            <div className="bg-white rounded-4 border p-4 shadow-sm sticky-top" style={{ top: "90px" }}>
              <h5 className="fw-bold text-dark mb-3">Booking Summary</h5>

              <div className="p-3 rounded-3 bg-light mb-3">
                <div className="text-muted small">Selected Package:</div>
                <div className="fw-bold text-dark">{selectedOption.name}</div>
                <div className="d-flex align-items-center justify-content-between mt-2 pt-2 border-top">
                  <span className="text-muted small">Price:</span>
                  <span className="fw-bold text-dark fs-5">₹{selectedOption.price}</span>
                </div>
              </div>

              {/* Attached Photos status in Summary */}
              {problemPhotos.length > 0 && (
                <div className="p-2 mb-3 bg-success-subtle bg-opacity-50 border border-success-subtle rounded-3 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" />
                    <span className="small fw-semibold text-success">
                      {problemPhotos.length} Problem Photo{problemPhotos.length > 1 ? "s" : ""} Attached
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    {problemPhotos.slice(0, 3).map((p, i) => (
                      <img
                        key={i}
                        src={p}
                        alt="attachment"
                        className="rounded-circle border"
                        style={{ width: "22px", height: "22px", objectFit: "cover" }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions summary */}
              <div className="mb-4">
                <div className="fw-semibold text-dark small mb-2">Package Highlights:</div>
                <div className="d-flex flex-column gap-1 small text-muted">
                  <div className="d-flex align-items-center gap-2">
                    <Check size={14} className="text-success" />
                    <span>30-Day Service Warranty</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Check size={14} className="text-success" />
                    <span>Background Verified Partner</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Check size={14} className="text-success" />
                    <span>No Hidden Charges</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary w-100 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 shadow"
                onClick={handleBookNow}
              >
                <span>Proceed to Book (₹{selectedOption.price})</span>
                <ArrowRight size={18} />
              </button>

              <div className="text-center text-muted small mt-3" style={{ fontSize: "12px" }}>
                🔒 Free cancellation up to 2 hours before slot
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Booking Bar */}
      <div className="sticky-mobile-booking-bar">
        <div>
          <div className="text-muted" style={{ fontSize: "11px" }}>Total Amount</div>
          <div className="fw-bold text-dark fs-5">₹{selectedOption.price}</div>
        </div>
        <button
          type="button"
          className="btn btn-primary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow"
          onClick={handleBookNow}
        >
          <span>Book Now</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
