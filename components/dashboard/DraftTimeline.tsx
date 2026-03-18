"use client";

import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Submission } from "@/type/submission";

export const TIMELINE_STEPS = [
  { key: "uploaded", label: "อัปโหลดแล้ว" },
  { key: "pending_review", label: "รอรีวิว" },
  { key: "reviewed", label: "ผลรีวิว" },
  { key: "posted", label: "Submit ลิงก์" },
];

interface DraftTimelineProps {
  draft: Submission;
}

export function DraftTimeline({ draft }: DraftTimelineProps) {
  const isReturned = draft.status === "returned" || draft.status === "rejected";
  const isApproved = draft.status === "approved" || draft.status === "active";
  const isPending =
    draft.status === "pending_review" || draft.status === "pending";

  let activeStep = 0;
  if (isPending) activeStep = 1;
  else if (isApproved || isReturned) activeStep = 2;

  if (isApproved && draft.social_link) activeStep = 3;

  return (
    <div className="flex items-center gap-1 mt-4">
      {TIMELINE_STEPS.map((step, i) => {
        const isDone = i < activeStep;
        const isCurrent = i === activeStep;
        const isReturnedStep = i === 2 && isReturned;

        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-[1.5px] transition-all shadow-sm"
                style={
                  isReturnedStep
                    ? {
                        background: "rgba(236, 72, 153, 0.1)",
                        borderColor: "#ec4899",
                        color: "#ec4899",
                      }
                    : isDone || isCurrent
                      ? {
                          background: "white",
                          borderColor: "transparent",
                          color: "#8B5CF6",
                        }
                      : {
                          background: "rgba(0,0,0,0.03)",
                          borderColor: "rgba(0,0,0,0.05)",
                          color: "rgba(0,0,0,0.3)",
                        }
                }
              >
                {isReturnedStep ? (
                  <XCircle className="w-3 h-3" />
                ) : isDone || isCurrent ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span
                className="text-xs mt-1.5 whitespace-nowrap font-bold tracking-tight"
                style={{
                  color: isReturnedStep
                    ? "#ec4899"
                    : isDone || isCurrent
                      ? "#1e293b"
                      : "rgba(0,0,0,0.3)",
                }}
              >
                {step.label}
              </span>
            </div>
            {i < TIMELINE_STEPS.length - 1 && (
              <div
                className="flex-1 h-[2px] mb-4 rounded-full mx-1"
                style={{
                  background: i < activeStep ? "#1e293b" : "rgba(0,0,0,0.05)",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
