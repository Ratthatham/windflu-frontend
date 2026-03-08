"use client";
import React, { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../ui/Input";

export default function WindflowBookForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    budget: "",
    content_type: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    setLoading(false);
    setDone(true);
  };

  return (
    <section id="book-call" className="py-20 px-6 bg-[#fafafa]">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-[#1a1230] mb-4">
            นัดคุยฟรี
            <br />
            สำหรับแบรนด์
          </h2>
          <p className="text-[#6b5f8a] mb-8">
            ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง
            เพื่อออกแบบแคมเปญที่เหมาะกับแบรนด์ของคุณ
          </p>
          <div className="space-y-4">
            {[
              "จ่ายตามผลจริง ไม่เสียเปล่า",
              "ระบบรีวิว Draft ก่อนโพสต์ทุกชิ้น",
              "รายงาน Real-time โปร่งใส 100%",
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: "#8B5CF6" }}
                />
                <span className="text-[#1a1230] text-sm">{b}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="bg-white border border-[#ede8f5] rounded-2xl p-6 relative overflow-hidden"
          style={{ boxShadow: "0 4px 24px rgba(139,92,246,0.08)" }}
        >
          <div
            className="absolute inset-x-0 top-0 h-1"
            style={{ background: "linear-gradient(135deg,#FF6B9D,#8B5CF6)" }}
          />
          {done ? (
            <div className="text-center py-8">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
                }}
              >
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-[#1a1230] mb-2">
                ได้รับแล้ว
              </h3>
              <p className="text-[#6b5f8a] text-sm">
                รับแล้ว ทีมจะติดต่อกลับเร็ว ๆ นี้
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-sm text-[#6b5f8a] mb-1.5 block">
                  ชื่อ-นามสกุล
                </Label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-[#fafafa] border-[#ede8f5] text-[#1a1230] h-11 rounded-xl focus:border-[#8B5CF6]"
                  placeholder="ชื่อของคุณ"
                />
              </div>
              <div>
                <Label className="text-sm text-[#6b5f8a] mb-1.5 block">
                  อีเมล
                </Label>
                <Input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-[#fafafa] border-[#ede8f5] text-[#1a1230] h-11 rounded-xl focus:border-[#8B5CF6]"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <Label className="text-sm text-[#6b5f8a] mb-1.5 block">
                  งบประมาณโดยประมาณ
                </Label>
                <Select
                  value={form.budget}
                  onValueChange={(v) => setForm({ ...form, budget: v })}
                >
                  <SelectTrigger className="bg-[#fafafa] border-[#ede8f5] text-[#1a1230] h-11 rounded-xl">
                    <SelectValue placeholder="เลือกช่วงงบ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_50k">
                      ต่ำกว่า 50,000 บาท
                    </SelectItem>
                    <SelectItem value="50k_200k">
                      50,000 – 200,000 บาท
                    </SelectItem>
                    <SelectItem value="200k_1m">
                      200,000 – 1,000,000 บาท
                    </SelectItem>
                    <SelectItem value="over_1m">
                      มากกว่า 1,000,000 บาท
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-[#6b5f8a] mb-1.5 block">
                  ประเภทคอนเทนต์
                </Label>
                <Select
                  value={form.content_type}
                  onValueChange={(v) => setForm({ ...form, content_type: v })}
                >
                  <SelectTrigger className="bg-[#fafafa] border-[#ede8f5] text-[#1a1230] h-11 rounded-xl">
                    <SelectValue placeholder="เลือกประเภท" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="music">เพลง</SelectItem>
                    <SelectItem value="game">เกม</SelectItem>
                    <SelectItem value="movie">หนัง</SelectItem>
                    <SelectItem value="podcast">Podcast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-[#6b5f8a] mb-1.5 block">
                  หมายเหตุเพิ่มเติม (ไม่บังคับ)
                </Label>
                <Textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="bg-[#fafafa] border-[#ede8f5] text-[#1a1230] min-h-[80px] rounded-xl"
                  placeholder="อธิบายแคมเปญของคุณ..."
                />
              </div>
              <button
                type="submit"
                disabled={loading || !form.content_type}
                className="btn-cta w-full"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin inline" />
                ) : (
                  "นัดคุยฟรี"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
