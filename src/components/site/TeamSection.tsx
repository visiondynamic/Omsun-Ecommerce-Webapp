import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { initialFallbackTeam, type TeamMember } from "@/lib/teamData";
import { Reveal } from "@/components/site/Reveal";
import { ShieldCheck, Sparkles, UserCheck } from "lucide-react";

export function TeamSection() {
  const { data: teamMembers } = useQuery<TeamMember[]>({
    queryKey: ["team"],
    queryFn: async () => {
      const data = await api.getTeam();
      return Array.isArray(data) && data.length > 0 ? data : initialFallbackTeam;
    },
    initialData: initialFallbackTeam,
    staleTime: 60 * 1000,
  });

  const activeMembers = (teamMembers || initialFallbackTeam).filter(
    (m) => m.isActive !== false,
  );

  if (activeMembers.length === 0) return null;

  return (
    <section className="relative py-16 sm:py-24 lg:py-28 bg-gradient-to-b from-[#F0FDF4] via-white to-[#F8FAFC] border-t border-emerald-900/5 overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-emerald-400/10 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-24 right-10 size-[450px] rounded-full bg-teal-400/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <Reveal className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-emerald-50 text-[#173226] border border-emerald-200/80 shadow-xs mb-3.5">
            <UserCheck className="size-3.5 text-[#38B46A]" />
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.2em]">
              Executive Leadership
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#173226] tracking-tight">
            Meet the Leaders Driving OMSUN
          </h2>

          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Experienced engineering minds and corporate strategists dedicated to delivering
            dependable power infrastructure and sustainable renewable energy across Nepal.
          </p>
        </Reveal>

        {/* Team Cards Grid */}
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {activeMembers.map((member, i) => {
            const roleBadgeColor =
              member.position.toUpperCase().includes("CEO")
                ? "bg-[#12342B] text-white border-[#12342B]"
                : member.position.toUpperCase().includes("CTO")
                  ? "bg-[#38B46A] text-white border-[#38B46A]"
                  : "bg-[#0A2E20] text-emerald-200 border-[#0A2E20]";

            return (
              <Reveal key={member.id || member.name} delay={Math.min(i * 40, 120)}>
                <div className="group relative rounded-3xl bg-white border border-slate-200/80 shadow-md hover:shadow-2xl hover:border-[#38B46A]/50 transition-all duration-300 flex flex-col h-full overflow-hidden hover:-translate-y-1">
                  {/* Photo Container */}
                  <div className="relative w-full pt-[105%] bg-slate-100 overflow-hidden">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="absolute inset-0 size-full object-cover object-top filter contrast-[1.02] group-hover:scale-105 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-emerald-50 flex items-center justify-center">
                        <span className="text-5xl font-black text-slate-300">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Gradient Overlay at Bottom of Photo */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Role Pill Floating on Image */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border shadow-md ${roleBadgeColor}`}
                      >
                        <ShieldCheck className="size-3.5" />
                        {member.position}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-lg sm:text-2xl font-extrabold text-[#173226] tracking-tight group-hover:text-[#38B46A] transition-colors">
                        {member.name}
                      </h3>

                      <p className="mt-1 text-xs font-bold text-[#38B46A] uppercase tracking-wider">
                        {member.position === "CEO"
                          ? "Chief Executive Officer"
                          : member.position === "CTO"
                            ? "Chief Technology Officer"
                            : member.position === "CFO"
                              ? "Chief Financial Officer"
                              : member.position}
                      </p>

                      {member.bio && (
                        <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                          {member.bio}
                        </p>
                      )}
                    </div>

                    {/* Subtle Bottom Accent */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                      <span className="flex items-center gap-1">
                        <Sparkles className="size-3 text-[#38B46A]" /> OMSUN Executive Board
                      </span>
                      <span className="text-[#38B46A] font-bold">Kathmandu, Nepal</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Corporate Trust Sub-note */}
        <div className="mt-14 text-center">
          <p className="text-xs text-slate-400 font-medium">
            Representing OMSUN Nepal's executive governance and strategic renewable energy initiatives.
          </p>
        </div>
      </div>
    </section>
  );
}
