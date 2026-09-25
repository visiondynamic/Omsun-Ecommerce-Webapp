import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface FonepayQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  payableAmount?: number;
}

export function FonepayQrModal({ isOpen, onClose, payableAmount }: FonepayQrModalProps) {
  const [copied, setCopied] = React.useState(false);
  const terminalId = "2222440021860909";

  const handleCopyTerminal = () => {
    navigator.clipboard.writeText(terminalId);
    setCopied(true);
    toast.success("Terminal ID 2222440021860909 copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-full p-6 max-h-[90vh] overflow-y-auto rounded-3xl border-slate-200 dark:border-white/10 bg-white dark:bg-[#06241a]">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-6 px-2.5 rounded-lg bg-[#E31837] text-white flex items-center justify-center font-black tracking-tight text-xs shadow-xs">
              fone<span className="text-yellow-300">pay</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <ShieldCheck className="size-3" /> Official Merchant Standee
            </span>
          </div>
          <DialogTitle className="text-lg font-black text-slate-900 dark:text-white">
            OMSUN NEPAL PRIVATE LIMITED
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            Scan using any mobile banking app in Nepal (Nabil, NIC Asia, Global IME, eSewa, Khalti, ConnectIPS, UPI, Alipay+).
          </DialogDescription>
        </DialogHeader>

        {/* Standee Image Display */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-slate-900/10 dark:border-white/10 shadow-lg bg-white my-2">
          <img
            src="/images/payments/omsun-fonepay-qr-standee.jpg"
            alt="Official OMSUN Nepal Fonepay QR Standee"
            className="w-full h-auto object-contain block mx-auto max-h-[460px]"
          />
        </div>

        {/* Merchant & Settlement Telemetry */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Terminal ID:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-slate-900 dark:text-white text-xs">
                {terminalId}
              </span>
              <button
                type="button"
                onClick={handleCopyTerminal}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                title="Copy Terminal ID"
              >
                {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Acquired By:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Nepal Investment Mega Bank (NIMB)
            </span>
          </div>

          {payableAmount != null && payableAmount > 0 && (
            <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-white/10 pt-2">
              <span className="text-slate-600 dark:text-slate-300 font-bold">Exact Payable:</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                Rs. {payableAmount.toLocaleString("en-NP")}
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 pt-2">
          <a
            href="/images/payments/omsun-fonepay-qr-standee.jpg"
            download="omsun-official-fonepay-qr.jpg"
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-[#E31837] hover:bg-[#c9122e] text-white font-bold text-xs shadow-md transition-colors"
          >
            <Download className="size-3.5" />
            <span>Download Standee</span>
          </a>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-10 px-4 rounded-xl font-bold text-xs"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
