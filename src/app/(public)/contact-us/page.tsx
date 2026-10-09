"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { useCreateContactMutation } from "@/store/api/contactus";
import styles from "./contact-us.module.scss";

const contactCards = [
  {
    title: "Call Support",
    value: "+91 98765 43210",
    hint: "Mon-Sat, 9:00 AM - 7:00 PM",
    icon: "fa-solid fa-phone",
  },
  {
    title: "Email Us",
    value: "apnakitabinfo@gmail.com",
    hint: "Typical response in 2-4 hours",
    icon: "fa-solid fa-envelope",
  },
  {
    title: "Visit Office",
    value: "Sector 62, Noida, Uttar Pradesh",
    hint: "Near Electronic City Metro",
    icon: "fa-solid fa-location-dot",
  },
];

const quickTopics = [
  { label: "Mock test access issue", value: "support" },
  { label: "Payment success but plan not active", value: "sales" },
  { label: "Exam category suggestion", value: "general" },
  { label: "General Inquiry", value: "general" },
  { label: "Feedback", value: "feedback" },
  { label: "Other", value: "other" },
];

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    MobileNumber: "",
    Topic: "",
    Message: "",
  });

  const [createContact, { isLoading }] = useCreateContactMutation();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.Topic) {
      toast.error("Please select a topic");
      return;
    }

    try {
      const response = await createContact(formData).unwrap();
      toast.success(response.message || "Query Send to Admin");
      setFormData({
        FullName: "",
        Email: "",
        MobileNumber: "",
        Topic: "",
        Message: "",
      });
    } catch (err: any) {
      console.error("Failed to submit contact form:", err);
      toast.error(
        err?.data?.message || "Failed to submit query. Please try again.",
      );
    }
  };

  return (
    <div className={styles.contactPage}>
      <section className={styles.heroSection}>
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <p className={styles.kicker}>Support Center</p>
              <h1>Let&apos;s Solve Your Query Faster</h1>
              <p className={styles.heroText}>
                Team Apna Kitab is here to help you with subscriptions, mock
                tests, and exam preparation guidance. Fill the form and we will
                connect with you quickly.
              </p>

              <div className={styles.heroMeta}>
                <span>
                  <i className="fa-solid fa-clock"></i> Avg reply: under 4 hours
                </span>
                <span>
                  <i className="fa-solid fa-circle-check"></i> 98% issue
                  resolution
                </span>
              </div>
            </div>

            <div className="col-lg-5">
              <div className={styles.heroBadgeCard}>
                <h5>Need Immediate Help?</h5>
                <p>
                  For urgent payment or test access issues, call support
                  directly.
                </p>
                <a href="tel:+919876543210" className={styles.callNowBtn}>
                  <i className="fa-solid fa-headset"></i> Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.mainSection}>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-7">
              <div className={styles.formCard}>
                <div className={styles.cardHeader}>
                  <h3>Send Us a Message</h3>
                  <p>
                    Share details clearly so we can resolve your issue quickly.
                  </p>
                </div>

                <form className="row g-3" onSubmit={handleSubmit}>
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="FullName"
                      value={formData.FullName}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      name="MobileNumber"
                      value={formData.MobileNumber}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Topic</label>
                    <select
                      className="form-select"
                      name="Topic"
                      value={formData.Topic}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select topic
                      </option>
                      {quickTopics.map((topic) => (
                        <option key={topic.value} value={topic.value}>
                          {topic.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Message</label>
                    <textarea
                      name="Message"
                      value={formData.Message}
                      onChange={handleChange}
                      className="form-control"
                      rows={5}
                      placeholder="Explain your issue or requirement"
                      required
                    ></textarea>
                  </div>

                  <div className="col-12 d-flex flex-wrap gap-3 align-items-center">
                    <button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={isLoading}
                    >
                      {isLoading ? "Submitting..." : "Submit Query"}
                    </button>
                    <p className={styles.formNote}>
                      We usually reply within the same day.
                    </p>
                  </div>
                </form>
              </div>
            </div>

            <div className="col-lg-5">
              <div className={styles.sideStack}>
                <div className={styles.infoCard}>
                  <h4>Contact Channels</h4>
                  <div className="row g-3">
                    {contactCards.map((item) => (
                      <div className="col-12" key={item.title}>
                        <div className={styles.contactItem}>
                          <div className={styles.iconWrap}>
                            <i className={item.icon}></i>
                          </div>
                          <div>
                            <p>{item.title}</p>
                            <h6>{item.value}</h6>
                            <span>{item.hint}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <h4>Popular Help Links</h4>
                  <ul className={styles.quickLinks}>
                    <li>
                      <Link href="/">Subscription & Billing</Link>
                    </li>
                    <li>
                      <Link href="/">Manage Your Purchases</Link>
                    </li>
                    <li>
                      <Link href="/">Exam Categories</Link>
                    </li>
                    <li>
                      <Link href="/">App Download & Login Help</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.mapSection}>
        <div className="container">
          <div className={styles.mapCard}>
            <div className="row g-4 align-items-center">
              <div className="col-lg-5">
                <h3>Our Office</h3>
                <p>
                  Apna Kitab Learning Pvt. Ltd. <br />
                  Tower B, Sector 62, Noida, Uttar Pradesh - 201309
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapBtn}
                >
                  Open in Maps
                </a>
              </div>
              <div className="col-lg-7">
                <div className={styles.mapPlaceholder}>
                  <i className="fa-solid fa-map-location-dot"></i>
                  <p>Google Map Integration Area</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
