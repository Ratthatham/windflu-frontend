import { Wind } from "lucide-react";

const WindflowFooter = () => {
  return (
    <footer className="border-t border-[#ede8f5] py-10 px-6 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="p-1.5 bg-[#1d1d1f] rounded-xl group-hover:bg-brand-purple transition-all duration-500">
            <Wind className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-gradient-brand">
            Windflu
          </span>
        </div>
        <div className="flex flex-col md:items-end gap-2">
          <p className="text-sm font-medium text-[#1d1d1f] tracking-tight">
            ทำโดยคนไทย เพื่อคนไทยโดยเฉพาะ
          </p>
          <p className="text-xs font-medium text-[#86868b] tracking-tight">
            © 2569 Windflu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default WindflowFooter;
