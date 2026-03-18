"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Loader2, Phone } from "lucide-react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";

export default function BookCallForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    budget: "",
    content_type: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="book-call" className="py-24 px-6 pb-32 sm:pb-24">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="w-24 h-24 rounded-full bg-[#c8f135]/20 border-2 border-[#c8f135]/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-[#c8f135]" />
            </div>
          </motion.div>
          <h3 className="text-3xl font-black mb-3">จองสำเร็จแล้ว!</h3>
          <p className="text-[#8a8a8a]">
            ส่งข้อมูลจองคอลแล้ว ทีมจะติดต่อกลับภายใน 24 ชั่วโมง
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="book-call" className="py-24 px-6 pb-32 sm:pb-24 relative">
        {/* Section glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8f135]/20 to-transparent" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left — copy */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-28"
            >
              <div className="inline-flex items-center gap-2 bg-[#c8f135]/10 border border-[#c8f135]/20 rounded-full px-4 py-2 mb-6">
                <Calendar className="w-4 h-4 text-[#c8f135]" />
                <span className="text-[#c8f135] text-sm font-semibold">
                  โทรปรึกษาฟรี 30 นาที
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95] mb-6">
                พร้อมที่จะ
                <br />
                <span className="text-[#c8f135]">ไวรัล?</span>
              </h2>

              <p className="text-[#8a8a8a] text-lg leading-relaxed mb-10">
                จองโทรฟรีกับทีมงานของเรา เราจะวิเคราะห์คอนเทนต์ ประมาณยอดวิว
                และสร้างกลยุทธ์ Campaign แบบเฉพาะตัว — ไม่มีข้อผูกมัด
              </p>

              <div className="space-y-4 mb-10">
                {[
                  "คำนวณอัตรา CPM ที่เหมาะกับ Niche ของคุณ",
                  "ประมาณการยอดวิวและรายได้",
                  "แผนกลยุทธ์ Campaign ครบถ้วน",
                  "ไม่มีสัญญาผูกมัด เริ่มได้ใน 48 ชั่วโมง",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#c8f135]/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-[#c8f135]" />
                    </div>
                    <span className="text-[#aaa] text-sm">{item}</span>
                  </div>
                ))}
              </div>

              {/* Social proof strip */}
              <div className="bg-[#141414] border-2 border-[#2a2a2a] rounded-2xl p-5 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["A", "B", "C", "D"].map((l, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-[#c8f135] flex items-center justify-center border-2 border-[#141414]"
                    >
                      <span className="text-xs font-black text-[#0a0a0a]">
                        {l}
                      </span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-bold">
                    50+ แบรนด์เปิดตัวเดือนนี้
                  </div>
                  <div className="text-xs text-[#8a8a8a]">
                    เฉลี่ย 4.2 ล้านวิวต่อ Campaign
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <form
                onSubmit={handleSubmit}
                className="bg-[#141414] border-2 border-[#2a2a2a] rounded-2xl p-8 space-y-5 hover:border-[#c8f135]/20 transition-colors"
              >
                <div className="mb-2">
                  <h3 className="text-xl font-black">จองโทรฟรีของคุณ</h3>
                  <p className="text-sm text-[#8a8a8a] mt-1">
                    ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-[#8a8a8a] mb-2 block uppercase tracking-wider">
                      ชื่อ-นามสกุล
                    </Label>
                    <Input
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-white h-12 focus:border-[#c8f135]/50 transition-colors"
                      placeholder="สมชาย ใจดี"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-[#8a8a8a] mb-2 block uppercase tracking-wider">
                      อีเมล
                    </Label>
                    <Input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-white h-12 focus:border-[#c8f135]/50 transition-colors"
                      placeholder="you@brand.com"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-[#8a8a8a] mb-2 block uppercase tracking-wider">
                    งบประมาณโดยประมาณ
                  </Label>
                  <Select
                    value={form.budget}
                    onValueChange={(v) => setForm({ ...form, budget: v })}
                  >
                    <SelectTrigger className="bg-[#0a0a0a] border-[#2a2a2a] text-white h-12">
                      <SelectValue placeholder="เลือกช่วงงบประมาณ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$500 - $2,000">
                        $500 – $2,000
                      </SelectItem>
                      <SelectItem value="$2,000 - $5,000">
                        $2,000 – $5,000
                      </SelectItem>
                      <SelectItem value="$5,000 - $15,000">
                        $5,000 – $15,000
                      </SelectItem>
                      <SelectItem value="$15,000+">$15,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-[#8a8a8a] mb-2 block uppercase tracking-wider">
                    ประเภทคอนเทนต์
                  </Label>
                  <Select
                    required
                    value={form.content_type}
                    onValueChange={(v) => setForm({ ...form, content_type: v })}
                  >
                    <SelectTrigger className="bg-[#0a0a0a] border-[#2a2a2a] text-white h-12">
                      <SelectValue placeholder="เลือกประเภทคอนเทนต์" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="music">เพลง</SelectItem>
                      <SelectItem value="game">เกม</SelectItem>
                      <SelectItem value="movie">หนัง / ซีรีส์</SelectItem>
                      <SelectItem value="podcast">Podcast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-[#8a8a8a] mb-2 block uppercase tracking-wider">
                    ข้อความเพิ่มเติม (ถ้ามี)
                  </Label>
                  <Textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="bg-[#0a0a0a] border-[#2a2a2a] text-white min-h-[80px] focus:border-[#c8f135]/50 transition-colors"
                    placeholder="บอกรายละเอียดเกี่ยวกับโปรเจกต์ของคุณ..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#c8f135] text-[#0a0a0a] hover:bg-[#d4f54a] font-black text-base h-14 rounded-xl border-2 border-[#c8f135] shadow-[0px_4px_20px_rgba(200,241,53,0.2)] hover:shadow-[0px_4px_30px_rgba(200,241,53,0.35)] transition-all"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Phone className="w-4 h-4 mr-2" /> จองโทรฟรีของฉัน
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-[#5a5a5a]">
                  ไม่มีข้อผูกมัด ไม่ต้องใช้บัตรเครดิต ได้ผลลัพธ์จริง
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-[#2a2a2a] px-4 py-3">
        <button
          onClick={() =>
            document
              .getElementById("book-call")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="w-full bg-[#c8f135] text-[#0a0a0a] font-black text-base h-14 rounded-xl flex items-center justify-center gap-2 shadow-[0px_4px_20px_rgba(200,241,53,0.3)]"
        >
          <Phone className="w-4 h-4" /> จองโทรฟรี
        </button>
      </div>
    </>
  );
}
