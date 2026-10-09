import React from "react";
import "@/styles/PrivacyAndPolicyPage.scss";

const RefundPolicyPage = () => {
    return (
        <div className="privacy-page">
            <div className="privacy-container">
                <div className="privacy-header">
                    <span className="privacy-badge">Refund Policy</span>

                    <h1>Refund Policy</h1>

                    <p className="privacy-updated">
                        Last Updated: <strong>May 31, 2026</strong>
                    </p>
                </div>

                <div className="privacy-content">
                    <p>
                        At <strong>Apna Kitab</strong>, we aim to provide students with
                        quality test series and educational content. Please read this
                        Refund Policy carefully before purchasing any test series or
                        other paid services through our application.
                    </p>

                    <section className="privacy-section">
                        <h2>1. No Refund After Purchase</h2>

                        <p>
                            All purchases of test series and other digital educational
                            content on Apna Kitab are <strong>non-refundable</strong>.
                            Once a payment has been successfully completed, the amount
                            paid will not be refunded or reversed.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>2. Please Check Before Purchasing</h2>

                        <p>
                            Users are requested to carefully review the test series,
                            available features, syllabus, number of tests, pricing,
                            validity, and other relevant information before completing
                            the purchase.
                        </p>

                        <p>
                            By completing the payment, you confirm that you have reviewed
                            the available information and wish to purchase the selected
                            test series.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>3. Digital Content</h2>

                        <p>
                            Test series and other educational content provided through
                            Apna Kitab are digital products. Once the purchase is
                            successfully completed, access to the purchased content may
                            be provided to your account.
                        </p>

                        <p>
                            Due to the digital nature of the content, purchases cannot
                            be returned after payment has been completed.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>4. Incorrect Purchase</h2>

                        <p>
                            Users are responsible for selecting the correct test series
                            before making payment. Refunds will not be provided for
                            accidental purchases, incorrect test series selection,
                            change of mind, or failure to use the purchased content.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>5. Duplicate Payments</h2>

                        <p>
                            If you believe that you have been charged more than once for
                            the same transaction due to a technical or payment processing
                            issue, please contact us with the relevant transaction
                            details. We will review the payment and take appropriate
                            action where a duplicate charge is confirmed.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>6. Failed or Unsuccessful Payments</h2>

                        <p>
                            If a payment fails or is unsuccessful but the amount has been
                            deducted from your bank account or payment method, please
                            contact us with the transaction details. Such cases may be
                            reviewed based on the payment status received from the
                            applicable payment provider.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>7. Service or Technical Issues</h2>

                        <p>
                            If you experience a genuine technical issue that prevents you
                            from accessing a successfully purchased test series, please
                            contact our support team. We may investigate the issue and,
                            where appropriate, restore or provide access to the purchased
                            content.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>8. Promotional Offers</h2>

                        <p>
                            Promotional offers, discounts, or special pricing may be
                            subject to additional terms. Unless specifically stated
                            otherwise, discounted or promotional purchases are also
                            non-refundable.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>9. Policy Changes</h2>

                        <p>
                            Apna Kitab reserves the right to update or modify this Refund
                            Policy from time to time. Any changes will be published on
                            this page with an updated revision date.
                        </p>
                    </section>

                    <section className="privacy-contact">
                        <h2>10. Contact Us</h2>

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

export default RefundPolicyPage;
