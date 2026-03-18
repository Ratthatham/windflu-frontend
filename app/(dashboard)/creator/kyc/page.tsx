"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Shield, Upload, CheckCircle2, XCircle, Clock, 
  AlertTriangle, Loader2, Image as ImageIcon, Calendar, RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import api from "@/app/utils/api";

interface KYCRequest {
  status: "pending" | "approved" | "rejected" | "revise";
  comment?: string;
  last_submitted_at?: string;
}

export default function ClipperKYCPage() {
  const queryClient = useQueryClient();
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null);

  const { data: kyc, isLoading } = useQuery<KYCRequest>({
    queryKey: ["creator-kyc"],
    queryFn: () => api({ url: "/v1/creators/kyc" }),
    retry: false,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "selfie" | "idcard") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "selfie") {
          setSelfieFile(file);
          setSelfiePreview(reader.result as string);
        } else {
          setIdCardFile(file);
          setIdCardPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const submitKYCMutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      if (selfieFile) fd.append("selfie_with_id_card", selfieFile);
      if (idCardFile) fd.append("id_card_image", idCardFile);
      return api({ 
        url: "/v1/creators/kyc", 
        method: "POST", 
        body: fd 
      });
    },
    onSuccess: () => {
      toast.success("ส่งคำขอ KYC สำเร็จ รอผลตรวจสอบนะ");
      setSelfieFile(null);
      setIdCardFile(null);
      setSelfiePreview(null);
      setIdCardPreview(null);
      queryClient.invalidateQueries({ queryKey: ["creator-kyc"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "ส่งคำขอไม่สำเร็จ ลองใหม่อีกครั้ง";
      toast.error(message);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
        <p className="text-slate-400 font-bold text-sm">กำลังโหลดข้อมูล KYC...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-10 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-slate-100 shrink-0">
          <Shield className="w-8 h-8 text-brand-purple" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
            ยืนยันตัวตน (KYC)
          </h1>
          <p className="text-slate-500 font-bold">
            ข้อมูลของคุณจะถูกเก็บเป็นความลับและรักษาความปลอดภัยสูงสุด
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {kyc && (
          <motion.div 
            key="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-[32px] p-8 mb-8 border-2 relative overflow-hidden shadow-2xl ${
              kyc.status === "approved" ? "bg-emerald-50 border-emerald-100" :
              kyc.status === "pending" ? "bg-amber-50 border-amber-100" :
              kyc.status === "revise" ? "bg-indigo-50 border-indigo-100" :
              "bg-pink-50 border-pink-100"
            }`}
          >
            <div className="absolute inset-x-0 top-0 h-2 bg-linear-to-r from-transparent via-white/50 to-transparent opacity-50" />
            
            <div className="flex items-start gap-6">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 shadow-lg ${
                kyc.status === "approved" ? "bg-emerald-500 text-white" :
                kyc.status === "pending" ? "bg-amber-500 text-white" :
                kyc.status === "revise" ? "bg-indigo-500 text-white" :
                "bg-pink-500 text-white"
              }`}>
                {kyc.status === "approved" && <CheckCircle2 className="w-8 h-8" />}
                {kyc.status === "pending" && <Clock className="w-8 h-8" />}
                {kyc.status === "revise" && <RotateCcw className="w-8 h-8" />}
                {kyc.status === "rejected" && <XCircle className="w-8 h-8" />}
              </div>
              
              <div className="flex-1">
                <h3 className={`text-2xl font-black mb-1 ${
                  kyc.status === "approved" ? "text-emerald-900" :
                  kyc.status === "pending" ? "text-amber-900" :
                  kyc.status === "revise" ? "text-indigo-900" :
                  "text-pink-900"
                }`}>
                  {kyc.status === "approved" ? "อนุมัติ" : 
                   kyc.status === "pending" ? "กำลังตรวจสอบเอกสาร" : 
                   kyc.status === "revise" ? "ให้ส่งใหม่ได้" : "โดนBan"}
                </h3>
                <p className={`font-bold mb-4 ${
                  kyc.status === "approved" ? "text-emerald-700/70" :
                  kyc.status === "pending" ? "text-amber-700/70" :
                  kyc.status === "revise" ? "text-indigo-700/70" :
                  "text-pink-700/70"
                }`}>
                  {kyc.status === "approved" ? "คุณสามารถรับงานและถอนเงินเข้าบัญชีได้ตามปกติ" : 
                   kyc.status === "pending" ? "ทีมงานกำลังตรวจสอบเอกสารของคุณภายใน 24 ชม." : 
                   kyc.status === "revise" ? "กรุณาแก้ไขเอกสารให้ถูกต้องและส่งใหม่อีกครั้ง" :
                   "บัญชีของคุณถูกระงับการยืนยันตัวตน กรุณาติดต่อเจ้าหน้าที่"}
                </p>

                {(kyc.status === "rejected" || kyc.status === "revise") && kyc.comment && (
                  <div className={`rounded-2xl p-6 border shadow-sm italic ${
                    kyc.status === "revise" ? "bg-indigo-50 border-indigo-200" : "bg-white/80 border-pink-200"
                  }`}>
                    <p className={`${kyc.status === "revise" ? "text-indigo-900" : "text-pink-900"} font-bold`}>
                      เหตุผล: {kyc.comment}
                    </p>
                  </div>
                )}
                
                <div className="mt-6 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    ปรับปรุงเมื่อ: {kyc.last_submitted_at ? new Date(kyc.last_submitted_at).toLocaleString('th-TH') : "-"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(!kyc || kyc.status === "revise") && (
        <div className="space-y-8">
          {/* Instructions */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Shield className="w-32 h-32" />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <h4 className="text-lg font-black tracking-tight">คำแนะนำในการอัพโหลดเพื่อให้ผ่านง่ายขึ้น</h4>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-bold text-slate-400">
              <li className="flex gap-3 items-center bg-white/5 p-4 rounded-2xl">
                <div className="w-2 h-2 rounded-full bg-brand-purple shrink-0" />
                ถ่ายคู่บัตรประชาชน (Selfie) เห็นใบหน้าชัดเจน
              </li>
              <li className="flex gap-3 items-center bg-white/5 p-4 rounded-2xl">
                <div className="w-2 h-2 rounded-full bg-brand-purple shrink-0" />
                ข้อมูลบนบัตรต้องมองเห็นได้ชัดเจน ไม่มัว
              </li>
              <li className="flex gap-3 items-center bg-white/5 p-4 rounded-2xl">
                <div className="w-2 h-2 rounded-full bg-brand-purple shrink-0" />
                ไม่มีแสงสะท้อนทับตัวอักษรสำคัญ
              </li>
              <li className="flex gap-3 items-center bg-white/5 p-4 rounded-2xl">
                <div className="w-2 h-2 rounded-full bg-brand-purple shrink-0" />
                ใช้รูปถ่ายจริง ไม่ครอปจากรูปอื่น
              </li>
            </ul>
          </motion.div>

          {/* Upload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Selfie Upload */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="group"
            >
              <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">1. รูปถ่ายคู่บัตรประชาชน *</Label>
              <div className="relative aspect-video rounded-[32px] overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 group-hover:border-brand-purple/50 transition-all cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => handleFileChange(e, "selfie")} 
                  className="absolute inset-0 opacity-0 z-10 cursor-pointer" 
                />
                
                {selfiePreview ? (
                  <img src={selfiePreview} alt="Selfie" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-brand-purple" />
                    </div>
                    <p className="text-sm font-black text-slate-400 text-center">คลิกอัพโหลดรูป Selfie</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* ID Card Upload */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group"
            >
              <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">2. รูปบัตรประชาชนด้านหน้า *</Label>
              <div className="relative aspect-video rounded-[32px] overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 group-hover:border-pink-500/50 transition-all cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => handleFileChange(e, "idcard")} 
                  className="absolute inset-0 opacity-0 z-10 cursor-pointer" 
                />
                
                {idCardPreview ? (
                  <img src={idCardPreview} alt="ID card" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-6 h-6 text-pink-500" />
                    </div>
                    <p className="text-sm font-black text-slate-400 text-center">คลิกอัพโหลดรูปหน้าบัตร</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center pt-8 pb-12"
          >
            <Button 
              onClick={() => submitKYCMutation.mutate()}
              disabled={submitKYCMutation.isPending || !selfieFile || !idCardFile}
              className="h-16 px-16 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-3xl shadow-2xl shadow-slate-900/30 transition-all active:scale-95 disabled:opacity-30"
            >
              {submitKYCMutation.isPending ? (
                <Loader2 className="w-6 h-6 animate-spin mr-3" />
              ) : (
                <Shield className="w-6 h-6 mr-3" />
              )}
              ส่งเอกสารเพื่อขออนุมัติ
            </Button>
            <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Shield className="w-3 h-3" />
              ข้อมูลของคุณได้รับการคุ้มครองตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA)
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
