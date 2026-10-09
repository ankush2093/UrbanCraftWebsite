"use client";

import React, { useState } from "react";
import HeroSection from "@/components/Marketplace/HeroSection";
import CategorySection from "@/components/Marketplace/CategorySection";
import PromotionalBanners from "@/components/Marketplace/PromotionalBanners";
import PopularServicesSection from "@/components/Marketplace/PopularServicesSection";
import HowItWorksSection from "@/components/Marketplace/HowItWorksSection";
import WhyChooseUsSection from "@/components/Marketplace/WhyChooseUsSection";
import CustomerReviewsSection from "@/components/Marketplace/CustomerReviewsSection";
import ServiceAreasSection from "@/components/Marketplace/ServiceAreasSection";
import FaqSection from "@/components/Marketplace/FaqSection";
import LocationModal from "@/components/Marketplace/LocationModal";

export default function HomePage() {
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  return (
    <div className="marketplace-homepage">
      {/* 1. Hero Section */}
      <HeroSection onOpenLocationModal={() => setLocationModalOpen(true)} />

      {/* 2. Service Categories (14 Categories) */}
      <CategorySection />

      {/* 3. Promotional Offers & Coupons */}
      <PromotionalBanners />

      {/* 4. Popular & Most Booked Services */}
      <PopularServicesSection />

      {/* 5. How It Works (4 Steps) */}
      <HowItWorksSection />

      {/* 6. Why Choose Us (6 Trust Cards) */}
      <WhyChooseUsSection />

      {/* 7. Customer Reviews & Testimonials */}
      <CustomerReviewsSection />

      {/* 8. Service Areas (Patna, Bihar Localities) */}
      <ServiceAreasSection onSelectArea={() => setLocationModalOpen(true)} />

      {/* 9. FAQs */}
      <FaqSection />

      {/* Location Modal */}
      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />
    </div>
  );
}
