"use client";

import React from "react";
import { Zap } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

const stats = [
  { value: "100M+", label: "ยอดวิวที่สร้าง", sublabel: "ทั่วทุก Platform" },
  { value: "38,000", label: "Clipper ที่ใช้งาน", sublabel: "พร้อมโพสต์ทันที" },
  { value: "$1", label: "ต่อ 1,000 วิว", sublabel: "CPM โปร่งใส ไม่มีซ่อน" },
];

interface HeroSectionProps {
  onBookCall: () => void;
  onGetStarted: () => void;
}

const HeroSection = ({ onBookCall, onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Grid bg */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#c8f135 1px, transparent 1px), linear-gradient(90deg, #c8f135 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#c8f135] rounded-full blur-[220px] opacity-[0.07]" />

      <div className="relative max-w-7xl mx-auto px-6 py-28 lg:py-36 w-full">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-[#c8f135]/10 border border-[#c8f135]/20 rounded-full px-4 py-2">
            <Zap className="w-4 h-4 text-[#c8f135]" />
            <span className="text-[#c8f135] text-sm font-semibold tracking-wide">
              แพลตฟอร์ม CLIPPING อันดับ 1
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center max-w-4xl mx-auto mb-10"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6">
            เปลี่ยนคอนเทนต์
            <br />
            ให้<span className="text-[#c8f135]">ไวรัล</span>
            <br />
            ทั่วโลก
          </h1>
          <p className="text-lg md:text-xl text-[#8a8a8a] max-w-2xl mx-auto leading-relaxed">
            เชื่อมต่อกับ Clipper กว่า 38,000 คน
            ที่จะแปลงคอนเทนต์ของคุณให้มียอดวิวนับล้านบน TikTok, Instagram Reels
            และ YouTube Shorts
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Button
            onClick={onBookCall}
            className="w-full sm:w-auto bg-[#c8f135] text-[#0a0a0a] hover:bg-[#d4f54a] font-bold text-lg px-8 py-6 rounded-xl border-2 border-[#c8f135] shadow-[4px_4px_0px_0px_rgba(200,241,53,0.25)]"
          >
            จองโทรฟรี
          </Button>
          <Button
            onClick={onGetStarted}
            variant="outline"
            className="w-full sm:w-auto font-bold text-lg px-8 py-6 rounded-xl border-2 border-[#2a2a2a] text-white hover:bg-[#1a1a1a] hover:border-[#3a3a3a]"
          >
            เริ่มต้น Clipping →
          </Button>
        </motion.div>

        {/* STATS — large and prominent */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2a2a2a] rounded-2xl overflow-hidden border-2 border-[#2a2a2a] max-w-4xl mx-auto"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#0f0f0f] px-8 py-10 text-center hover:bg-[#141414] transition-colors group"
            >
              {/* Big number */}
              <div className="text-5xl md:text-6xl lg:text-7xl font-black text-[#c8f135] leading-none mb-3 group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-base md:text-lg font-bold text-white mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-[#5a5a5a] font-medium uppercase tracking-widest">
                {stat.sublabel}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
