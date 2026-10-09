import React from "react";
import "@/styles/PrivacyAndPolicyPage.scss";

const PrivacyAndPolicyPage = () => {
    return (
        <div className="privacy-page">
            <div className="privacy-container">
                <div className="privacy-header">
                    <span className="privacy-badge">Privacy & Security</span>

                    <h1>Privacy Policy</h1>

                    <p className="privacy-updated">
                        Last Updated: <strong>May 31, 2026</strong>
                    </p>
                </div>

                <div className="privacy-content">
                    <p>
                        Welcome to <strong>Apna Kitab</strong>. Your privacy is important to
                        us. This Privacy Policy explains how we collect, use, and protect
                        your information when you use our application and services.
                    </p>

                    <section className="privacy-section">
                        <h2>Information We Collect</h2>

                        <ul>
                            <li>Full Name</li>
                            <li>Email Address</li>
                            <li>Phone Number</li>
                            <li>Profile Photo (Optional)</li>
                            <li>Exam Performance and Test History</li>
                            <li>Purchase Information</li>
                        </ul>
                    </section>

                    <section className="privacy-section">
                        <h2>How We Use Your Information</h2>

                        <ul>
                            <li>To create and manage your account.</li>
                            <li>To provide mock tests and educational content.</li>
                            <li>To track your performance and rankings.</li>
                            <li>To process payments and subscriptions.</li>
                            <li>To improve our services and user experience.</li>
                        </ul>
                    </section>

                    <section className="privacy-section">
                        <h2>Data Security</h2>

                        <p>
                            We implement reasonable security measures to protect your
                            personal information from unauthorized access, disclosure, or
                            misuse.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>Payments</h2>

                        <p>
                            Payments are processed through trusted third-party payment
                            providers. We do not store your debit card, credit card, or
                            banking details on our servers.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>Account Deletion</h2>

                        <p>
                            Users can request account deletion directly from the Profile
                            section of the app. Upon deletion, personal account information
                            will be removed from our systems, except where retention is
                            required by law.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>Third-Party Services</h2>

                        <p>
                            We may use trusted third-party services for authentication,
                            analytics, payment processing, and application functionality.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>Children's Privacy</h2>

                        <p>
                            Our services are intended for students and learners. Parents or
                            guardians should supervise younger users where appropriate.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>Changes to This Privacy Policy</h2>

                        <p>
                            We may update this Privacy Policy from time to time. Changes will
                            be posted on this page with an updated revision date.
                        </p>
                    </section>

                    <section className="privacy-contact">
                        <h2>Contact Us</h2>

                        <div className="privacy-contact-box">
                            <h3>Apna Kitab</h3>

                            <a href="mailto:apnakitabinfo@gmail.com">
                                apnakitabinfo@gmail.com
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyAndPolicyPage;