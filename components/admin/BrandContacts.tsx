"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Loader2, Mail, User, Wallet, FileText, Calendar } from "lucide-react";
import api from "@/app/utils/api";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface BrandContact {
  id: string;
  full_name: string;
  email: string;
  budget: number;
  campaign_type: string;
  note: string;
  created_at: string;
}

interface BrandContactsResponse {
  items: BrandContact[];
  limit: number;
  offset: number;
  total: number;
}

export default function BrandContacts() {
  const { data, isLoading, error } = useQuery<BrandContactsResponse>({
    queryKey: ["admin-brand-contacts"],
    queryFn: async () => {
      return await api({ url: "/v1/admin/brands/contacts" });
    },
  });

  const columns = useMemo<ColumnDef<BrandContact>[]>(
    () => [
      {
        accessorKey: "full_name",
        header: () => (
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5" />
            <span>ชื่อ-นามสกุล</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="font-bold text-slate-900">
            {row.getValue("full_name")}
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: () => (
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" />
            <span>อีเมล</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-slate-500 font-medium">
            {row.getValue("email")}
          </div>
        ),
      },
      {
        accessorKey: "budget",
        header: () => (
          <div className="flex items-center gap-2">
            <Wallet className="w-3.5 h-3.5" />
            <span>งบประมาณ</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="font-black text-brand-purple">
            ฿{(row.getValue("budget") as number).toLocaleString()}
          </div>
        ),
      },
      {
        accessorKey: "campaign_type",
        header: () => (
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            <span>ประเภท</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="capitalize bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-black inline-block">
            {row.getValue("campaign_type")}
          </div>
        ),
      },
      {
        accessorKey: "note",
        header: "หมายเหตุ",
        cell: ({ row }) => (
          <div className="max-w-[200px] truncate text-slate-400 text-xs italic">
            {row.getValue("note") || "-"}
          </div>
        ),
      },
      {
        accessorKey: "created_at",
        header: () => (
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>วันที่ติดต่อ</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-slate-400 text-xs font-bold">
            {format(new Date(row.getValue("created_at")), "d MMM yyyy HH:mm", {
              locale: th,
            })}
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: data?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
        <p className="text-slate-400 font-bold text-sm">
          กำลังโหลดข้อมูลการติดต่อ...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500 font-bold">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-slate-100"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-8 py-6 h-auto"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="divide-y divide-slate-50">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group hover:bg-slate-50/50 transition-all border-slate-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-8 py-6">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-48 text-center text-slate-400 font-bold"
                >
                  ไม่มีข้อมูลการติดต่อ
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
