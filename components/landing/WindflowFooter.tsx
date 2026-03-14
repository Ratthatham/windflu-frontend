import { Wind } from "lucide-react";

const WindflowFooter = () => {
  return (
    <footer className="border-t border-[#ede8f5] py-10 px-6 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5" style={{ color: "#8B5CF6" }} />
          <span
            className="font-black tracking-tight"
            style={{
              background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Windflu
          </span>
        </div>
        <p className="text-sm text-[#6b5f8a]">
          Windflu 2569 — ทำโดยคนไทย เพื่อคนไทยโดยเฉพาะ
        </p>
      </div>
    </footer>
  );
};

export default WindflowFooter;
