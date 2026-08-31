import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AdminCoupon } from "@/lib/adminData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ticket, Check } from "lucide-react";
import { toast } from "sonner";

interface CouponFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCoupon: (coupon: AdminCoupon) => void | Promise<void>;
}

export function CouponFormModal({ isOpen, onClose, onSaveCoupon }: CouponFormModalProps) {
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"Percentage" | "Fixed">("Percentage");
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minSpend, setMinSpend] = useState<number>(20000);
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [expiryDate, setExpiryDate] = useState("2026-12-31");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      toast.error("Please enter a valid coupon code");
      return;
    }

    const newCoupon: AdminCoupon = {
      id: `CPN-${Date.now().toString(36).toUpperCase()}`,
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      minSpend: Number(minSpend),
      usageCount: 0,
      usageLimit: Number(usageLimit),
      expiryDate,
      status: "Active",
    };

    onSaveCoupon(newCoupon);
    toast.success(`Coupon promo code "${newCoupon.code}" created!`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-3xl p-6 bg-white dark:bg-[#0c241c] border-[#E2EDE7] dark:border-white/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display font-extrabold text-lg text-[#173226] dark:text-white flex items-center gap-2">
            <Ticket className="size-5 text-[#38B46A]" />
            <span>Create Promotional Coupon Code</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Define checkout discount rules for solar hardware customer orders.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
              Coupon Code *
            </Label>
            <Input
              required
              placeholder="e.g. SOLAR2026"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-[#38B46A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
                Discount Type
              </Label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as "Percentage" | "Fixed")}
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 text-xs font-semibold"
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="Fixed">Fixed NPR Amount (Rs)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
                Value ({discountType === "Percentage" ? "%" : "Rs"})
              </Label>
              <Input
                type="number"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="rounded-xl text-xs font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
                Min Order Spend (NPR)
              </Label>
              <Input
                type="number"
                value={minSpend}
                onChange={(e) => setMinSpend(Number(e.target.value))}
                className="rounded-xl text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
                Usage Redemptions Limit
              </Label>
              <Input
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(Number(e.target.value))}
                className="rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
              Expiration Date
            </Label>
            <Input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="rounded-xl text-xs font-mono"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs font-bold">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl bg-[#38B46A] hover:bg-[#2fa05c] text-white font-extrabold text-xs gap-1">
              <Check className="size-4" /> Save Coupon Code
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
