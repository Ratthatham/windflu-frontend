import React from "react";
import { motion } from "framer-motion";
import { Upload, Scissors, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "แบรนด์อัปโหลดคอนเทนต์",
    desc: "แบรนด์ส่งวิดีโอต้นฉบับ กำหนดงบประมาณ และระบุเงื่อนไข Campaign",
  },
  {
    icon: Scissors,
    step: "02",
    title: "Clipper ตัดคลิปและโพสต์",
    desc: "ชุมชน Clipper กว่า 12,000 คนตัดวิดีโอสั้นที่น่าสนใจและโพสต์ลงทุก Platform",
  },
  {
    icon: BarChart3,
    step: "03",
    title: "วิว = รายได้",
    desc: "คลิปไวรัล Clipper รับเงินต่อทุก 1,000 วิว (CPM) แบรนด์ได้ Exposure มหาศาลในราคาคุ้มค่า",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            วิธีการ<span className="text-[#c8f135]">ทำงาน</span>
          </h2>
          <p className="text-[#8a8a8a] text-lg max-w-xl mx-auto">
            3 ขั้นตอนง่าย ๆ สู่ยอดวิวหลักล้าน
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative bg-[#141414] border-2 border-[#2a2a2a] rounded-2xl p-8 hover:border-[#c8f135]/40 transition-all group"
            >
              <div className="text-6xl font-black text-[#1a1a1a] group-hover:text-[#c8f135]/10 absolute top-4 right-6 transition-colors">
                {item.step}
              </div>
              <div className="w-12 h-12 bg-[#c8f135]/10 rounded-xl flex items-center justify-center mb-6">
                <item.icon className="w-6 h-6 text-[#c8f135]" />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-[#8a8a8a] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
