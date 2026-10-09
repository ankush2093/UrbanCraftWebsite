"use client";

import React from "react";
import Link from "next/link";
import { ServiceItem } from "@/types/marketplace";
import { Star, Clock, ArrowRight, ShieldCheck } from "lucide-react";

interface ServiceCardProps {
  service: ServiceItem;
  onQuickBook?: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onQuickBook }) => {
  return (
    <div className="service-card h-100">
      <Link href={`/service/${service.slug}`} className="service-card-img-wrap d-block text-decoration-none">
        <img
          src={service.image}
          alt={service.name}
          className="service-card-img"
          loading="lazy"
        />
        <div className="service-rating-badge">
          <Star size={13} className="text-warning fill-warning" />
          <span>{service.rating}</span>
          <span className="opacity-75" style={{ fontSize: "10px" }}>
            ({service.reviewCount})
          </span>
        </div>
        <div className="service-duration-badge">
          <Clock size={12} className="text-primary" />
          <span>{service.duration}</span>
        </div>
      </Link>

      <div className="service-card-body">
        <div className="service-card-cat">{service.categoryName}</div>
        <Link href={`/service/${service.slug}`} className="text-decoration-none">
          <h3 className="service-card-title">{service.name}</h3>
        </Link>
        <p className="service-card-desc">{service.shortDescription}</p>

        <div className="service-card-footer">
          <div className="service-price-wrap">
            <span className="service-price-label">Starting from</span>
            <div className="d-flex align-items-baseline">
              <span className="service-price-val">₹{service.startingPrice}</span>
              {service.originalPrice && (
                <span className="service-original-price">₹{service.originalPrice}</span>
              )}
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link
              href={`/book/${service.slug}`}
              className="btn-book-service"
              onClick={(e) => {
                if (onQuickBook) {
                  e.preventDefault();
                  onQuickBook(service);
                }
              }}
            >
              <span>Book Now</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
