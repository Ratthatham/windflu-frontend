import { z } from "zod";

const baseSchema = z.object({
  first_name: z.string().min(1, "กรุณากรอกชื่อจริง"),
  last_name: z.string().min(1, "กรุณากรอกนามสกุล"),
  display_name: z.string().min(1, "กรุณากรอกชื่อที่ใช้แสดง"),
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
  confirmPassword: z.string().min(6, "กรุณายืนยันรหัสผ่าน"),
  accept_terms: z.boolean().refine((val) => val === true, {
    message: "กรุณายอมรับเงื่อนไขการใช้งาน",
  }),
  phone: z.string().min(1, "กรุณากรอกเบอร์โทรศัพท์"),
  payment_method: z.string(),
  payment_account: z.string(),
  tiktok_username: z.string(),
  instagram_username: z.string(),
  youtube_channel: z.string(),
  primary_platform: z.string(),
  followers_count: z.number(),
  avg_views: z.number(),
  content_category: z.array(z.string()),
  country: z.string().min(1, "กรุณาเลือกประเทศ"),
});

export type RegisterForm = z.infer<typeof baseSchema>;

export const registerSchema = baseSchema
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  })
  .refine(
    (data) =>
      data.tiktok_username || data.instagram_username || data.youtube_channel,
    {
      message: "เชื่อมอย่างน้อย 1 บัญชี เพื่อเริ่มรับงาน",
      path: ["tiktok_username"],
    },
  );
