import type { Metadata } from "next";
import { Poppins, Outfit } from "next/font/google";
import "@/styles/globals.scss";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import BootstrapClient from "@/components/BootstrapClient/BootstrapClient";
import FontAwesomeClient from "@/components/FontAwesomeClient/FontAwesomeClient";
import FaviconClient from "@/components/FaviconClient/FaviconClient";
import { AuthProvider } from "@/context/AuthContext";
import ReduxProvider from "@/lib/providers/ReduxProvider/ReduxProvider";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export async function generateMetadata(): Promise<Metadata> {
  const isStaging =
    process.env.NEXT_PUBLIC_APP_ENV === "staging";

  return {
    title: "UrbanCraft | Trusted Doorstep Home & Salon Services in Patna",

    description:
      "Book background-verified professionals for home cleaning, AC repair, plumbing, electrician, salon at home, and appliance maintenance across Patna with 30-day service warranty.",

    keywords: [
      "UrbanCraft",
      "Home services Patna",
      "AC service Patna",
      "Home cleaning Patna",
      "Bathroom cleaning Patna",
      "Salon at home Patna",
      "Electrician in Patna",
      "Plumber in Patna",
      "Appliance repair Patna",
      "Pest control Patna",
      "Doorstep repair services",
    ],

    robots: isStaging
      ? {
        index: false,
        follow: false,
      }
      : {
        index: true,
        follow: true,
      },

    verification: isStaging
      ? undefined
      : {
        google:
          "RrEavCxcy--z2Ab1Ym27ZIfiSo1dXQgNK3dwX57X2MI",
      },

    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.MathJax = {
                tex: {
                  inlineMath: [['\\\\(', '\\\\)'], ['$', '$']],
                  displayMath: [['\\\\[', '\\\\]'], ['$$', '$$']]
                },
                options: {
                  skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
                }
              };
            `,
          }}
        />
        <script
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
          async
        />
      </head>
      <body
        className={`${poppins.variable} ${outfit.variable} ${poppins.className}`}
      >
        <FaviconClient />
        <ToastContainer position="top-center" autoClose={3000} />
        <ReduxProvider>
          <AuthProvider>
            <Navbar />
            <main className="main-content">{children}</main>
            <Footer />
            <BootstrapClient />
            <FontAwesomeClient />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
