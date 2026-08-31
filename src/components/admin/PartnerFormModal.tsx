import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AdminPartner } from "@/lib/adminData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Handshake, Check, Upload, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface PartnerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePartner: (partner: AdminPartner) => void | Promise<void>;
}

export function PartnerFormModal({ isOpen, onClose, onSavePartner }: PartnerFormModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [partnerSince, setPartnerSince] = useState("2026");
  const [notes, setNotes] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, SVG)");
      return;
    }

    try {
      setIsUploading(true);
      const res = await api.uploadImage(file);
      if (res?.url) {
        setLogoUrl(res.url);
        toast.success(`Logo "${file.name}" uploaded!`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload logo");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please enter a brand partner name");
      return;
    }

    const newPartner: AdminPartner = {
      id: `PRT-${Date.now().toString(36)}`,
      name,
      category: category || "Solar & Battery Manufacturer",
      partnerSince,
      status: "Active Authorized",
      logoUrl: logoUrl || "",
      notes: notes || "Official Authorized Distribution Partner for Nepal.",
    };

    onSavePartner(newPartner);
    toast.success(`Partner brand "${newPartner.name}" registered!`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-3xl p-6 bg-white dark:bg-[#0c241c] border-[#E2EDE7] dark:border-white/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display font-extrabold text-lg text-[#173226] dark:text-white flex items-center gap-2">
            <Handshake className="size-5 text-[#38B46A]" />
            <span>Add Brand Partner</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Register authorized manufacturers with direct logo uploads.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
              Brand Partner Name *
            </Label>
            <Input
              required
              placeholder="e.g. Luminous Solar Power"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl text-xs font-bold"
            />
          </div>

          {/* Logo Upload Section */}
          <div className="space-y-1.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-[#173226] dark:text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="size-4 text-[#38B46A]" /> Partner Logo
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
                    <Upload className="size-3 mr-1.5 text-emerald-600" /> Upload Logo
                  </>
                )}
              </Button>
            </div>

            <div className="flex gap-2 items-center pt-1">
              {logoUrl ? (
                <div className="size-10 rounded-lg border border-slate-200 bg-white p-1 overflow-hidden shrink-0">
                  <img src={logoUrl} alt="Logo" className="size-full object-contain" />
                </div>
              ) : null}
              <Input
                placeholder="Paste logo URL or click Upload Logo..."
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="rounded-xl text-xs flex-1"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
              Hardware Specialty Category
            </Label>
            <Input
              placeholder="e.g. Tubular Solar Batteries & Inverters"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
                Partner Since Year
              </Label>
              <Input
                value={partnerSince}
                onChange={(e) => setPartnerSince(e.target.value)}
                className="rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
              Partnership & Warranty Notes
            </Label>
            <Input
              placeholder="e.g. Official Warranty & Servicing Partner in Nepal"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-xl text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs font-bold">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl bg-[#38B46A] hover:bg-[#2fa05c] text-white font-extrabold text-xs gap-1">
              <Check className="size-4" /> Save Partner
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
