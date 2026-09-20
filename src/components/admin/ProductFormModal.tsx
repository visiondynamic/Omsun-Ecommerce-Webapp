import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Product, CATEGORIES, BRANDS, PRODUCT_TAXONOMY, resolveDbImage } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Package, Check, ImageIcon, Sparkles, Star, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import panel from "@/assets/p-panel.jpg";
import inverter from "@/assets/p-inverter.jpg";
import battery from "@/assets/p-battery.jpg";
import light from "@/assets/p-light.jpg";
import panelboard from "@/assets/p-panelboard.jpg";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  initialCategory?: string;
  initialSubcategory?: string;
  onSaveProduct: (product: Product) => void;
}

export function ProductFormModal({
  isOpen,
  onClose,
  productToEdit,
  initialCategory,
  initialSubcategory,
  onSaveProduct,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<Partial<Product> & { description?: string | undefined; badgesString?: string | undefined }>(() => {
    const initCat = initialCategory && CATEGORIES.includes(initialCategory) ? initialCategory : (CATEGORIES[0] || "Stabilizer");
    const initTax = PRODUCT_TAXONOMY.find((t) => t.name === initCat);
    const initSub = initialSubcategory || (initTax?.subcategories[0] || "");
    return {
      name: "",
      tagline: "",
      description: "",
      category: initCat,
      subcategory: initSub,
      brand: BRANDS[0] || "OMSUN",
      price: 25000,
      stock: 25,
      rating: 4.9,
      image: "",
      badges: ["In Stock"],
      badgesString: "In Stock",
      specs: [
        { label: "Warranty", value: "2 Years Replacement" },
        { label: "Application", value: "Industrial & Commercial Power" },
      ],
    };
  });

  const [isUploading, setIsUploading] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP, SVG)");
      return;
    }

    // Read base64 data URL for immediate 0ms local preview
    const reader = new FileReader();
    reader.onload = async () => {
      const previewDataUrl = reader.result as string;

      // Show immediately in preview
      setFormData((prev) => {
        const currentImages = prev.images || (prev.image ? [prev.image] : []);
        return {
          ...prev,
          image: previewDataUrl,
          images: [previewDataUrl, ...currentImages.filter((img) => img !== prev.image && !img.startsWith("data:"))],
        };
      });

      try {
        setIsUploading(true);
        const res = await api.uploadImage(file);
        if (res?.url) {
          setFormData((prev) => {
            const currentImages = prev.images || [];
            const updatedImages = currentImages.map((img) => (img === previewDataUrl ? res.url : img));
            const finalImages = updatedImages.includes(res.url) ? updatedImages : [res.url, ...updatedImages];
            return {
              ...prev,
              image: prev.image === previewDataUrl ? res.url : (prev.image || res.url),
              images: finalImages,
            };
          });
          toast.success(`Primary image "${file.name}" uploaded successfully!`);
        }
      } catch (err: any) {
        console.warn("[upload] Server upload notice, keeping local preview:", err.message);
        toast.info("Image loaded in preview and will be saved with product.");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMultipleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (validFiles.length === 0) {
      toast.error("Please select valid image files (PNG, JPG, WEBP, SVG)");
      return;
    }

    try {
      setIsUploading(true);

      // Read all local previews first for instant feedback
      const previewPromises = validFiles.map((file) => {
        return new Promise<{ file: File; dataUrl: string }>((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve({ file, dataUrl: r.result as string });
          r.readAsDataURL(file);
        });
      });

      const loadedPreviews = await Promise.all(previewPromises);
      const previewDataUrls = loadedPreviews.map((p) => p.dataUrl);

      // Show instant previews in UI
      setFormData((prev) => {
        const currentImages = prev.images || (prev.image ? [prev.image] : []);
        return {
          ...prev,
          image: prev.image || previewDataUrls[0] || "",
          images: [...currentImages, ...previewDataUrls],
        };
      });

      // Concurrently upload to server
      const uploadedMap = new Map<string, string>(); // dataUrl -> serverUrl
      await Promise.all(
        loadedPreviews.map(async (item) => {
          try {
            const res = await api.uploadImage(item.file);
            if (res?.url) {
              uploadedMap.set(item.dataUrl, res.url);
            }
          } catch (err: any) {
            console.warn("[upload] Gallery item upload error, fallback to preview:", item.file.name, err);
          }
        })
      );

      // Replace uploaded server URLs
      setFormData((prev) => {
        const currentImages = prev.images || [];
        const mappedImages = currentImages.map((img) => uploadedMap.get(img) || img);
        const nextPrimary = uploadedMap.get(prev.image || "") || prev.image || mappedImages[0] || "";
        return {
          ...prev,
          image: nextPrimary,
          images: mappedImages,
        };
      });

      toast.success(`Loaded ${validFiles.length} showcase photo(s) to gallery!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to process showcase photos");
    } finally {
      setIsUploading(false);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    const url = newGalleryUrl.trim();
    setFormData((prev) => {
      const currentImages = prev.images || (prev.image ? [prev.image] : []);
      if (currentImages.includes(url)) return prev;
      const nextImages = [...currentImages, url];
      return {
        ...prev,
        image: prev.image || url,
        images: nextImages,
      };
    });
    setNewGalleryUrl("");
    toast.success("Image added to showcase gallery!");
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormData((prev) => {
      const currentImages = prev.images || (prev.image ? [prev.image] : []);
      const nextImages = currentImages.filter((_, i) => i !== indexToRemove);
      const newPrimary = nextImages[0] || "";
      return {
        ...prev,
        image: (prev.image === currentImages[indexToRemove] ? newPrimary : prev.image) || "",
        images: nextImages,
      };
    });
  };

  const handleSetPrimaryImage = (imgUrl: string) => {
    setFormData((prev) => {
      const currentImages = prev.images || [];
      const reordered = [imgUrl, ...currentImages.filter((img) => img !== imgUrl)];
      return {
        ...prev,
        image: imgUrl,
        images: reordered,
      };
    });
    toast.success("Set as primary showcase image!");
  };

  useEffect(() => {
    if (productToEdit) {
      const initialImages =
        productToEdit.images && productToEdit.images.length > 0
          ? productToEdit.images
          : productToEdit.image
          ? [productToEdit.image]
          : [];

      setFormData({
        ...productToEdit,
        image: productToEdit.image || initialImages[0] || "",
        images: initialImages,
        badgesString: productToEdit.badges?.join(", ") || "",
      });
    } else {
      const initCat = initialCategory && CATEGORIES.includes(initialCategory) ? initialCategory : (CATEGORIES[0] || "Stabilizer");
      const initTax = PRODUCT_TAXONOMY.find((t) => t.name === initCat);
      const initSub = initialSubcategory || (initTax?.subcategories[0] || "");
      setFormData({
        id: `sku-${Date.now().toString(36)}`,
        name: "",
        tagline: "",
        description: "",
        category: initCat,
        subcategory: initSub,
        brand: BRANDS[0] || "OMSUN",
        price: 25000,
        stock: 30,
        rating: 4.9,
        image: "",
        images: [],
        badges: ["In Stock"],
        badgesString: "In Stock",
        specs: [
          { label: "Warranty", value: "2 Years Replacement" },
          { label: "Application", value: "Industrial & Commercial Power" },
        ],
      });
    }
  }, [productToEdit, isOpen, initialCategory, initialSubcategory]);

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
    if (isUploading) {
      toast.info("Please wait a moment while showcase photos are uploading to the server...");
      return;
    }
    if (!formData.name || !formData.price) {
      toast.error("Please provide a valid product name and price");
      return;
    }

    const defaultCategory = CATEGORIES[0] || "UPS";
    const defaultBrand = BRANDS[0] || "Power-One";

    // Parse badges from comma-separated string
    const parsedBadges = formData.badgesString
      ? formData.badgesString
          .split(",")
          .map((b) => b.trim())
          .filter(Boolean)
      : formData.badges || [];

    const galleryList = (formData.images || []).filter(
      (img): img is string => typeof img === "string" && img.trim().length > 0 && !img.startsWith("blob:")
    );
    const primaryImg = formData.image?.trim() || galleryList[0] || "";
    const finalGallery = galleryList.length > 0
      ? (primaryImg && !galleryList.includes(primaryImg) ? [primaryImg, ...galleryList] : galleryList)
      : (primaryImg ? [primaryImg] : []);

    const finalProduct: Product = {
      id: formData.id || `sku-${Date.now()}`,
      name: formData.name || "Untitled Hardware",
      tagline: formData.tagline || "High Performance Energy Hardware",
      category: formData.category ?? defaultCategory,
      subcategory: formData.subcategory || undefined,
      brand: formData.brand ?? defaultBrand,
      price: Number(formData.price) || 0,
      compareAt: undefined,
      image: primaryImg,
      images: finalGallery,
      badges: parsedBadges,
      stock: Number(formData.stock) || 0,
      rating: Number(formData.rating) || 4.8,
      specs: (formData.specs || []).filter((s): s is { label: string; value: string } => Boolean(s.label && s.value)),
    };

    if (formData.description) {
      (finalProduct as any).description = formData.description;
    }

    onSaveProduct(finalProduct);
    toast.success(
      productToEdit ? `Product "${finalProduct.name}" updated!` : `New Product "${finalProduct.name}" created!`
    );
    onClose();
  };

  const currentGalleryImages = formData.images || (formData.image ? [formData.image] : []);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-y-auto rounded-3xl bg-white dark:bg-[#0c241c] border-[#E2EDE7] dark:border-white/10 shadow-2xl">
        <DialogHeader className="p-6 bg-[#F2FBF4] dark:bg-[#12342B] border-b border-[#E2EDE7] dark:border-white/10 sticky top-0 z-10">
          <DialogTitle className="font-display font-extrabold text-xl text-[#173226] dark:text-white flex items-center gap-2">
            <Package className="size-5 text-[#38B46A]" />
            <span>{productToEdit ? "Edit Hardware SKU & Content" : "Add New Hardware SKU"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            Manage OMSUN Nepal product content, multi-angle showcase imagery, specifications, pricing, and stock inventory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
                Product Title / Name *
              </Label>
              <Input
                required
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Power-One UHF Series Online UPS"
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

          {/* Product Primary Image & Direct Upload */}
          <div className="space-y-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-bold text-[#173226] dark:text-slate-200 flex items-center gap-1.5">
                  <ImageIcon className="size-4 text-[#38B46A]" /> Primary Showcase Image
                </Label>
                <p className="text-[11px] text-slate-500">Main photo displayed on catalog cards & hero header</p>
              </div>
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
                className="h-7.5 rounded-lg border-emerald-500/40 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700/50 text-[11px] font-bold px-3 shadow-xs cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="size-3 mr-1.5 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="size-3 mr-1.5 text-emerald-600 dark:text-emerald-400" /> Direct Upload Image
                  </>
                )}
              </Button>
            </div>

            <div className="flex gap-3 items-center pt-1">
              <div className="size-16 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/30 overflow-hidden shrink-0 flex items-center justify-center p-1 relative group">
                {formData.image ? (
                  <img
                    src={resolveDbImage(formData.image, formData.category || "Stabilizer")}
                    alt="Preview"
                    className="size-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = panel;
                    }}
                  />
                ) : (
                  <Package className="size-6 text-slate-300" />
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                    <Loader2 className="size-5 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <Input
                  value={formData.image || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      image: val,
                      images: prev.images && prev.images.length > 0 ? prev.images : (val ? [val] : []),
                    }));
                  }}
                  placeholder="Paste image URL or click 'Direct Upload Image' above..."
                  className="rounded-xl text-xs bg-white dark:bg-[#0c241c]"
                />
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-slate-400 font-semibold self-center">Presets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const img = "/products/omsun-mter-10kva.webp";
                      setFormData((prev) => ({
                        ...prev,
                        image: img,
                        images: prev.images?.includes(img) ? prev.images : [img, ...(prev.images || [])],
                      }));
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold cursor-pointer border border-emerald-200"
                  >
                    OMSUN Servo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const img = "/products/green-volt-5kva-110v.webp";
                      setFormData((prev) => ({
                        ...prev,
                        image: img,
                        images: prev.images?.includes(img) ? prev.images : [img, ...(prev.images || [])],
                      }));
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold cursor-pointer border border-emerald-200"
                  >
                    Greenn Volt AVR
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const img = "https://poweroneups.com/img/product/uhf1.png";
                      setFormData((prev) => ({
                        ...prev,
                        image: img,
                        images: prev.images?.includes(img) ? prev.images : [img, ...(prev.images || [])],
                      }));
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold cursor-pointer border border-emerald-200"
                  >
                    Power-One UHF
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const img = "https://poweroneups.com/img/product/PMM%20Series%201.png";
                      setFormData((prev) => ({
                        ...prev,
                        image: img,
                        images: prev.images?.includes(img) ? prev.images : [img, ...(prev.images || [])],
                      }));
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold cursor-pointer border border-emerald-200"
                  >
                    PMM Modular
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        image: panel,
                        images: prev.images?.includes(panel) ? prev.images : [panel, ...(prev.images || [])],
                      }));
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700 hover:bg-slate-300 font-semibold cursor-pointer"
                  >
                    Solar Panel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        image: inverter,
                        images: prev.images?.includes(inverter) ? prev.images : [inverter, ...(prev.images || [])],
                      }));
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700 hover:bg-slate-300 font-semibold cursor-pointer"
                  >
                    Inverter
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        image: battery,
                        images: prev.images?.includes(battery) ? prev.images : [battery, ...(prev.images || [])],
                      }));
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700 hover:bg-slate-300 font-semibold cursor-pointer"
                  >
                    Battery
                  </button>
                </div>
              </div>
            </div>

            {/* ── SHOWCASE GALLERY / MULTI-IMAGE SECTION ── */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <Label className="text-xs font-extrabold text-[#173226] dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-amber-500" /> Additional Showcase Photos Gallery
                  </Label>
                  <p className="text-[10px] text-slate-500">
                    Add multi-angle product views, technical detail shots, and installation showcases.
                  </p>
                </div>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleGalleryUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                  onClick={() => galleryInputRef.current?.click()}
                  className="h-7 rounded-lg border-sky-500/40 bg-sky-50 hover:bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 text-[10.5px] font-bold px-2.5 cursor-pointer"
                >
                  <Upload className="size-3 mr-1 text-sky-600" /> + Upload Multiple Photos
                </Button>
              </div>

              {/* Add Image by URL Row */}
              <div className="flex gap-2 items-center">
                <Input
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddGalleryUrl();
                    }
                  }}
                  placeholder="Paste additional image URL (e.g. https://... or /products/...) to add..."
                  className="rounded-xl text-xs bg-white dark:bg-[#0c241c] flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddGalleryUrl}
                  disabled={!newGalleryUrl.trim()}
                  className="h-9 px-3 rounded-xl bg-[#38B46A] hover:bg-[#2fa05c] text-white text-xs font-bold shrink-0 cursor-pointer"
                >
                  <Plus className="size-3.5 mr-1" /> Add
                </Button>
              </div>

              {/* Gallery Thumbnails Strip */}
              {currentGalleryImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {currentGalleryImages.map((imgUrl, idx) => {
                    const isPrimary = imgUrl === formData.image || (!formData.image && idx === 0);
                    return (
                      <div
                        key={idx}
                        className={`relative rounded-xl border p-1.5 bg-white dark:bg-[#071f17] flex flex-col items-center gap-1.5 transition-all group ${
                          isPrimary
                            ? "border-[#38B46A] ring-2 ring-[#38B46A]/20 bg-emerald-50/20 dark:bg-emerald-950/20"
                            : "border-slate-200 dark:border-white/10 hover:border-slate-300"
                        }`}
                      >
                        <div className="size-16 rounded-lg overflow-hidden bg-slate-50 dark:bg-black/20 flex items-center justify-center p-1">
                          <img
                            src={resolveDbImage(imgUrl, formData.category || "Stabilizer")}
                            alt={`Gallery ${idx + 1}`}
                            className="size-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = panel;
                            }}
                          />
                        </div>

                        <div className="w-full flex items-center justify-between gap-1">
                          {isPrimary ? (
                            <span className="text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
                              Primary
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(imgUrl)}
                              className="text-[9px] font-bold text-slate-600 dark:text-slate-300 hover:text-[#38B46A] hover:underline cursor-pointer"
                            >
                              ★ Set Primary
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="p-1 text-slate-400 hover:text-red-500 rounded cursor-pointer transition-colors"
                            title="Remove from showcase"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Short Tagline */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
              Short Tagline / Subtitle
            </Label>
            <Input
              value={formData.tagline || ""}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. 1kVA – 20kVA High Frequency pure sine wave tower Online UPS"
              className="rounded-xl text-xs"
            />
          </div>

          {/* Full Description / Content */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
              Detailed Description & Content
            </Label>
            <Textarea
              rows={3}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter detailed technical description, applications, architecture, and features of the product..."
              className="rounded-xl text-xs resize-none"
            />
          </div>

          {/* Category, Subcategory & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
                Category *
              </Label>
              <select
                value={formData.category || CATEGORIES[0]}
                onChange={(e) => {
                  const newCat = e.target.value;
                  const tax = PRODUCT_TAXONOMY.find((t) => t.name === newCat);
                  setFormData({
                    ...formData,
                    category: newCat,
                    subcategory: tax?.subcategories[0] || "",
                  });
                }}
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
                Subcategory
              </Label>
              <select
                value={formData.subcategory || ""}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 text-xs font-semibold"
              >
                <option value="">None / General</option>
                {PRODUCT_TAXONOMY.find((t) => t.name === (formData.category || CATEGORIES[0]))
                  ?.subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
                Current Stock (Units)
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

          {/* Pricing, Rating & Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <Label className="text-xs font-bold text-[#173226] dark:text-slate-200 flex items-center gap-1">
                <Star className="size-3.5 text-amber-400 fill-amber-400" /> Rating (1-5)
              </Label>
              <Input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={formData.rating ?? 4.9}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="rounded-xl text-xs font-mono font-bold text-amber-600"
              />
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#173226] dark:text-slate-200">
              Badges / Highlights (Comma separated)
            </Label>
            <Input
              value={formData.badgesString ?? ""}
              onChange={(e) => setFormData({ ...formData, badgesString: e.target.value })}
              placeholder="e.g. Best Seller, Zero Transfer, DSP Control, Tier-4 Data Center"
              className="rounded-xl text-xs"
            />
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
                    placeholder="Spec Label (e.g. Capacity Range)"
                    value={spec.label}
                    onChange={(e) => handleSpecChange(i, "label", e.target.value)}
                    className="rounded-xl text-xs flex-1"
                  />
                  <Input
                    placeholder="Spec Value (e.g. 10 kVA to 4800 kVA)"
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
            <Button type="button" variant="outline" onClick={onClose} disabled={isUploading} className="rounded-xl text-xs font-bold">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading}
              className="rounded-xl bg-[#38B46A] hover:bg-[#2fa05c] text-white font-extrabold text-xs gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Uploading Media...</span>
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  <span>Save Hardware SKU</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
