import React from "react";
import { motion } from "framer-motion";
import {
  Download,
  Upload,
  CheckCircle2,
  Share2,
  DollarSign,
} from "lucide-react";

const steps = [
  {
    icon: Download,
    title: "ดาวน์โหลดไฟล์ต้นฉบับ",
    desc: "Clipper รับไฟล์จากแคมเปญที่เลือก พร้อม Requirement ครบถ้วน",
  },
  {
    icon: Upload,
    title: "ส่ง Draft เข้ารีวิว",
    desc: "อัปโหลด Draft วิดีโอ แบรนด์ตรวจสอบและให้ Feedback ก่อนโพสต์จริง",
  },
  {
    icon: CheckCircle2,
    title: "แบรนด์อนุมัติ Draft",
    desc: "เมื่ออนุมัติแล้วค่อยโพสต์ลง TikTok / Instagram / YouTube ได้เลย",
  },
  {
    icon: Share2,
    title: "Submit ลิงก์โพสต์จริง",
    desc: "นำลิงก์โพสต์มากรอกในระบบ ระบบดึงยอดวิวอัตโนมัติทุก 24 ชั่วโมง",
  },
  {
    icon: DollarSign,
    title: "รับเงินอัตโนมัติ",
    desc: "คำนวณรายได้ตาม CPM โปร่งใส",
  },
];

const WindflowHowItWorks = () => {
  return (
    <section className="py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1d1d1f] tracking-tight">
            ขั้นตอนการทำงานที่โปร่งใส
          </h2>
          <p className="text-lg text-[#86868b] max-w-2xl mx-auto font-medium tracking-tight">
            เรามีระบบรีวิว Draft ก่อนโพสต์ เพื่อให้มั่นใจว่าทุกผลงานมีคุณภาพและตรงตามความต้องการ
          </p>
        </motion.div>

        <div className="relative">
          {/* Subtle connector line */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-slate-100" />
          
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-5 gap-12 relative z-10"
          >
            {steps.map((step, i) => (
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
                className="relative group text-center"
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="w-24 h-24 rounded-[28px] bg-slate-50 flex items-center justify-center mx-auto mb-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-100 transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(214,51,132,0.1)] group-hover:border-transparent group-hover:bg-white relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-(--gradient-brand) opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                  <step.icon className="w-10 h-10 text-[#1d1d1f] group-hover:text-brand-pink transition-colors duration-500" strokeWidth={1.5} />
                  
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center shadow-md bg-(--gradient-brand) border-2 border-white">
                    {i + 1}
                  </div>
                </motion.div>

                <h3 className="text-lg font-bold text-[#1d1d1f] mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-[#86868b] leading-relaxed font-medium">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WindflowHowItWorks;
