import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Product, CATEGORIES, BRANDS } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Package, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import panel from "@/assets/p-panel.jpg";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSaveProduct: (product: Product) => void;
}

export function ProductFormModal({
  isOpen,
  onClose,
  productToEdit,
  onSaveProduct,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>(() => ({
    name: "",
    tagline: "",
    category: CATEGORIES[0] || "Solar Panels",
    brand: BRANDS[0] || "OMSUN",
    price: 15000,
    compareAt: 18000,
    stock: 25,
    rating: 4.8,
    badges: ["Best Seller"],
    specs: [
      { label: "Warranty", value: "5 Years" },
      { label: "Certification", value: "IEC 62930 / NEA Interconnection" },
    ],
  }));

  useEffect(() => {
    if (productToEdit) {
      setFormData({ ...productToEdit });
    } else {
      setFormData({
        id: `sku-${Date.now().toString(36)}`,
        name: "",
        tagline: "",
        category: CATEGORIES[0] || "Solar Panels",
        brand: BRANDS[0] || "OMSUN",
        price: 25000,
        compareAt: 28000,
        stock: 30,
        rating: 4.8,
        image: panel,
        badges: ["Best Seller"],
        specs: [
          { label: "Warranty", value: "10 Years" },
          { label: "Efficiency", value: "98.5%" },
        ],
      });
    }
  }, [productToEdit, isOpen]);

  const handleAddSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specs: [...(prev.specs || []), { label: "", value: "" }],
    }));
  };

  const handleRemoveSpec = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specs: (prev.specs || []).filter((_, i) => i !== index),
    }));
  };

  const handleSpecChange = (index: number, field: "label" | "value", val: string) => {
    setFormData((prev) => {
      const currentSpecs = prev.specs || [];
      const newSpecs = currentSpecs.map((s, i) =>
        i === index ? { label: s.label, value: s.value, [field]: val } : s
      );
      return { ...prev, specs: newSpecs };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error("Please provide a valid product name and price");
      return;
    }

    const defaultCategory = CATEGORIES[0] || "Solar Panels";
    const defaultBrand = BRANDS[0] || "OMSUN";

    const finalProduct: Product = {
      id: formData.id || `sku-${Date.now()}`,
      name: formData.name || "Untitled Hardware",
      tagline: formData.tagline || "High Performance Energy Hardware",
      category: formData.category ?? defaultCategory,
      brand: formData.brand ?? defaultBrand,
      price: Number(formData.price) || 0,
      ...(formData.compareAt ? { compareAt: Number(formData.compareAt) } : {}),
      image: formData.image || panel,
      badges: formData.badges || [],
      stock: Number(formData.stock) || 0,
      rating: formData.rating || 4.8,
      specs: (formData.specs || []).filter((s): s is { label: string; value: string } => Boolean(s.label && s.value)),
    };

    onSaveProduct(finalProduct);
    toast.success(
      productToEdit ? `Product "${finalProduct.name}" updated!` : `New Product "${finalProduct.name}" created!`
    );
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-y-auto rounded-3xl bg-white dark:bg-[#0c241c] border-[#E2EDE7] dark:border-white/10 shadow-2xl">
        <DialogHeader className="p-6 bg-[#F2FBF4] dark:bg-[#12342B] border-b border-[#E2EDE7] dark:border-white/10 sticky top-0 z-10">
          <DialogTitle className="font-display font-extrabold text-xl text-[#173226] dark:text-white flex items-center gap-2">
            <Package className="size-5 text-[#38B46A]" />
            <span>{productToEdit ? "Edit Hardware SKU" : "Add New Hardware SKU"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            Manage OMSUN Nepal product specifications, pricing in NPR, and stock inventory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
                Product Title *
              </Label>
              <Input
                required
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. OMSUN Mono 550W Panel"
                className="rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
                Brand Name
              </Label>
              <select
                value={formData.brand || BRANDS[0]}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 text-xs font-semibold"
              >
                {BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
              Short Tagline / Features Summary
            </Label>
            <Input
              value={formData.tagline || ""}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. N-type monocrystalline module built for Himalayan sun"
              className="rounded-xl text-xs"
            />
          </div>

          {/* Category & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
                Category
              </Label>
              <select
                value={formData.category || CATEGORIES[0]}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 text-xs font-semibold"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
                Current Warehouse Stock
              </Label>
              <Input
                type="number"
                min="0"
                value={formData.stock ?? 0}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="rounded-xl text-xs font-mono font-bold"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
                Selling Price (NPR) *
              </Label>
              <Input
                type="number"
                required
                value={formData.price ?? 0}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="rounded-xl text-xs font-mono font-bold text-[#38B46A]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
                Compare At Price (NPR)
              </Label>
              <Input
                type="number"
                value={formData.compareAt ?? ""}
                onChange={(e) => setFormData({ ...formData, compareAt: Number(e.target.value) })}
                placeholder="Optional list price"
                className="rounded-xl text-xs font-mono text-slate-400"
              />
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
                Technical Specifications (Key-Value)
              </Label>
              <button
                type="button"
                onClick={handleAddSpec}
                className="text-xs font-extrabold text-[#38B46A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="size-3.5" /> Add Spec
              </button>
            </div>

            <div className="space-y-2">
              {(formData.specs || []).map((spec, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    placeholder="Spec Label (e.g. Efficiency)"
                    value={spec.label}
                    onChange={(e) => handleSpecChange(i, "label", e.target.value)}
                    className="rounded-xl text-xs flex-1"
                  />
                  <Input
                    placeholder="Spec Value (e.g. 22.4%)"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(i, "value", e.target.value)}
                    className="rounded-xl text-xs flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(i)}
                    className="p-2 text-slate-400 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100 dark:border-white/10">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs font-bold">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl bg-[#38B46A] hover:bg-[#2fa05c] text-white font-extrabold text-xs gap-1.5">
              <Check className="size-4" /> Save Hardware SKU
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
