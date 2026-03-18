"use client";

import React, { useState, useEffect } from "react";
import {
  Loader2,
  CreditCard,
  ShieldCheck,
  ChevronLeft,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/app/utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";

interface Campaign {
  id: string;
  title: string;
  budget: number;
  status: string;
}

declare global {
  interface Window {
    OmiseCard: any;
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    data: campaign,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["campaign-payment", campaignId],
    queryFn: async () => {
      const data = await api({ url: "/v1/campaigns/" + campaignId });
      return data;
    },
    enabled: !!campaignId,
  });

  const handlePayment = async () => {
    if (!window.OmiseCard) {
      setError("Omise.js not loaded. Please refresh.");
      return;
    }

    if (!campaign) return;

    setLoading(true);
    setError(null);

    // Initialize OmiseCard with public key
    window.OmiseCard.configure({
      publicKey: process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY,
    });

    window.OmiseCard.open({
      amount: campaign.budget * 100,
      currency: "THB",
      defaultPaymentMethod: "credit_card",
      onCreateTokenSuccess: async (nonce: string) => {
        try {
          await api({
            url: "/v1/payments/campaigns/" + campaign.id,
            method: "POST",
            body: { omise_token: nonce },
          });
          router.push("/brand/campaigns?success=true");
        } catch (err: any) {
          setError(err.message || "การชำระเงินไม่สำเร็จ");
        } finally {
          setLoading(false);
        }
      },
      onFormClosed: () => {
        setLoading(false);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-slate-200 animate-spin" />
        <p className="text-slate-400 font-bold text-sm">
          กำลังโหลดข้อมูลการชำระเงิน...
        </p>
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500/20 mb-2" />
        <p className="text-slate-500 font-black">
          ไม่พบข้อมูลแคมเปญ หรือ แคมเปญนี้ได้ชำระเงินแล้ว
        </p>
        <button
          onClick={() => router.push("/brand/campaigns")}
          className="text-slate-900 font-black text-sm underline underline-offset-4"
        >
          กลับไปยังหน้าแคมเปญ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-6">
      <button
        onClick={() => router.push("/brand/campaigns")}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-sm mb-10 transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        ย้อนกลับ
      </button>

      <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-10 text-center">
          <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-8 border border-slate-100 shadow-inner">
            <CreditCard className="w-10 h-10 text-slate-900" />
          </div>

          <h1 className="text-3xl font-black text-slate-900 mb-2 leading-tight">
            ชำระค่าแคมเปญ
          </h1>
          <p className="text-slate-500 font-bold text-sm mb-10 px-6 leading-relaxed">
            แคมเปญ: <span className="text-slate-900">"{campaign.title}"</span>
            <br />
            กรุณาชำระเงินเพื่อดำเนินการในขั้นตอนถัดไป
          </p>

          <div className="bg-slate-50 rounded-[32px] p-8 mb-10 border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Clock className="w-12 h-12" />
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                  สรุปยอดชำระ
                </span>
                <span className="text-xs font-black text-slate-900">
                  THB
                </span>
              </div>
              <div className="text-5xl font-black text-slate-900 tracking-tighter">
                ฿{campaign.budget.toLocaleString()}
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-black flex items-center gap-3 border border-red-100"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full h-16 rounded-[24px] bg-slate-900 text-white font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 active:scale-95 disabled:opacity-50 transition-all hover:bg-slate-800"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-brand-cyan" />
              )}
              {loading ? "กำลังดำเนินการ..." : "ชำระเงินด้วย Omise"}
            </button>
            <button
              onClick={() => router.push("/brand/campaigns")}
              disabled={loading}
              className="w-full h-14 rounded-[24px] border border-slate-100 text-slate-400 font-bold text-sm hover:text-slate-600 hover:bg-slate-50 transition-all"
            >
              ไว้ทำรายการภายหลัง
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-center gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all">
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">
              Secured by
            </div>
            <img
              src="https://www.omise.co/assets/logo-300x120.png"
              alt="Omise"
              className="h-4"
            />
          </div>

          <p className="mt-8 text-xs text-slate-400 font-medium px-10 leading-relaxed uppercase tracking-widest font-black">
            SSL encrypted • No card data stored
          </p>
        </div>
      </div>
    </div>
  );
}
