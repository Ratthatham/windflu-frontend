"use client";

import React from "react";
import { Users, ShieldCheck, Settings, Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto ">
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tight mb-2 text-slate-900">
          ผู้ดูแลระบบ (Admin)
        </h1>
        <p className="text-slate-500 text-base font-bold">
          จัดการผู้ใช้งานและระบบหลังบ้าน Windflu
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">
            จัดการผู้ใช้
          </h3>
          <p className="text-sm text-slate-500 font-bold mb-6">
            ตรวจสอบและจัดการรายชื่อ Creator และ Brand ในระบบ
          </p>
          <button className="w-full bg-slate-900 text-white h-11 rounded-1.5xl font-black text-xs hover:bg-slate-800 transition-all">
            ดูรายชื่อทั้งหมด
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">
            อนุมัติแคมเปญ
          </h3>
          <p className="text-sm text-slate-500 font-bold mb-6">
            ตรวจสอบความถูกต้องของแคมเปญใหม่ก่อนเปิดให้รับงาน
          </p>
          <button className="w-full bg-slate-900 text-white h-11 rounded-1.5xl font-black text-xs hover:bg-slate-800 transition-all">
            ตรวจสอบแคมเปญ
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
          <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-6">
            <Settings className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">
            ตั้งค่าระบบ
          </h3>
          <p className="text-sm text-slate-500 font-bold mb-6">
            ปรับแต่งค่าพารามิเตอร์และการตั้งค่าความปลอดภัยของระบบ
          </p>
          <button className="w-full bg-slate-100 text-slate-900 h-11 rounded-1.5xl font-black text-xs hover:bg-slate-200 transition-all">
            แก้ไขการตั้งค่า
          </button>
        </div>
      </div>
    </div>
  );
}
