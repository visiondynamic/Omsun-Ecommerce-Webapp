import React, { useState, useEffect, useRef } from "react";
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
import { Image as ImageIcon, Check, Sparkles, Eye, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import panel from "@/assets/p-panel.jpg";

interface BannerEditModalProps {
  bannerToEdit: AdminBanner | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveBanner: (banner: AdminBanner) => void | Promise<void>;
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

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP, SVG)");
      return;
    }

    try {
      setIsUploading(true);
      const res = await api.uploadImage(file);
      if (res?.url) {
        setFormData((prev) => ({ ...prev, image: res.url }));
        toast.success(`Banner image "${file.name}" uploaded successfully!`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload banner image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-[#173226] dark:text-slate-200 flex items-center gap-1.5">
                <Eye className="size-3.5 text-[#38B46A]" /> Live Banner Preview & Image
              </Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="h-7 rounded-lg border-emerald-500/40 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-[11px] font-bold px-2.5"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="size-3 mr-1.5 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="size-3 mr-1.5 text-emerald-600" /> Direct Upload Image
                  </>
                )}
              </Button>
            </div>

            <div className="relative overflow-hidden rounded-2xl h-44 bg-[#061E15] p-5 flex flex-col justify-between border border-[#12342B] text-white">
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Banner preview"
                  className="absolute inset-0 size-full object-cover opacity-35"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = panel;
                  }}
                />
              )}
              <div className="relative z-10 space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#38B46A] text-[10px] font-black uppercase tracking-wider text-white">
                  {formData.tagBadge || "Certified"}
                </span>
                <h4 className="font-display font-black text-lg text-white leading-tight line-clamp-1">
                  {formData.title || "Banner Title"}
                </h4>
                <p className="text-xs text-white/80 line-clamp-2">
                  {formData.subtitle || "Banner subtitle description"}
                </p>
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#38B46A] text-white text-xs font-bold shadow-sm">
                    {formData.ctaText || "CTA Button"}
                  </span>
                </div>
              </div>
            </div>

            <Input
              value={formData.image || ""}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="Paste banner image URL or click 'Direct Upload Image'..."
              className="rounded-xl text-xs mt-2"
            />
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
