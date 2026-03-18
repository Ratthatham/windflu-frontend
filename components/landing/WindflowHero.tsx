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
    <section className="relative pt-40 pb-20 px-6 overflow-hidden bg-white">
      {/* Subtle background glow elements (Apple-esque depth with IG colors) */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.08, 0.12, 0.08],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-brand-pink rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
          delay: 2,
        }}
        className="absolute bottom-1/4 -right-20 w-[700px] h-[700px] bg-brand-yellow rounded-full blur-[140px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.12,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              },
            },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-sm font-medium mb-12"
          >
            <Wind className="w-4 h-4 text-brand-pink" />
            <span className="tracking-tight">
              แพลตฟอร์มการตลาดคลิปสั้นอันดับหนึ่งในไทย
            </span>
          </motion.div>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-6xl md:text-[88px] font-extrabold tracking-tight mb-8 leading-[1.05] text-[#1d1d1f]"
          >
            เปลี่ยนยอดวิวธรรมดา
            <br />
            <span className="text-gradient-brand">เป็นรายได้จริง</span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-xl md:text-2xl text-[#86868b] max-w-2xl mx-auto mb-12 leading-relaxed tracking-tight"
          >
            เชื่อมแบรนด์กับ Clipper
            มืออาชีพผ่านระบบที่ช่วยเพิ่มรายได้ให้คุณแบบอัตโนมัติ
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24"
          >
            <button
              onClick={onGetStarted}
              className="btn-cta bg-[#1d1d1f] hover:bg-[#000000] text-lg px-10 py-4"
            >
              สมัครเป็น Clipper
            </button>
            <button onClick={onBookCall} className="btn-secondary group">
              สำหรับแบรนด์ที่ต้องการเติบโต
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WindflowHero;
