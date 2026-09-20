import smartenLogo from "@/assets/brands/smarten.svg";
import luminousLogo from "@/assets/brands/luminous.png";
import dynaPlusLogo from "@/assets/brands/dyna-plus.png";
import greenvoltLogo from "@/assets/brands/greenvolt.png";
import exideLogo from "@/assets/brands/exide.png";
import powerOneLogo from "@/assets/brands/power-one.png";

export interface PartnerBrand {
  name: string;
  logo: string;
}

export const partnerBrandLogos: PartnerBrand[] = [
  { name: "Smarten — Fusion is the future", logo: smartenLogo },
  { name: "Luminous", logo: luminousLogo },
  { name: "Dyna Plus", logo: dynaPlusLogo },
  { name: "GreenVolt — Digital Voltage Stabilizer", logo: greenvoltLogo },
  { name: "Exide", logo: exideLogo },
  { name: "Power-One — Micro Systems Pvt. Ltd.", logo: powerOneLogo },
];

