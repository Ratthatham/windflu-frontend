import { z } from "zod";

export const reviewSchema = z
  .object({
    status: z.enum(["approved", "rejected", "revise"]),
    comment: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        (data.status === "rejected" || data.status === "revise") &&
        (!data.comment || data.comment.trim() === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "กรุณาระบุเหตุผลสำหรับการดำเนินการนี้",
      path: ["comment"],
    },
  );

export type ReviewFormValues = z.infer<typeof reviewSchema>;
