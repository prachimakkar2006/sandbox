import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Clock3, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DOMAIN_THEME, getDomainBySlug } from '../data/domainCatalog';

const progressItems = [
  { label: 'Profile', done: true },
  { label: 'Domain', done: true },
  { label: 'Subdomain', done: false, active: true },
  { label: 'Start', done: false },
];

export default function SelectSubdomain() {
  const { domain: domainSlug } = useParams();
  const domain = useMemo(() => getDomainBySlug(domainSlug), [domainSlug]);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!domain) navigate('/select-domain', { replace: true });
  }, [domain, navigate]);

  if (!domain) return null;

  const subdomainTheme = {
    border: '#CFE4F6',
    glow: 'rgba(116, 198, 238, 0.14)',
    accent: '#63B7EA',
    accentStrong: '#2563EB',
    borderGradient: 'linear-gradient(145deg, #9EDCF8, #E8F5FF)',
    iconBg: 'linear-gradient(145deg, rgba(122,201,241,0.2), rgba(122,201,241,0.08))',
    surface: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,251,255,0.98) 100%)',
  };

  const handleConfirm = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await axios.put('/api/student/preferences', {
        domain: domain.name,
        subdomain: selected.name,
      });
      await refreshUser();
      sessionStorage.removeItem('ciq_preselected_domain');
      navigate('/dashboard');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="min-h-screen px-4 py-8 sm:px-6 lg:px-8"
      style={{
        color: DOMAIN_THEME.text,
        background: 'linear-gradient(180deg, #E4F2FF 0%, #CEE6FB 100%)',
      }}
    >
      <div className="mx-auto max-w-[72rem]">
        <button
          onClick={() => navigate('/select-domain')}
          className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition"
          style={{
            border: '1px solid #CBD5E1',
            background: '#FFFFFF',
            color: '#475569',
          }}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm font-semibold">
          {progressItems.map((item, index) => (
            <div key={item.label} className="flex items-center gap-3">
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2"
                style={{
                  background: item.active ? '#3B82F6' : item.done ? '#F8FAFC' : '#F8FAFC',
                  color: item.active ? '#FFFFFF' : item.done ? '#2563EB' : '#64748B',
                  boxShadow: item.active ? '0 10px 24px rgba(59,130,246,0.18)' : 'none',
                }}
              >
                {item.done ? <Check size={14} /> : null}
                {item.label}
              </div>
              {index < progressItems.length - 1 ? <ArrowRight size={14} className="text-slate-400" /> : null}
            </div>
          ))}
        </div>

        <div className="mb-7 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em]" style={{ color: '#3B82F6' }}>
            {domain.name === 'Business (BBA)' ? 'Business' : domain.name} - Choose Subdomain
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Pick your specialization</h1>
          <p className="mt-3 text-lg leading-8 text-slate-500">Your 4 assessment rounds will be built around this exact subdomain.</p>
        </div>

        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          {domain.subdomains.map((subdomain, index) => {
            const Icon = subdomain.icon;
            const isSelected = selected?.name === subdomain.name;
            return (
              <motion.button
                key={subdomain.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.35 }}
                whileHover={{
                  y: -6,
                  scale: 1.008,
                }}
                onClick={() => setSelected(subdomain)}
                className="group relative overflow-hidden rounded-[22px] p-4 text-left transition-all duration-300 focus:outline-none focus-visible:ring-4"
                style={{
                  border: '1px solid transparent',
                  background: `${subdomainTheme.surface} padding-box, ${subdomainTheme.borderGradient} border-box`,
                  boxShadow: isSelected
                    ? `0 20px 42px rgba(30,41,59,0.14), 0 0 0 1px rgba(37,99,235,0.08) inset, 0 0 26px ${subdomainTheme.glow}`
                    : '0 14px 30px rgba(30,41,59,0.08), 0 0 0 1px rgba(255,255,255,0.78) inset',
                  transform: isSelected ? 'translateY(-2px)' : undefined,
                  borderColor: isSelected ? 'rgba(99,183,234,0.45)' : undefined,
                  minHeight: '19.25rem',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-28 opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: `linear-gradient(180deg, ${subdomainTheme.glow} 0%, rgba(255,255,255,0) 100%)` }}
                />
                <div
                  className="absolute inset-x-0 top-0 h-[3px]"
                  style={{ background: `linear-gradient(90deg, ${subdomainTheme.accentStrong}, ${subdomainTheme.accent}, rgba(255,255,255,0.45))` }}
                />
                <div
                  className="absolute -right-8 top-10 h-24 w-24 rounded-full opacity-0 blur-3xl transition-all duration-300 group-hover:opacity-100"
                  style={{ background: subdomainTheme.glow }}
                />
                <div className="relative flex h-full flex-col">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-[14px] shadow-[0_10px_24px_rgba(99,183,234,0.1)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-105"
                      style={{
                        background: subdomainTheme.iconBg,
                        border: `1px solid ${subdomainTheme.border}`,
                        color: '#2563EB',
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div
                      className="inline-flex h-7 items-center rounded-full px-3 text-[10px] font-semibold uppercase tracking-[0.16em] transition-all duration-300"
                      style={{
                        background: isSelected ? 'rgba(37,99,235,0.1)' : 'rgba(248,250,252,0.92)',
                        border: `1px solid ${isSelected ? 'rgba(37,99,235,0.18)' : 'rgba(186,209,232,0.8)'}`,
                        color: isSelected ? '#2563EB' : '#64748B',
                      }}
                    >
                      {isSelected ? 'Selected' : 'Specialization'}
                    </div>
                  </div>
                  <div className="mb-3">
                    <h2 className="text-[1.2rem] font-black tracking-[-0.03em] text-slate-900 sm:text-[1.3rem]">{subdomain.name}</h2>
                    <p className="mt-1 text-[12.5px] font-medium leading-5 text-slate-500">{subdomain.summary}</p>
                  </div>
                  <ul className="space-y-2 text-[13px] leading-[1.35rem] text-slate-600">
                    {subdomain.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-2.5">
                        <span
                          className="mt-1 inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full"
                          style={{ background: 'rgba(96,165,250,0.12)', color: '#2563EB' }}
                        >
                          <Check size={11} />
                        </span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-[11.5px]">
                    <span
                      className="rounded-full px-2.5 py-1.5 font-semibold"
                      style={{
                        border: '1px solid rgba(186, 209, 232, 0.8)',
                        background: '#F8FBFF',
                        color: '#52647A',
                      }}
                    >
                      {subdomain.difficulty}
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5"
                      style={{
                        background: 'linear-gradient(135deg, #4F8FF7, #3B82F6)',
                        border: '1px solid rgba(59,130,246,0.18)',
                        color: '#FFFFFF',
                        boxShadow: '0 8px 18px rgba(59,130,246,0.18)',
                      }}
                    >
                      <Clock3 size={13} />
                      Avg completion time: {subdomain.avgCompletionTime}
                    </span>
                  </div>
                  <div className="mt-auto pt-3">
                    <div
                      className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] font-semibold transition-all duration-300 group-hover:translate-x-1"
                      style={{
                        background: isSelected ? 'linear-gradient(135deg, #2563EB, #3B82F6)' : 'rgba(96,165,250,0.09)',
                        color: isSelected ? '#FFFFFF' : '#1D4ED8',
                        boxShadow: isSelected ? '0 12px 24px rgba(59,130,246,0.18)' : 'inset 0 0 0 1px rgba(96,165,250,0.12)',
                      }}
                    >
                      Start with this subdomain
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(226,238,250,0.55)] px-4 backdrop-blur-[6px]"
          >
            <motion.div
              initial={{ opacity: 0, y: 22, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[28px] p-7 shadow-[0_24px_70px_rgba(37,99,235,0.14)]"
              style={{
                background: 'linear-gradient(180deg, rgba(239,246,255,0.98) 0%, rgba(228,240,255,0.98) 100%)',
                border: '1px solid rgba(173,204,236,0.78)',
                boxShadow: '0 24px 70px rgba(30,41,59,0.14), inset 0 1px 0 rgba(255,255,255,0.9)',
              }}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-500">Confirm Selection</p>
                  <h3 className="mt-2 text-[2rem] font-black tracking-[-0.03em] text-slate-900">You selected {selected.name}</h3>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-full p-2 text-slate-500 transition hover:text-slate-700"
                  style={{
                    border: '1px solid rgba(186,209,232,0.9)',
                    background: 'rgba(255,255,255,0.85)',
                  }}
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-[15px] leading-7 text-slate-600">
                This will unlock 4 rounds tailored to {selected.summary}. You can update this later from your profile settings.
              </p>
              <div
                className="mt-5 rounded-2xl px-4 py-3 text-sm"
                style={{
                  background: 'rgba(239,246,255,0.92)',
                  border: '1px solid rgba(191,219,254,0.8)',
                  color: '#52647A',
                }}
              >
                Your assessment path, prompts, and scenarios will be personalized for this specialization.
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleConfirm}
                  disabled={saving}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #60A5FA, #3B82F6)',
                    boxShadow: '0 14px 28px rgba(59,130,246,0.22)',
                  }}
                >
                  {saving ? 'Saving...' : 'Confirm & Continue'}
                  <ArrowRight size={15} />
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-2xl px-5 py-3 text-sm font-semibold text-slate-600 transition hover:text-slate-800"
                  style={{
                    border: '1px solid rgba(186,209,232,0.9)',
                    background: 'rgba(255,255,255,0.72)',
                  }}
                >
                  Choose Different
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
