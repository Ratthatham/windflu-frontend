"use client";
import { Wind } from "lucide-react";
import WindflowHero from "@/components/landing/WindflowHero";
import WindflowLogos from "@/components/landing/WindflowLogos";
import WindflowHowItWorks from "@/components/landing/WindflowHowItWorks";
import WindflowCaseStudies from "@/components/landing/WindflowCaseStudies";
import WindflowBookForm from "@/components/landing/WindflowBookForm";
import WindflowFooter from "@/components/landing/WindflowFooter";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-white text-[#1d1d1f] font-sans">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          scrolled
            ? "bg-white/70 backdrop-blur-xl border-b border-slate-100 py-4 shadow-[0_2px_20px_rgba(0,0,0,0.02)]"
            : "bg-transparent border-b border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <motion.div
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div
              className={`p-1.5 rounded-xl transition-all duration-500 ${scrolled ? "bg-[#1d1d1f]" : "bg-white border border-slate-100 shadow-sm"}`}
            >
              <Wind
                className={`w-5 h-5 transition-colors duration-500 ${scrolled ? "text-white" : "text-[#1d1d1f]"}`}
              />
            </div>
            <span
              className={`font-bold text-xl tracking-tight transition-all duration-500 text-gradient-brand`}
            >
              Windflu
            </span>
          </motion.div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/brand/login"
                className={`text-sm font-semibold transition-colors duration-500 hover:text-blue-600 ${
                  scrolled ? "text-[#1d1d1f]/70" : "text-[#1d1d1f]/70"
                }`}
              >
                สำหรับแบรนด์
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href={"/login"}>
                <motion.button
                  whileHover={{ y: -1 }}
                  className={`text-sm font-bold transition-all duration-500 ${
                    scrolled
                      ? "text-[#1d1d1f]/70 hover:text-[#1d1d1f]"
                      : "text-[#1d1d1f]/70 hover:text-[#1d1d1f]"
                  }`}
                >
                  เข้าสู่ระบบ
                </motion.button>
              </Link>
              <Link href={"/register"}>
                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`text-sm px-6 py-2.5 rounded-full font-bold transition-all duration-500 shadow-sm ${
                    scrolled
                      ? "bg-[#1d1d1f] text-white hover:bg-black"
                      : "bg-[#1d1d1f] text-white hover:bg-black"
                  }`}
                >
                  สมัครเป็น Clipper
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      <WindflowHero
        onBookCall={scrollToBooking}
        onGetStarted={() => (window.location.href = "register")}
      />
      <WindflowLogos />
      <WindflowHowItWorks />
      <WindflowCaseStudies />
      <WindflowBookForm />

      <WindflowFooter />
    </div>
  );
};

export default HomePage;
