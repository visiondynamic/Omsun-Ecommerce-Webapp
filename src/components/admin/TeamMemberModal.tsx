import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Image as ImageIcon, Upload, Loader2, Sparkles, User, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { TeamMember } from "@/lib/teamData";

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit: TeamMember | null;
  onSaveMember: (member: Partial<TeamMember>) => Promise<void> | void;
}

export function TeamMemberModal({
  isOpen,
  onClose,
  memberToEdit,
  onSaveMember,
}: TeamMemberModalProps) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (memberToEdit) {
      setName(memberToEdit.name || "");
      setPosition(memberToEdit.position || "");
      setBio(memberToEdit.bio || "");
      setImage(memberToEdit.image || "/images/team/ashish-baral.jpg");
      setDisplayOrder(memberToEdit.displayOrder ?? 1);
      setIsActive(memberToEdit.isActive ?? true);
    } else {
      setName("");
      setPosition("");
      setBio("");
      setImage("/images/team/ashish-baral.jpg");
      setDisplayOrder(1);
      setIsActive(true);
    }
  }, [memberToEdit, isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WEBP, SVG)");
      return;
    }

    try {
      setIsUploading(true);
      const res = await api.uploadImage(file);
      if (res?.url) {
        setImage(res.url);
        toast.success(`Profile photo "${file.name}" uploaded successfully!`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter the member's full name");
      return;
    }
    if (!position.trim()) {
      toast.error("Please enter the member's designation/position");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSaveMember({
        ...(memberToEdit ? { id: memberToEdit.id } : {}),
        name: name.trim(),
        position: position.trim(),
        bio: bio.trim() || null,
        image: image.trim() || "/images/team/ashish-baral.jpg",
        displayOrder: Number(displayOrder) || 1,
        isActive,
      });
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save team member");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg rounded-2xl border border-white/10 bg-[#071F17] p-6 text-white shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              <Sparkles className="size-3" />
              <span>{memberToEdit ? "Edit Team Member" : "Add Executive / Member"}</span>
            </span>
          </div>
          <DialogTitle className="font-display text-xl font-bold text-white">
            {memberToEdit ? `Edit ${memberToEdit.name}` : "New Team Member"}
          </DialogTitle>
          <DialogDescription className="text-xs text-white/60">
            Configure profile details, designation, and appearance order on the OMSUN homepage.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Profile Photo Upload & Preview */}
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <Label className="text-xs font-bold text-white/80 block mb-2">Profile Photo</Label>
            <div className="flex items-center gap-4">
              <div className="relative size-20 sm:size-24 rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-black/40 shrink-0 shadow-md">
                {image ? (
                  <img
                    src={image}
                    alt={name || "Preview"}
                    className="size-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/team/ashish-baral.jpg";
                    }}
                  />
                ) : (
                  <div className="size-full grid place-items-center text-white/40">
                    <User className="size-8" />
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <Loader2 className="size-6 text-emerald-400 animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="h-9 px-3 text-xs font-bold rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {isUploading ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Upload className="size-3.5" />
                    )}
                    <span>{isUploading ? "Uploading..." : "Upload Photo"}</span>
                  </Button>

                  {image && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setImage("")}
                      className="h-9 px-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl"
                    >
                      <X className="size-3.5 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-white/50 leading-tight">
                  Recommended: Square 1:1 professional portrait, min 400x400 px.
                </p>
              </div>
            </div>

            {/* Direct image path input */}
            <div className="mt-3 pt-3 border-t border-white/5">
              <Label className="text-[10px] uppercase font-bold text-white/50 block mb-1">
                Image Path / URL
              </Label>
              <Input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/images/team/ashish-baral.jpg"
                className="h-8 rounded-lg text-xs font-mono bg-black/40 border-white/10 text-white"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-white/80">
                Full Name <span className="text-rose-400">*</span>
              </Label>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ashish Baral"
                className="h-10 rounded-xl bg-black/30 border-white/15 text-xs text-white"
              />
            </div>

            {/* Position / Designation */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-white/80">
                Designation / Position <span className="text-rose-400">*</span>
              </Label>
              <Input
                type="text"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. CEO, CTO, CFO"
                className="h-10 rounded-xl bg-black/30 border-white/15 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Display Order */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-white/80">Display Order Position</Label>
              <Input
                type="number"
                min={1}
                max={99}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                className="h-10 rounded-xl bg-black/30 border-white/15 text-xs text-white"
              />
              <p className="text-[10px] text-white/50">1 appears first, followed by 2, 3...</p>
            </div>

            {/* Visibility Toggle */}
            <div className="space-y-1.5 flex flex-col justify-center pt-2">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-black/20 border border-white/10">
                <Checkbox
                  id="team-active"
                  checked={isActive}
                  onCheckedChange={(c) => setIsActive(!!c)}
                  className="size-4 border-emerald-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-black"
                />
                <Label htmlFor="team-active" className="text-xs font-bold text-white cursor-pointer">
                  Visible on Homepage
                </Label>
              </div>
              <p className="text-[10px] text-white/50 pl-1">
                {isActive ? "Member will appear on the homepage" : "Hidden from homepage"}
              </p>
            </div>
          </div>

          {/* Bio / Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-white/80">Executive Summary / Bio (Optional)</Label>
            <Textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief executive background or specialization..."
              className="rounded-xl bg-black/30 border-white/15 text-xs text-white resize-none"
            />
          </div>

          <DialogFooter className="mt-6 flex flex-row items-center justify-end gap-2 pt-2 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 px-4 rounded-xl border-white/20 text-xs font-semibold hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-lg hover:from-emerald-400 hover:to-teal-500 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{memberToEdit ? "Save Changes" : "Create Member"}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
