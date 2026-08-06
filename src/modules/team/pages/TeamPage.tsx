import { UserCheck, Wrench, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';
import { teamService } from '@/services/team.service';

export default function TeamPage() {
  const team = teamService.list();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold uppercase">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            Corpo Técnico & Balcão
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Equipe Técnica & Bancada
          </h1>
          <p className="text-xs text-slate-500">
            Técnicos certificados, atendentes de balcão e gerência da assistência.
          </p>
        </div>
      </div>

      {/* Cards da Equipe */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {team.map((tech) => (
          <div
            key={tech.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:border-blue-500 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={tech.avatarUrl}
                  alt={tech.name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-blue-600/30"
                />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{tech.name}</h3>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    {tech.role}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {tech.phone}
                </div>
                <div className="flex items-center gap-2 text-slate-600 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />{' '}
                  <span className="truncate">{tech.email}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Especialidades</span>
                <div className="flex flex-wrap gap-1">
                  {tech.specialties.map((spec, i) => (
                    <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 grid grid-cols-2 text-center text-xs">
              <div>
                <strong className="text-blue-700 text-sm block font-extrabold">{tech.activeOSCount}</strong>
                <span className="text-[10px] text-slate-500">OSs Ativas</span>
              </div>
              <div>
                <strong className="text-emerald-700 text-sm block font-extrabold">{tech.completedOSCount}</strong>
                <span className="text-[10px] text-slate-500">Concluídas</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
