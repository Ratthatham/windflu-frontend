"use client";
import { Wind } from "lucide-react";
import WindflowHero from "@/components/landing/WindflowHero";
import WindflowLogos from "@/components/landing/WindflowLogos";
import WindflowHowItWorks from "@/components/landing/WindflowHowItWorks";
import WindflowCaseStudies from "@/components/landing/WindflowCaseStudies";
import WindflowBookForm from "@/components/landing/WindflowBookForm";
import Link from "next/link";
import { useState, useEffect } from "react";

const HomePage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBooking = () => {
    document
      .getElementById("book-call")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1230]">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          scrolled
            ? "bg-white/30 backdrop-blur-2xl backdrop-saturate-180 border-b border-white/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
            : "bg-transparent backdrop-blur-none backdrop-saturate-100 border-b border-transparent py-3 shadow-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wind
              className={`w-6 h-6 transition-colors duration-300 ${scrolled ? "text-[#8B5CF6]" : "text-white"}`}
            />
            <span
              className={`font-black text-xl tracking-tight transition-all duration-300 ${
                !scrolled ? "text-white" : ""
              }`}
              style={
                scrolled
                  ? {
                      background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }
                  : {}
              }
            >
              Windflow
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToBooking}
              className={`text-sm transition-colors duration-300 hidden sm:block font-medium ${
                scrolled
                  ? "text-[#6b5f8a] hover:text-[#1a1230]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              คุยกับแบรนด์
            </button>
            <Link href={"Onboarding"}>
              <button
                className={`text-sm px-5 py-2.5 rounded-full font-bold transition-all duration-300 ${
                  scrolled
                    ? "btn-cta"
                    : "bg-white text-[#8B5CF6] hover:bg-white/90 shadow-lg shadow-black/10"
                }`}
              >
                สมัครเป็น Clipper
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <WindflowHero
        onBookCall={scrollToBooking}
        onGetStarted={() => (window.location.href = "Onboarding")}
      />
      <WindflowLogos />
      <WindflowHowItWorks />
      <WindflowCaseStudies />
      <WindflowBookForm />

      <footer className="border-t border-[#ede8f5] py-10 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5" style={{ color: "#8B5CF6" }} />
            <span
              className="font-black tracking-tight"
              style={{
                background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Windflow
            </span>
          </div>
          <p className="text-sm text-[#6b5f8a]">
            Windflow 2569 — ทำโดยคนไทย เพื่อคนไทยโดยเฉพาะ
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
