import schneiderLogo from "@/assets/brands/schneider.svg";
import abbLogo from "@/assets/brands/abb.svg";
import huaweiLogo from "@/assets/brands/huawei.svg";
import longiLogo from "@/assets/brands/longi.svg";
import growattLogo from "@/assets/brands/growatt.svg";
import havellsLogo from "@/assets/brands/havells.svg";
import siemensLogo from "@/assets/brands/siemens.svg";
import jinkoLogo from "@/assets/brands/jinko.svg";

export interface PartnerBrand {
  name: string;
  logo: string;
}

export const partnerBrandLogos: PartnerBrand[] = [
  { name: "Schneider Electric", logo: schneiderLogo },
  { name: "ABB", logo: abbLogo },
  { name: "Huawei", logo: huaweiLogo },
  { name: "LONGi", logo: longiLogo },
  { name: "Growatt", logo: growattLogo },
  { name: "Havells", logo: havellsLogo },
  { name: "Siemens", logo: siemensLogo },
  { name: "Jinko Solar", logo: jinkoLogo },
];
