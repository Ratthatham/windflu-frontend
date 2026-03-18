import React from "react";
import { motion } from "framer-motion";
import { Eye, DollarSign, Film } from "lucide-react";

const cases = [
  {
    brand: "Sony Music Thailand",
    type: "เพลง",
    views: "380M",
    budget: "฿850,000",
    clips: 1240,
    cpm: "฿22",
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
  },
  {
    brand: "Ragnarok Origin",
    type: "เกม",
    views: "520M",
    budget: "฿1,200,000",
    clips: 2100,
    cpm: "฿18",
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop",
  },
  {
    brand: "GDH ภาพยนตร์",
    type: "หนัง",
    views: "190M",
    budget: "฿420,000",
    clips: 680,
    cpm: "฿32",
    img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=250&fit=crop",
  },
];

const WindflowCaseStudies = () => {
  return (
    <section className="py-32 px-6 bg-white overflow-hidden border-t border-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1d1d1f] tracking-tight">
            ผลลัพธ์จริงที่แบรนด์ได้รับ
          </h2>
          <p className="text-lg text-[#86868b] font-medium tracking-tight">ทุกแคมเปญถูกวัดผลด้วยตัวเลขจริงที่โปร่งใส</p>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {cases.map((c, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              whileHover={{
                y: -12,
              }}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.06)] transition-all duration-500"
            >
              <div className="relative overflow-hidden group h-56">
                <motion.img
                  transition={{ duration: 0.6 }}
                  src={c.img}
                  alt={c.brand}
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-gradient-brand px-3 py-1 bg-slate-50/80 rounded-full border border-slate-100">
                    {c.type}
                  </span>
                  <div className="text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                    Case Study
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#1d1d1f] mb-8 tracking-tight">
                  {c.brand}
                </h3>
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-50">
                  {[
                    { icon: Eye, val: c.views, label: "ยอดวิว" },
                    { icon: Film, val: c.clips, label: "คลิป" },
                    { icon: DollarSign, val: c.cpm, label: "CPM" },
                  ].map((m, j) => (
                    <div
                      key={j}
                      className="text-center group/stat"
                    >
                      <div className="text-xl font-bold text-[#1d1d1f] mb-1 tracking-tight group-hover/stat:text-brand-pink transition-colors duration-300">
                        {m.val}
                      </div>
                      <div className="text-xs font-medium text-[#86868b] tracking-tight">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WindflowCaseStudies;
