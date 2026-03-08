import React from "react";
import { motion } from "framer-motion";
import { Eye, DollarSign, Film } from "lucide-react";

const cases = [
  {
    brand: "SoundWave Records",
    type: "เพลง",
    views: "48M",
    budget: "$4,200",
    clips: "320",
    cpm: "$1.20",
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
  },
  {
    brand: "NeonPlay Studios",
    type: "เกม",
    views: "112M",
    budget: "$11,800",
    clips: "890",
    cpm: "$1.50",
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop",
  },
  {
    brand: "Streamline Films",
    type: "หนัง",
    views: "27M",
    budget: "$2,900",
    clips: "180",
    cpm: "$1.30",
    img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=250&fit=crop",
  },
];

const CaseStudies = () => {
  return (
    <section className="py-24 px-6 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            กรณี<span className="text-[#c8f135]">ศึกษา</span>
          </h2>
          <p className="text-[#8a8a8a] text-lg max-w-xl mx-auto">
            ผลลัพธ์จริงจาก Campaign จริง
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-[#141414] border-2 border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-[#c8f135]/30 transition-all"
            >
              <div className="relative h-48">
                <img
                  src={c.img}
                  alt={c.brand}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-[#c8f135] text-[#0a0a0a] text-xs font-bold px-3 py-1 rounded-full">
                    {c.type}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4">{c.brand}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#c8f135]" />
                    <div>
                      <div className="text-lg font-bold">{c.views}</div>
                      <div className="text-xs text-[#8a8a8a]">ยอดวิวรวม</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#c8f135]" />
                    <div>
                      <div className="text-lg font-bold">{c.budget}</div>
                      <div className="text-xs text-[#8a8a8a]">
                        งบประมาณที่ใช้
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-[#c8f135]" />
                    <div>
                      <div className="text-lg font-bold">{c.clips}</div>
                      <div className="text-xs text-[#8a8a8a]">คลิปที่สร้าง</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#c8f135]" />
                    <div>
                      <div className="text-lg font-bold">{c.cpm}</div>
                      <div className="text-xs text-[#8a8a8a]">อัตรา CPM</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
