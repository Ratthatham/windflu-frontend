"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Mail,
  Wallet,
  Calendar,
  Camera,
  Save,
  Loader2,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useAuthStore } from "@/lib/store/auth-store";
import api from "@/app/utils/api";
import Link from "next/link";
import { BANK_NAME_OPTIONS, PAYMENT_METHOD_OPTIONS } from "@/constants/profile";
import { ImageCropper } from "@/components/ui/ImageCropper";

interface CreatorProfile {
  id: string;
  display_name?: string;
  bio?: string;
  profile_image_url?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_name?: string;
  location?: string;
  payment_method?: string;
  promptpay_number?: string;
  shipping_address?: string;
  created_at: string;
}

interface CreatorWallet {
  balance: number;
}

interface KYCRequest {
  status: "pending" | "approved" | "rejected";
  comment?: string;
  last_submitted_at?: string;
}

export default function ClipperProfilePage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    bank_name: "",
    bank_account_number: "",
    bank_account_name: "",
    location: "",
    payment_method: "internet_banking",
    promptpay_number: "",
    shipping_address: "",
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const { data: profile, isLoading: profileLoading } = useQuery<CreatorProfile>(
    {
      queryKey: ["creator-profile"],
      queryFn: () => api({ url: "/v1/creators/profile" }),
    },
  );

  const { data: wallet, isLoading: walletLoading } = useQuery<CreatorWallet>({
    queryKey: ["creator-wallet"],
    queryFn: () => api({ url: "/v1/creators/wallet" }),
  });

  const { data: kyc, isLoading: kycLoading } = useQuery<KYCRequest>({
    queryKey: ["creator-kyc"],
    queryFn: () => api({ url: "/v1/creators/kyc" }),
    retry: false, // Don't retry if 404
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        bank_name: profile.bank_name || "",
        bank_account_number: profile.bank_account_number || "",
        bank_account_name: profile.bank_account_name || "",
        location: profile.location || "",
        payment_method: profile.payment_method || "internet_banking",
        promptpay_number: profile.promptpay_number || "",
        shipping_address: profile.shipping_address || "",
      });
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: typeof formData) =>
      api({
        url: "/v1/creators/profile",
        method: "PATCH",
        body: data,
      }),
    onSuccess: () => {
      toast.success("บันทึกโปรไฟล์สำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
    },
    onError: () => {
      toast.error("บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง");
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append("image", file);
      return api({
        url: "/v1/creators/profile/image",
        method: "POST",
        body: fd,
      });
    },
    onSuccess: () => {
      toast.success("อัพโหลดรูปโปรไฟล์สำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
    },
    onError: () => {
      toast.error("อัพโหลดรูปไม่สำเร็จ ลองใหม่อีกครั้ง");
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const file = new File([croppedBlob], "profile-image.jpg", {
      type: "image/jpeg",
    });
    uploadImageMutation.mutate(file);
    setSelectedImage(null);
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(formData);
  };

  if (profileLoading || walletLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
        <p className="text-slate-400 font-bold text-sm">
          กำลังโหลดข้อมูลโปรไฟล์...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 md:mb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-slate-100 shrink-0">
            <User className="w-6 h-6 md:w-8 md:h-8 text-brand-purple" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1 md:mb-2">
              โปรไฟล์ของฉัน
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-bold">
              จัดการข้อมูลส่วนตัวและการรับเงินของคุณ
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Profile Card & Wallet */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-100 rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-sm text-center relative overflow-hidden group"
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-brand-purple to-pink-500 opacity-20" />

            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full rounded-[40px] overflow-hidden border-4 border-slate-50 shadow-inner group-hover:border-brand-purple/10 transition-colors">
                {(profile?.profile_image_url || user?.avatarUrl) ? (
                  <img
                    src={profile?.profile_image_url || user?.avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                    <User className="w-16 h-16 text-slate-200" />
                  </div>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center cursor-pointer hover:bg-brand-purple hover:scale-110 transition-all shadow-lg active:scale-95">
                {uploadImageMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={uploadImageMutation.isPending}
                />
              </label>
            </div>

            <h2 className="text-xl font-black text-slate-900 mb-1">
              {profile?.display_name || user?.displayName || "Clipper"}
            </h2>
            <p className="text-sm text-slate-400 font-bold mb-6">
              @
              {user?.displayName?.toLowerCase().replace(/\s+/g, "") ||
                "clipper"}
            </p>

            <div className="flex flex-col gap-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  ยอดเงินคงเหลือ
                </p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    ฿{wallet?.balance?.toLocaleString() || "0"}
                  </span>
                  <Wallet className="w-4 h-4 text-brand-purple/30 mb-1.5" />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  สถานะ KYC
                </p>
                <div className="flex items-center gap-2">
                  {kyc?.status === "approved" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                  {kyc?.status === "pending" && (
                    <Clock className="w-4 h-4 text-amber-500" />
                  )}
                  {kyc?.status === "rejected" && (
                    <XCircle className="w-4 h-4 text-pink-500" />
                  )}
                  {!kyc && <Shield className="w-4 h-4 text-slate-300" />}
                  <span
                    className={`text-sm font-black ${
                      kyc?.status === "approved"
                        ? "text-emerald-600"
                        : kyc?.status === "pending"
                          ? "text-amber-600"
                          : kyc?.status === "rejected"
                            ? "text-pink-600"
                            : "text-slate-400"
                    }`}
                  >
                    {kyc?.status === "approved"
                      ? "ยืนยันแล้ว"
                      : kyc?.status === "pending"
                        ? "รอตรวจสอบ"
                        : kyc?.status === "rejected"
                          ? "ถูกปฏิเสธ"
                          : "ยังไม่สำเร็จ"}
                  </span>
                </div>
                {!kyc && (
                  <Link
                    href="/creator/kyc"
                    className="text-xs font-black text-brand-purple hover:underline mt-2 inline-block uppercase tracking-wider"
                  >
                    จัดการยืนยันตัวตน →
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* Personal Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-slate-100 rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-sm relative overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-brand-purple to-pink-500 opacity-20" />
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center">
                <User className="w-5 h-5 text-brand-purple" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                ข้อมูลส่วนตัว
              </h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    ชื่อที่แสดง
                  </Label>
                  <Input
                    value={formData.display_name}
                    onChange={(e) =>
                      setFormData({ ...formData, display_name: e.target.value })
                    }
                    className="h-14 rounded-2xl border-slate-200 focus:ring-brand-purple/20 font-bold"
                    placeholder="ใส่ชื่อ Clipper ของคุณ"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    อีเมลผู้ใช้งาน
                  </Label>
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="h-14 rounded-2xl bg-slate-50 border-slate-100 text-slate-400 font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  เกี่ยวกับฉัน
                </Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="rounded-2xl border-slate-200 focus:ring-brand-purple/20 font-bold min-h-[120px] p-4"
                  placeholder="เขียนแนะนำตัวเองสักนิดให้แบรนด์รู้จัก..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  ที่อยู่สำหรับการจัดส่ง
                </Label>
                <Textarea
                  value={formData.shipping_address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shipping_address: e.target.value,
                    })
                  }
                  className="rounded-2xl border-slate-200 focus:ring-brand-purple/20 font-bold min-h-[100px] p-4"
                  placeholder="กรอกที่อยู่เพื่อให้แบรนด์ส่งสินค้าไปให้..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  สถานที่ติดต่อ (จังหวัด/เขต)
                </Label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="h-14 rounded-2xl border-slate-200 focus:ring-brand-purple/20 font-bold"
                  placeholder="เช่น กรุงเทพมหานคร, เชียงใหม่"
                />
              </div>
            </div>
          </motion.div>

          {/* Bank Account */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-slate-100 rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-sm relative overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-emerald-500 to-teal-500 opacity-20" />
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                ช่องทางการรับเงิน
              </h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  วิธีการรับเงินที่ต้องการ
                </Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) =>
                    setFormData({ ...formData, payment_method: value })
                  }
                >
                  <SelectTrigger className="h-14 rounded-2xl border-slate-200 focus:ring-emerald-500/20 font-bold bg-white">
                    <SelectValue placeholder="เลือกวิธีการรับเงิน" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 bg-white">
                    {PAYMENT_METHOD_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="font-bold py-3"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <AnimatePresence mode="wait">
                {formData.payment_method === "internet_banking" ? (
                  <motion.div
                    key="bank"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        ธนาคาร
                      </Label>
                      <Select
                        value={formData.bank_name}
                        onValueChange={(value) =>
                          setFormData({ ...formData, bank_name: value })
                        }
                      >
                        <SelectTrigger className="h-14 rounded-2xl border-slate-200 focus:ring-emerald-500/20 font-bold bg-white">
                          <SelectValue placeholder="เลือกธนาคาร" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100 bg-white">
                          {BANK_NAME_OPTIONS.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="font-bold py-3"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                          เลขบัญชีธนาคาร
                        </Label>
                        <Input
                          value={formData.bank_account_number}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              bank_account_number: e.target.value,
                            })
                          }
                          className="h-14 rounded-2xl border-slate-200 focus:ring-emerald-500/20 font-bold"
                          placeholder="000-0-00000-0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                          ชื่อบัญชี
                        </Label>
                        <Input
                          value={formData.bank_account_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              bank_account_name: e.target.value,
                            })
                          }
                          className="h-14 rounded-2xl border-slate-200 focus:ring-emerald-500/20 font-bold"
                          placeholder="ชื่อ-นามสกุล"
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="promptpay"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                      เบอร์ PromptPay หรือ เลขบัตรประชาขน
                    </Label>
                    <Input
                      value={formData.promptpay_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          promptpay_number: e.target.value,
                        })
                      }
                      className="h-14 rounded-2xl border-slate-200 focus:ring-emerald-500/20 font-bold"
                      placeholder="08X-XXX-XXXX หรือ X-XXXX-XXXXX-XX-X"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="flex justify-end gap-4 pb-8 md:pb-12">
            <Button
              onClick={handleSaveProfile}
              disabled={updateProfileMutation.isPending}
              className="w-full md:w-auto h-14 md:h-16 px-8 md:px-12 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-xl shadow-slate-900/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {updateProfileMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              บันทึกข้อมูลทั้งหมด
            </Button>
          </div>
        </div>
      </div>

      <ImageCropper
        image={selectedImage}
        open={isCropperOpen}
        onClose={() => {
          setIsCropperOpen(false);
          setSelectedImage(null);
        }}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
