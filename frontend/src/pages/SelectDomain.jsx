import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DOMAIN_CATALOG } from '../data/domainCatalog';

const progressItems = [
  { label: 'Profile', done: true },
  { label: 'Domain', done: false, active: true },
  { label: 'Subdomain', done: false },
  { label: 'Start', done: false },
];

export default function SelectDomain() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('');

  const cards = useMemo(() => DOMAIN_CATALOG, []);

  const darkCardThemes = {
    engineering: {
      border: '#D6EAFB',
      glow: 'rgba(107, 183, 255, 0.12)',
      accent: '#73BFFF',
      borderGradient: 'linear-gradient(135deg, #8FD3FF, #C7E8FF)',
      iconBg: 'linear-gradient(135deg, rgba(115,191,255,0.16), rgba(115,191,255,0.07))',
    },
    design: {
      border: '#E1E6FC',
      glow: 'rgba(150, 178, 255, 0.10)',
      accent: '#92BAFF',
      borderGradient: 'linear-gradient(135deg, #B7C8FF, #E0E7FF)',
      iconBg: 'linear-gradient(135deg, rgba(146,186,255,0.15), rgba(146,186,255,0.06))',
    },
    business: {
      border: '#DAF2F3',
      glow: 'rgba(115, 210, 219, 0.10)',
      accent: '#7DD2DC',
      borderGradient: 'linear-gradient(135deg, #97E3EA, #DDF7F8)',
      iconBg: 'linear-gradient(135deg, rgba(125,210,220,0.15), rgba(125,210,220,0.06))',
    },
    'data-cloud': {
      border: '#D8ECF9',
      glow: 'rgba(116, 198, 238, 0.10)',
      accent: '#7AC9F1',
      borderGradient: 'linear-gradient(135deg, #95D8F8, #D7F1FF)',
      iconBg: 'linear-gradient(135deg, rgba(122,201,241,0.15), rgba(122,201,241,0.06))',
    },
    'science-healthcare': {
      border: '#E4EDF8',
      glow: 'rgba(167, 205, 239, 0.09)',
      accent: '#A8D0FF',
      borderGradient: 'linear-gradient(135deg, #B8DAFF, #EEF6FF)',
      iconBg: 'linear-gradient(135deg, rgba(168,208,255,0.14), rgba(168,208,255,0.05))',
    },
    'arts-humanities': {
      border: '#E7EAF8',
      glow: 'rgba(173, 198, 240, 0.09)',
      accent: '#A8CBFA',
      borderGradient: 'linear-gradient(135deg, #BCD6FF, #EEF4FF)',
      iconBg: 'linear-gradient(135deg, rgba(168,203,250,0.14), rgba(168,203,250,0.05))',
    },
  };

  const handleSelect = (domainSlug) => {
    setSelected(domainSlug);
    sessionStorage.setItem('ciq_preselected_domain', domainSlug);
    window.setTimeout(() => navigate(`/select-subdomain/${domainSlug}`), 180);
  };

  return (
    <div
      className="min-h-screen px-4 py-8 sm:px-6 lg:px-8"
      style={{
        color: '#1E293B',
        background: 'linear-gradient(180deg, #E4F2FF 0%, #CEE6FB 100%)',
      }}
    >
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate(-1)}
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

        <div className="mb-8 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em]" style={{ color: '#3B82F6' }}>Domain Selection</p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl" style={{ color: '#0F172A' }}>Choose your domain</h1>
          <p className="mt-3 text-lg leading-8" style={{ color: '#64748B' }}>We&apos;ll tailor every question to your specific domain.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((domain, index) => (
            <motion.button
              key={domain.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
              whileHover={{
                y: -8,
                scale: 1.01,
                boxShadow: `0 22px 46px rgba(2,6,23,0.42), 0 0 0 1px ${darkCardThemes[domain.slug]?.accent}, 0 0 28px ${darkCardThemes[domain.slug]?.glow}`,
              }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleSelect(domain.slug)}
              className="group relative overflow-hidden rounded-[26px] p-5 text-left transition-all duration-300"
              style={{
                border: '1px solid transparent',
                background: `linear-gradient(#FFFFFF, #FFFFFF) padding-box, ${darkCardThemes[domain.slug]?.borderGradient} border-box`,
                transform: selected === domain.slug ? 'scale(1.02)' : undefined,
                boxShadow: selected === domain.slug
                  ? `0 18px 40px rgba(30,41,59,0.12), 0 0 22px ${darkCardThemes[domain.slug]?.glow}`
                  : '0 12px 28px rgba(30,41,59,0.10)',
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-24 opacity-90"
                style={{ background: `linear-gradient(180deg, ${darkCardThemes[domain.slug]?.glow} 0%, rgba(255,255,255,0) 100%)` }}
              />
              <div
                className="absolute inset-x-0 top-0 h-[3px]"
                style={{ background: `linear-gradient(90deg, ${darkCardThemes[domain.slug]?.accent}, rgba(255,255,255,0.35))` }}
              />
              <div className="relative">
                <div
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[18px] text-[30px]"
                  style={{
                    background: darkCardThemes[domain.slug]?.iconBg,
                    border: `1px solid ${darkCardThemes[domain.slug]?.border}`,
                  }}
                >
                  <span aria-hidden="true">{domain.emoji}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[1.45rem] font-black tracking-[-0.02em]" style={{ color: '#10233D' }}>
                      {domain.name === 'Business (BBA)' ? 'Business' : domain.name}
                    </h2>
                    <p className="mt-1 text-sm" style={{ color: '#64748B' }}>{domain.subdomains.length} subdomains available</p>
                  </div>
                  <span className="mt-1 transition duration-300 group-hover:translate-x-1.5" style={{ color: darkCardThemes[domain.slug]?.accent }}>
                    <ArrowRight size={18} />
                  </span>
                </div>
                <p className="mt-3 text-[14px] leading-6" style={{ color: '#475569' }}>
                  {domain.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {domain.subdomains.map((subdomain) => (
                    <span
                      key={subdomain.name}
                      className="rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all duration-300 group-hover:-translate-y-0.5"
                      style={{
                        border: '1px solid rgba(186, 209, 232, 0.8)',
                        background: '#F8FBFF',
                        color: '#52647A',
                      }}
                    >
                      {subdomain.name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
