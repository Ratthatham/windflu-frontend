"use client";
import { motion } from "framer-motion";
import { Wind, ChevronRight } from "lucide-react";
import WindflowHowItWorks from "./WindflowHowItWorks";

interface WindflowHeroProps {
  onBookCall: () => void;
  onGetStarted: () => void;
}

const WindflowHero = ({ onBookCall, onGetStarted }: WindflowHeroProps) => {
  return (
    <section
      className="relative pt-32 pb-20 px-6 overflow-hidden gradient-noise"
      style={{
        background:
          "linear-gradient(135deg, #FFD93D, #FF8C42, #FF6B9D, #8B5CF6, #22D3EE)",
      }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 text-sm text-white font-semibold mb-8">
            <Wind className="w-4 h-4" />
            แพลตฟอร์มการตลาดคลิปสั้นอันดับหนึ่งในไทย
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight text-white">
            เปลี่ยนยอดวิวธรรมดา
            <br />
            <span
              style={{
                color: "rgba(255,255,255,0.9)",
                textShadow: "0 2px 20px rgba(0,0,0,0.15)",
              }}
            >
              เป็นรายได้จริง
            </span>
          </h1>

          <p
            className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            เชื่อมแบรนด์กับ Clipper มืออาชีพ กับ Windflu
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            {/* <button
              onClick={onBookCall}
              className="w-full sm:w-auto bg-white font-black text-base px-8 py-4 rounded-[50px] hover:bg-white/90 transition-all shadow-xl"
              style={{ color: "#8B5CF6", minHeight: 44 }}
            >
              นัดคุยฟรี สำหรับแบรนด์
            </button> */}
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-white font-black text-base px-8 py-4 rounded-[50px] hover:bg-white/90 transition-all shadow-xl"
              style={{ color: "#8B5CF6", minHeight: 44 }}
            >
              สมัครเป็น Clipper
            </button>
            {/* <button
              onClick={onGetStarted}
              className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-white/60 text-white font-bold text-base px-8 py-4 rounded-[50px] hover:bg-white/10 transition-all backdrop-blur-sm"
              style={{ minHeight: 44 }}
            >
              สมัครเป็น Clipper <ChevronRight className="w-4 h-4" />
            </button> */}
          </div>

          {/* <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { value: "2.4B+", label: "ยอดวิวรวมทั้งหมด" },
              { value: "3,200+", label: "Clipper ที่ใช้งานอยู่" },
              { value: "฿8–80", label: "CPM ต่อ 1,000 วิว" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-5"
              >
                <div className="text-3xl font-black text-white mb-1">
                  {s.value}
                </div>
                <div
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div> */}
          <WindflowHowItWorks />
        </motion.div>
      </div>
    </section>
  );
};

export default WindflowHero;
