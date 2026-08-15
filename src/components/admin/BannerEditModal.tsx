import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AdminBanner } from "@/lib/adminData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Check, Sparkles, Eye } from "lucide-react";
import { toast } from "sonner";
import panel from "@/assets/p-panel.jpg";

interface BannerEditModalProps {
  bannerToEdit: AdminBanner | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveBanner: (banner: AdminBanner) => void;
}

export function BannerEditModal({
  bannerToEdit,
  isOpen,
  onClose,
  onSaveBanner,
}: BannerEditModalProps) {
  const [formData, setFormData] = useState<Partial<AdminBanner>>({
    title: "",
    subtitle: "",
    ctaText: "Explore Solar Catalog",
    ctaLink: "/shop",
    tagBadge: "NEA Net-Metering Certified",
    displayOrder: 1,
    status: "Active",
    image: panel,
  });

  useEffect(() => {
    if (bannerToEdit) {
      setFormData({ ...bannerToEdit });
    } else {
      setFormData({
        id: `BAN-${Date.now().toString(36)}`,
        title: "Clean Solar Energy Solutions for Nepal",
        subtitle: "Premium N-type monocrystalline solar modules and lithium storage systems.",
        ctaText: "Shop Catalog",
        ctaLink: "/shop",
        tagBadge: "10-Year Warranty",
        displayOrder: 1,
        status: "Active",
        image: panel,
      });
    }
  }, [bannerToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subtitle) {
      toast.error("Please enter a title and subtitle for the homepage banner");
      return;
    }

    const finalBanner: AdminBanner = {
      id: formData.id || `BAN-${Date.now()}`,
      title: formData.title || "",
      subtitle: formData.subtitle || "",
      ctaText: formData.ctaText || "Explore Catalog",
      ctaLink: formData.ctaLink || "/shop",
      image: formData.image || panel,
      tagBadge: formData.tagBadge || "Certified",
      displayOrder: Number(formData.displayOrder) || 1,
      status: formData.status || "Active",
    };

    onSaveBanner(finalBanner);
    toast.success("Homepage Banner updated!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] p-0 overflow-y-auto rounded-3xl bg-white dark:bg-[#0c241c] border-[#E2EDE7] dark:border-white/10 shadow-2xl">
        <DialogHeader className="p-6 bg-[#F2FBF4] dark:bg-[#12342B] border-b border-[#E2EDE7] dark:border-white/10 sticky top-0 z-10">
          <DialogTitle className="font-display font-extrabold text-xl text-[#173226] dark:text-white flex items-center gap-2">
            <ImageIcon className="size-5 text-[#38B46A]" />
            <span>{bannerToEdit ? "Edit Homepage Hero Banner" : "New Homepage Hero Banner"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Configure the main hero banner displayed on the customer storefront homepage.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Live Mock Banner Card Preview */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#173226] dark:text-slate-200 flex items-center gap-1.5">
              <Eye className="size-3.5 text-[#38B46A]" /> Live Storefront Banner Preview
            </Label>
            <div className="relative rounded-2xl overflow-hidden bg-[#041a12] p-5 text-white shadow-lg border border-[#38B46A]/30">
              <img
                src={formData.image}
                alt=""
                className="absolute inset-0 size-full object-cover opacity-40 pointer-events-none"
              />
              <div className="relative z-10 space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  {formData.tagBadge || "Storefront Hero"}
                </span>
                <h3 className="font-display text-lg font-extrabold leading-tight text-white">
                  {formData.title || "Banner Headline Goes Here"}
                </h3>
                <p className="text-xs text-slate-200/80 line-clamp-2">
                  {formData.subtitle || "Banner description paragraph summary..."}
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#38B46A] text-white text-xs font-bold shadow-sm">
                    {formData.ctaText || "CTA Button"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
              Banner Headline Title *
            </Label>
            <Input
              required
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
              Subtitle Description *
            </Label>
            <Textarea
              rows={2}
              required
              value={formData.subtitle || ""}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
                Tag Badge Label
              </Label>
              <Input
                value={formData.tagBadge || ""}
                onChange={(e) => setFormData({ ...formData, tagBadge: e.target.value })}
                className="rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
                CTA Button Text
              </Label>
              <Input
                value={formData.ctaText || ""}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                className="rounded-xl text-xs"
              />
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-slate-100 dark:border-white/10">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs font-bold">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl bg-[#38B46A] hover:bg-[#2fa05c] text-white font-extrabold text-xs gap-1">
              <Check className="size-4" /> Save Banner
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
