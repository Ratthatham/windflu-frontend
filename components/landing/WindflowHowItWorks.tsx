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
    <section className="px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-white">
            ขั้นตอนการทำงาน
          </h2>
          <p className="text-white/80">
            ระบบรีวิว Draft ก่อนโพสต์ ป้องกันปัญหา ทุกคลิปผ่านการตรวจสอบ
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-4 relative">
                  <step.icon className="w-7 h-7" style={{ color: "white" }} />
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center border-2 border-white/20"
                    style={{
                      background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
                    }}
                  >
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WindflowHowItWorks;
