import React, { useState } from "react";
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
import { Handshake, Check } from "lucide-react";
import { toast } from "sonner";

interface PartnerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePartner: (partner: AdminPartner) => void;
}

export function PartnerFormModal({ isOpen, onClose, onSavePartner }: PartnerFormModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [partnerSince, setPartnerSince] = useState("2026");
  const [notes, setNotes] = useState("");

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
            Register authorized manufacturers (Dyna, Excite, Luminous, Smarten).
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
