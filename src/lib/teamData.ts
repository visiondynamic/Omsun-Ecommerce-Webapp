export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string | null;
  image: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const initialFallbackTeam: TeamMember[] = [
  {
    id: "team-ashish-baral",
    name: "Ashish Baral",
    position: "CEO",
    bio: "Visionary executive leading OMSUN Nepal's strategic expansion, energy infrastructure partnerships, and corporate governance across Nepal.",
    image: "/images/team/ashish-baral.jpg",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "team-sudhir-bhattarai",
    name: "Sudhir Bhattarai",
    position: "CTO",
    bio: "Technology and engineering strategist overseeing power electronics architectures, solar EPC technical compliance, and smart grid automation.",
    image: "/images/team/sudhir-bhattarai.jpg",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "team-mukhul-ghimire",
    name: "Mukhul Ghimire",
    position: "CFO",
    bio: "Chief Financial Officer managing fiscal integrity, commercial risk assessment, vendor capitalization, and project financing for utility installations.",
    image: "/images/team/mukhul-ghimire.jpg",
    displayOrder: 3,
    isActive: true,
  },
];
