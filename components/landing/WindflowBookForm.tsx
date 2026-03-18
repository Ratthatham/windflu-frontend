"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/Label";
import { Input } from "../ui/Input";
import api from "@/app/utils/api";
import { toast } from "sonner";

const budgetMap: Record<string, number> = {
  under_50k: 50000,
  "50k_200k": 200000,
  "200k_1m": 1000000,
  over_1m: 5000000,
};

const formSchema = z.object({
  full_name: z.string().min(2, "กรุณากรอกชื่อ-นามสกุล"),
  email: z.string().email("กรุณากรอกอีเมลที่ถูกต้อง"),
  budget: z.string().min(1, "กรุณาเลือกงบประมาณ"),
  campaign_type: z.string().min(1, "กรุณาเลือกประเภทคอนเทนต์"),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function WindflowBookForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      budget: "",
      campaign_type: "",
      note: "",
    },
  });

  const budgetValue = watch("budget");
  const contentTypeValue = watch("campaign_type");

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await api({
        url: "/v1/brands/contact",
        method: "POST",
        body: {
          full_name: values.full_name,
          email: values.email,
          budget: budgetMap[values.budget] || 0,
          campaign_type: values.campaign_type,
          note: values.note || "",
        },
      });
      setDone(true);
      toast.success("ส่งข้อมูลเรียบร้อยแล้ว");
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="book-call" className="py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-6 tracking-tight">
            เริ่มต้นแคมเปญของคุณวันนี้
          </h2>
          <p className="text-lg text-[#86868b] font-medium tracking-tight">
            ทีมงานผู้เชี่ยวชาญจะติดต่อกลับภายใน 24 ชั่วโมง เพื่อให้คำแนะนำที่เหมาะกับแบรนด์คุณที่สุด
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.04)]"
        >
          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-8"
              >
                <CheckCircle2 className="w-10 h-10 text-blue-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-[#1d1d1f] mb-4 tracking-tight">
                ส่งข้อมูลเรียบร้อยแล้ว
              </h3>
              <p className="text-[#86868b] font-medium">
                ทีมงานได้รับข้อมูลแล้ว และจะติดต่อกลับไปทางอีเมลโดยเร็วที่สุด
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label className="text-sm font-semibold text-[#1d1d1f] mb-2 block tracking-tight">
                    ชื่อ-นามสกุล
                  </Label>
                  <Input
                    {...register("full_name")}
                    className={`bg-[#f5f5f7] border-transparent text-[#1d1d1f] h-14 px-5 rounded-2xl focus:bg-white focus:border-blue-500 transition-all ${errors.full_name ? "border-red-500" : ""}`}
                    placeholder="กรอกชื่อของคุณ"
                  />
                  {errors.full_name && (
                    <p className="text-red-500 text-xs mt-2 font-medium">
                      {errors.full_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-semibold text-[#1d1d1f] mb-2 block tracking-tight">
                    อีเมลทำงาน
                  </Label>
                  <Input
                    type="email"
                    {...register("email")}
                    className={`bg-[#f5f5f7] border-transparent text-[#1d1d1f] h-14 px-5 rounded-2xl focus:bg-white focus:border-blue-500 transition-all ${errors.email ? "border-red-500" : ""}`}
                    placeholder="name@company.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-2 font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label className="text-sm font-semibold text-[#1d1d1f] mb-2 block tracking-tight">
                    งบประมาณโดยประมาณ
                  </Label>
                  <Select
                    value={budgetValue}
                    onValueChange={(v) =>
                      setValue("budget", v, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger
                      className={`bg-[#f5f5f7] border-transparent text-[#1d1d1f] h-14 px-5 rounded-2xl focus:bg-white focus:border-blue-500 transition-all ${errors.budget ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="เลือกช่วงงบประมาณ" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100">
                      <SelectItem value="under_50k">ต่ำกว่า 50,000 บาท</SelectItem>
                      <SelectItem value="50k_200k">50,000 – 200,000 บาท</SelectItem>
                      <SelectItem value="200k_1m">200,000 – 1,000,000 บาท</SelectItem>
                      <SelectItem value="over_1m">มากกว่า 1,000,000 บาท</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.budget && (
                    <p className="text-red-500 text-xs mt-2 font-medium">
                      {errors.budget.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-semibold text-[#1d1d1f] mb-2 block tracking-tight">
                    ประเภทของแคมเปญ
                  </Label>
                  <Select
                    value={contentTypeValue}
                    onValueChange={(v) =>
                      setValue("campaign_type", v, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger
                      className={`bg-[#f5f5f7] border-transparent text-[#1d1d1f] h-14 px-5 rounded-2xl focus:bg-white focus:border-blue-500 transition-all ${errors.campaign_type ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="เลือกประเภท" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100">
                      <SelectItem value="music">มิวสิควิดีโอ / เพลง</SelectItem>
                      <SelectItem value="game">เกม / แอปพลิเคชัน</SelectItem>
                      <SelectItem value="movie">ภาพยนตร์ / ซีรีส์</SelectItem>
                      <SelectItem value="podcast">พอดแคสต์ / รายการ</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.campaign_type && (
                    <p className="text-red-500 text-xs mt-2 font-medium">
                      {errors.campaign_type.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-[#1d1d1f] mb-2 block tracking-tight">
                  รายละเอียดเพิ่มเติม (ถ้ามี)
                </Label>
                <Textarea
                  {...register("note")}
                  className="bg-[#f5f5f7] border-transparent text-[#1d1d1f] min-h-[120px] px-5 py-4 rounded-2xl focus:bg-white focus:border-blue-500 transition-all placeholder:text-[#86868b]"
                  placeholder="บอกเราเพิ่มเติมเกี่ยวกับเป้าหมายของคุณ..."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-cta w-full h-14 text-lg bg-[#1d1d1f] hover:bg-black transition-all"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    "ส่งข้อมูลเพื่อเริ่มงาน"
                  )}
                </button>
                <p className="text-center text-xs text-[#86868b] mt-6 font-medium">
                  การกดส่งข้อมูลแสดงว่าคุณยอมรับข้อปฏิบัติเกี่ยวกับความเป็นส่วนตัวของเรา
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
