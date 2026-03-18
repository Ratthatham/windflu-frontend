"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  DollarSign,
  Eye,
  Search,
  ExternalLink,
  Film,
  Upload,
  Loader2,
  AlertCircle,
  Play,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import api from "@/app/utils/api";
import { useAuthStore } from "@/lib/store/auth-store";
import { useRouter } from "next/navigation";
import WindflowStatsBar from "@/components/dashboard/WindflowStatsBar";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Submission } from "@/type/submission";
import BrandContacts from "@/components/admin/BrandContacts";

interface Campaign {
  id: string;
  title: string;
  category: string;
  platform: string;
  budget: number;
  price_per_1000_views: number;
  target_views: number;
  total_views: number;
  status: string;
  remaining_budget?: number;
  total_budget?: number;
  type?: string;
}

interface Booking {
  id: string;
  name: string;
  email: string;
  budget: string;
  content_type: string;
  message?: string;
  status: string;
  created_at: string;
}

export default function AdminPanelPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("drafts");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(
    null,
  );
  const [newViews, setNewViews] = useState("");
  const [newLikes, setNewLikes] = useState("");
  const [newComments, setNewComments] = useState("");

  useEffect(() => {
    if (!isAuthLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/");
    }
  }, [user, isAuthenticated, isAuthLoading, router]);

  const { data: publishedSubmissions = [], isLoading: isLoadingPublished } =
    useQuery<Submission[]>({
      queryKey: ["admin-published-submissions"],
      queryFn: async () => {
        const res = await api({ url: "/v1/admin/submissions/published" });
        return res;
      },
      enabled:
        isAuthenticated &&
        user?.role === "admin" &&
        activeTab === "submissions",
    });

  const { data: campaigns = [], isLoading: isLoadingCampaigns } = useQuery<
    Campaign[]
  >({
    queryKey: ["admin-campaigns-list"],
    queryFn: async () => {
      const res = await api({ url: "/v1/admin/campaigns" });
      const items =
        res?.items ?? res?.campaigns ?? (Array.isArray(res) ? res : []);
      return items;
    },
    enabled: isAuthenticated && user?.role === "admin",
  });

  // const { data: bookings = [], isLoading: isLoadingBookings } = useQuery<
  //   Booking[]
  // >({
  //   queryKey: ["admin-bookings"],
  //   queryFn: async () => {
  //     try {
  //       const res = await api({ url: "/v1/bookings" }); // Assuming this exists or returns empty
  //       return Array.isArray(res) ? res : [];
  //     } catch (e) {
  //       return [];
  //     }
  //   },
  //   enabled: isAuthenticated && user?.role === "admin",
  // });

  const updateSubmissionMutation = useMutation({
    mutationFn: ({
      id,
      status,
      comment,
    }: {
      id: string;
      status: string;
      comment?: string;
    }) =>
      api({
        url: `/v1/admin/submissions/${id}/status`,
        method: "PATCH",
        body: { status, comment },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-published-submissions"],
      });
      // Also invalidate drafts query if we add it back, but for now we follow the user's lead
      toast.success("ดำเนินการสำเร็จ");
    },
  });

  const updateViewsMutation = useMutation({
    mutationFn: ({
      id,
      views,
      likes,
      comments,
    }: {
      id: string;
      views: number;
      likes: number;
      comments: number;
    }) =>
      api({
        url: "/v1/admin/views/update",
        method: "POST",
        body: {
          submission_id: id,
          views,
          likes,
          comments,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-published-submissions"],
      });
      toast.success("อัปเดตยอดวิวสำเร็จ");
      setEditingSubmission(null);
    },
  });

  if (isAuthLoading || isLoadingCampaigns) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
        <p className="text-slate-400 font-bold text-sm">
          กำลังเตรียมข้อมูลแผงควบคุม...
        </p>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  const stats = [
    // { icon: Upload, value: drafts.length, label: "Draft รอดูอยู่" },
    { icon: Film, value: publishedSubmissions.length, label: "คลิปทั้งหมด" },
    // { icon: Eye, value: totalViews.toLocaleString(), label: "ยอดวิวรวม" },
    // {
    //   icon: DollarSign,
    //   value: `฿${totalPaid.toLocaleString()}`,
    //   label: "จ่ายออกรวม",
    // },
  ];

  const filteredDrafts = publishedSubmissions.filter(
    (d) =>
      d.video_title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      d.status === "video_submitted",
  );

  const filteredSubmissions = publishedSubmissions.filter(
    (s) =>
      !searchQuery ||
      (s.video_title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.id || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-slate-100 shrink-0">
          <Shield className="w-8 h-8 text-brand-purple" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
            แผงแอดมิน
          </h1>
          <p className="text-slate-500 font-bold">
            ดูภาพรวมและจัดการข้อมูลทั้งหมดของ Windflu
          </p>
        </div>
      </div>

      <WindflowStatsBar stats={stats} />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-8"
      >
        <TabsList className="bg-white border border-slate-200 p-1 rounded-2xl h-14 shadow-sm inline-flex">
          <TabsTrigger
            value="drafts"
            className="px-8 rounded-xl font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            Review Drafts
          </TabsTrigger>
          <TabsTrigger
            value="submissions"
            className="px-8 rounded-xl font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            Submissions
          </TabsTrigger>
          <TabsTrigger
            value="campaigns"
            className="px-8 rounded-xl font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            Campaigns
          </TabsTrigger>
          <TabsTrigger
            value="contacts"
            className="px-8 rounded-xl font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
              Contacts
            </TabsTrigger>
          </TabsList>
  
          {activeTab !== "contacts" && (
            <div className="flex items-center justify-between gap-4">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาตามชื่อคลิป หรือ ID..."
                  className="pl-11 bg-white border-slate-200 text-slate-900 h-12 rounded-2xl font-bold"
                />
              </div>
            </div>
          )}
  
          <TabsContent value="drafts">
          <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-xl shadow-slate-900/5">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50">
                    {[
                      "คลิป / แคมเปญ",
                      "Platform",
                      "สถานะ",
                      "วิดีโอ",
                      "ดำเนินการ",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-8 py-6"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredDrafts.map((d) => (
                    <tr
                      key={d.id}
                      className="group hover:bg-slate-50/50 transition-all"
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-bold text-sm line-clamp-1">
                            {d.video_title || "Untitled"}
                          </span>
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                            ID: {d.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge
                          variant="outline"
                          className="text-xs font-black uppercase tracking-widest bg-slate-50 border-slate-100"
                        >
                          {d.video?.platform || "PLATFORM"}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <Badge className="bg-amber-50 text-amber-600 border-amber-100 text-xs font-black uppercase tracking-wider">
                          รออนุมัติ
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        {d.video?.video_url && (
                          <button
                            onClick={() =>
                              window.open(d.video?.video_url, "_blank")
                            }
                            className="text-brand-purple hover:underline text-xs font-bold flex items-center gap-1.5"
                          >
                            <Play className="w-3 h-3 fill-current" /> ดูเลย
                          </button>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            onClick={() =>
                              updateSubmissionMutation.mutate({
                                id: d.id,
                                status: "approved",
                                comment: "test",
                              })
                            }
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-lg h-8 px-3"
                          >
                            อนุมัติ
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const reason = prompt("เหตุผลที่ให้แก้ไข:");
                              if (reason)
                                updateSubmissionMutation.mutate({
                                  id: d.id,
                                  status: "revise",
                                  comment: reason,
                                });
                            }}
                            className="border-brand-purple/20 text-brand-purple hover:bg-brand-purple/5 text-xs font-black rounded-lg h-8 px-3"
                          >
                            แก้ไข
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              const reason = prompt("เหตุผลที่ต้องปฏิเสธ:");
                              if (reason)
                                updateSubmissionMutation.mutate({
                                  id: d.id,
                                  status: "reject",
                                  comment: reason,
                                });
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs font-black rounded-lg h-8 px-3"
                          >
                            ปฏิเสธ
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredDrafts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Upload className="w-10 h-10 text-slate-200" />
                          <p className="text-slate-400 font-bold text-sm">
                            ไม่มี Draft รอดำเนินการ
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="submissions">
          <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-xl shadow-slate-900/5">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50">
                    {[
                      "คลิป / ID",
                      "Platform",
                      "ยอดวิว",
                      "รายได้",
                      "สถานะ",
                      "ลิงก์",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-8 py-6"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredSubmissions.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => {
                        setEditingSubmission(s);
                        setNewViews(String(s.metrics?.views || 0));
                        setNewLikes(String(s.metrics?.likes || 0));
                        setNewComments(String(s.metrics?.comments || 0));
                      }}
                      className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-bold text-sm line-clamp-1">
                            {s.video_title || "Untitled"}
                          </span>
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                            ID: {s.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge
                          variant="outline"
                          className="text-xs font-black uppercase tracking-widest"
                        >
                          {s.video?.platform || "-"}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-black text-slate-900">
                          {(s.metrics?.views || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-black text-emerald-600">
                          ฿{(s.earnings || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <Badge
                          className={`${
                            s.status === "approved" || s.status === "active"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-pink-50 text-pink-500 border-pink-100"
                          } text-xs font-black uppercase tracking-wider`}
                        >
                          {s.status === "approved" || s.status === "active"
                            ? "สำเร็จ"
                            : "ถูกส่งคืน"}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        {s.social_link && (
                          <a
                            href={s.social_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-400 hover:text-slate-900 inline-block"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredSubmissions.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-8 py-20 text-center text-slate-400 font-bold"
                      >
                        ยังไม่มีข้อมูลผลงาน
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="campaigns">
          <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-xl shadow-slate-900/5">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50">
                    {["แคมเปญ", "ประเภท", "งบรวม", "งบเหลือ", "สถานะ"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-8 py-6"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {campaigns.map((c) => (
                    <tr
                      key={c.id}
                      className="group hover:bg-slate-50/50 transition-all"
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-bold text-sm line-clamp-1">
                            {c.title}
                          </span>
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                            {c.platform}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                          {c.category}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-black text-sm text-slate-900">
                        ฿{(c.total_budget || c.budget || 0).toLocaleString()}
                      </td>
                      <td className="px-8 py-6 font-black text-sm text-emerald-600">
                        ฿{(c.remaining_budget || 0).toLocaleString()}
                      </td>
                      <td className="px-8 py-6">
                        <Badge
                          className={`${
                            c.status === "active" || c.status === "open"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          } text-xs font-black uppercase tracking-wider`}
                        >
                          {c.status === "active" || c.status === "open"
                            ? "กำลังทำงาน"
                            : "ปิดแล้ว"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <BrandContacts />
        </TabsContent>

        {/* <TabsContent value="bookings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                >
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-pink-500 to-brand-purple opacity-20" />
                  <div className="flex justify-between items-start gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 mb-1">
                        {b.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                        {b.email}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs font-black uppercase tracking-wider bg-slate-50"
                    >
                      {b.status || "NEW"}
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-2xl p-4">
                        <span className="text-xs text-slate-400 font-black uppercase tracking-wider block mb-1">
                          งบประมาณ
                        </span>
                        <span className="text-sm font-black text-slate-900">
                          {b.budget}
                        </span>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-4">
                        <span className="text-xs text-slate-400 font-black uppercase tracking-wider block mb-1">
                          ประเภท
                        </span>
                        <span className="text-sm font-black text-slate-900 capitalize">
                          {b.content_type}
                        </span>
                      </div>
                    </div>
                    {b.message && (
                      <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 italic text-sm text-slate-600 leading-relaxed">
                        "{b.message}"
                      </div>
                    )}
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">
                      {new Date(b.created_at || Date.now()).toLocaleDateString(
                        "th-TH",
                      )}
                    </span>
                    <Button
                      variant="ghost"
                      className="text-brand-purple text-xs font-black uppercase tracking-widest h-8 px-4 hover:bg-brand-purple/5 rounded-xl"
                    >
                      ทำเครื่องหมายว่าติดต่อแล้ว
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-32 bg-white border border-dashed border-slate-200 rounded-[40px] text-center flex flex-col items-center gap-4">
                <AlertCircle className="w-12 h-12 text-slate-200" />
                <div>
                  <p className="text-slate-900 font-black text-lg">
                    ยังไม่มีรายการนัดคุย
                  </p>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
                    รายการจากหน้า Landing Page จะมาปรากฏที่นี่
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent> */}
      </Tabs>

      {/* Edit Views Modal */}
      <AnimatePresence>
        {editingSubmission && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setEditingSubmission(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 bg-white border border-slate-200 rounded-[40px] p-10 w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-brand-purple to-pink-500" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-brand-purple/5 flex items-center justify-center border border-brand-purple/10">
                  <Eye className="w-6 h-6 text-brand-purple" />
                </div>
                <div>
                  <h3 className="text-slate-900 text-xl font-black mb-1">
                    อัปเดตยอดวิว
                  </h3>
                  <p className="text-sm text-slate-500 font-bold">
                    {editingSubmission.video_title}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">
                      ยอดวิว
                    </label>
                    <Input
                      type="number"
                      value={newViews}
                      onChange={(e) => setNewViews(e.target.value)}
                      className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-black text-lg p-6 focus:ring-brand-purple/20"
                      placeholder="ใส่จำนวนวิว..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">
                        Likes
                      </label>
                      <Input
                        type="number"
                        value={newLikes}
                        onChange={(e) => setNewLikes(e.target.value)}
                        className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold text-sm px-4 focus:ring-brand-purple/20"
                        placeholder="จำนวน Like"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">
                        Comments
                      </label>
                      <Input
                        type="number"
                        value={newComments}
                        onChange={(e) => setNewComments(e.target.value)}
                        className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold text-sm px-4 focus:ring-brand-purple/20"
                        placeholder="จำนวน Comment"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    onClick={() => setEditingSubmission(null)}
                    className="flex-1 h-14 rounded-2xl font-black text-sm text-slate-400 hover:text-slate-600"
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    onClick={() =>
                      updateViewsMutation.mutate({
                        id: editingSubmission.id,
                        views: Number(newViews),
                        likes: Number(newLikes),
                        comments: Number(newComments),
                      })
                    }
                    disabled={updateViewsMutation.isPending}
                    className="flex-1 h-14 rounded-2xl font-black text-sm bg-slate-900 text-white shadow-xl shadow-slate-900/10 active:scale-95"
                  >
                    {updateViewsMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      "บันทึกข้อมูล"
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
