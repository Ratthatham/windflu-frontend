import React from "react";

const brands = [
  "Sony Music",
  "GMM Grammy",
  "RS Group",
  "LINE MAN",
  "SCB",
  "AIS",
  "Lazada",
  "Shopee",
];

const WindflowLogos = () => {
  return (
    <section className="py-12 border-y border-[#ede8f5] overflow-hidden bg-white">
      <p className="text-center text-xs text-[#6b5f8a] font-semibold uppercase tracking-widest mb-8">
        แบรนด์ที่ไว้วางใจ Windflu
      </p>
      <div className="flex gap-12 animate-[scroll_20s_linear_infinite] whitespace-nowrap">
        {[...brands, ...brands].map((b, i) => (
          <span
            key={i}
            className="text-[#c4b8e0] font-black text-lg tracking-tight"
          >
            {b}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default WindflowLogos;
