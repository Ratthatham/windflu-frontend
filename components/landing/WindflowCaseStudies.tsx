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
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-[#1a1230]">
            ผลลัพธ์จริงจากแคมเปญ
          </h2>
          <p className="text-[#6b5f8a]">ตัวเลขจริง วัดได้ โปร่งใส</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-[#ede8f5] rounded-2xl overflow-hidden hover:shadow-lg transition-all"
              style={{ boxShadow: "0 4px 24px rgba(139,92,246,0.08)" }}
            >
              <div className="relative">
                <img
                  src={c.img}
                  alt={c.brand}
                  className="w-full h-40 object-cover"
                />
                <div
                  className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
                  style={{
                    background: "linear-gradient(135deg,#FF6B9D,#8B5CF6)",
                  }}
                />
              </div>
              <div className="p-5">
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#8B5CF6" }}
                >
                  {c.type}
                </span>
                <h3 className="text-base font-bold text-[#1a1230] mt-1 mb-4">
                  {c.brand}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Eye, val: c.views, label: "ยอดวิว" },
                    { icon: Film, val: c.clips, label: "คลิป" },
                    { icon: DollarSign, val: c.cpm, label: "CPM" },
                  ].map((m, j) => (
                    <div
                      key={j}
                      className="text-center bg-[#fafafa] rounded-xl p-2 border border-[#ede8f5]"
                    >
                      <m.icon
                        className="w-3.5 h-3.5 mx-auto mb-1"
                        style={{ color: "#8B5CF6" }}
                      />
                      <div className="text-sm font-bold text-[#1a1230]">
                        {m.val}
                      </div>
                      <div className="text-[10px] text-[#6b5f8a]">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WindflowCaseStudies;
