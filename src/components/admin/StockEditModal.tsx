import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Product, formatNPR } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Boxes, Check } from "lucide-react";
import { toast } from "sonner";

interface StockEditModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStock: (productId: string, newStock: number) => void;
}

export function StockEditModal({
  product,
  isOpen,
  onClose,
  onUpdateStock,
}: StockEditModalProps) {
  const [stockVal, setStockVal] = useState<number>(0);

  useEffect(() => {
    if (product) setStockVal(product.stock);
  }, [product]);

  if (!product) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStock(product.id, stockVal);
    toast.success(`Inventory updated for "${product.name}" to ${stockVal} units`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-3xl p-6 bg-white dark:bg-[#0c241c] border-[#E2EDE7] dark:border-white/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display font-extrabold text-lg text-[#173226] dark:text-white flex items-center gap-2">
            <Boxes className="size-5 text-amber-500" />
            <span>Update Warehouse Inventory Stock</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Adjust stock units for <strong className="text-[#173226] dark:text-white">{product.name}</strong> ({product.category}).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-3">
            <img src={product.image} alt="" className="size-12 rounded-xl object-cover" />
            <div>
              <div className="text-xs font-bold text-[#173226] dark:text-white">{product.name}</div>
              <div className="text-[11px] text-[#38B46A] font-bold">{formatNPR(product.price)}</div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
              New Inventory Quantity (Units)
            </Label>
            <Input
              type="number"
              min="0"
              required
              value={stockVal}
              onChange={(e) => setStockVal(Number(e.target.value))}
              className="rounded-xl text-sm font-mono font-bold text-[#173226] dark:text-white"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs font-bold">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl bg-[#38B46A] hover:bg-[#2fa05c] text-white font-extrabold text-xs gap-1">
              <Check className="size-4" /> Save Stock Level
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
