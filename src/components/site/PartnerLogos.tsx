import smartenLogo from "@/assets/brands/smarten.svg";
import luminousLogo from "@/assets/brands/luminous.png";
import dynaPlusLogo from "@/assets/brands/dyna-plus.png";
import greenvoltLogo from "@/assets/brands/greenvolt.png";

export interface PartnerBrand {
  name: string;
  logo: string;
}

export const partnerBrandLogos: PartnerBrand[] = [
  { name: "Smarten — Fusion is the future", logo: smartenLogo },
  { name: "Luminous", logo: luminousLogo },
  { name: "Dyna Plus", logo: dynaPlusLogo },
  { name: "GreenVolt Power India", logo: greenvoltLogo },
];
