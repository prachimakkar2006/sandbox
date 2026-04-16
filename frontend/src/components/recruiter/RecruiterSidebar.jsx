import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Users, BarChart2, Settings, LogOut, Menu, X } from 'lucide-react';
import BrandLogo from '../BrandLogo';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/recruiter/dashboard' },
  { icon: ClipboardList, label: 'My Assessments', path: '/recruiter/assessments' },
  { icon: Users, label: 'Talent Pool', path: '/recruiter/talent-pool' },
  { icon: BarChart2, label: 'Analytics', path: '/recruiter/analytics' },
  { icon: Settings, label: 'Settings', path: '/recruiter/settings' }
];

export default function RecruiterSidebar({ recruiter, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="border-b border-sky-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-100 bg-white shadow-[0_10px_24px_rgba(59,130,246,0.12)]">
            <BrandLogo size={30} />
          </div>
          <span className="text-[1.55rem] font-bold tracking-[-0.02em] text-slate-800">
            era<span className="text-sky-500">AI</span>
          </span>
        </div>
        <p className="mt-1 text-[15px] font-medium tracking-[0.01em] text-slate-500">Recruiter Portal</p>
      </div>

      <div className="border-b border-sky-100 px-6 py-4">
        <div className="flex items-center gap-4">
          {recruiter?.avatar ? (
            <img src={recruiter.avatar} alt={recruiter.name} className="h-11 w-11 rounded-full border border-sky-100 object-cover" />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-600">
              {recruiter?.name?.charAt(0) || 'R'}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-slate-800">{recruiter?.name}</p>
            <p className="truncate text-sm text-slate-500">
              {recruiter?.company?.name || recruiter?.designation || 'Recruiter'}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 px-4 py-4">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;

          return (
            <motion.button
              key={path}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                navigate(path);
                setMobileOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-[15px] font-medium transition-all ${
                active
                  ? 'border-sky-200 bg-gradient-to-r from-sky-50 to-[#f4faff] text-sky-700 shadow-[0_10px_20px_rgba(14,165,233,0.08)]'
                  : 'border-transparent text-slate-600 hover:border-sky-100 hover:bg-[#fdfefe] hover:text-slate-900'
              }`}
            >
              <Icon size={18} />
              {label}
            </motion.button>
          );
        })}
      </nav>

      <div className="border-t border-sky-100 px-4 py-4">
        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[15px] font-medium text-red-500 transition-all hover:bg-red-50"
        >
          <LogOut size={18} />
          Logout
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-[290px] flex-col border-r border-sky-100 bg-[#f7fbff] shadow-[0_12px_30px_rgba(15,23,42,0.04)] lg:flex">
        <SidebarContent />
      </aside>

      <div className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-sky-100 bg-[#f7fbff]/95 px-4 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-100 bg-white shadow-[0_8px_18px_rgba(59,130,246,0.1)]">
            <BrandLogo size={25} />
          </div>
          <span className="text-lg font-bold tracking-[-0.02em] text-slate-800">
            era<span className="text-sky-500">AI</span>
          </span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="text-slate-500 hover:text-slate-900">
          <Menu size={20} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/30 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -325 }}
              animate={{ x: 0 }}
              exit={{ x: -325 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 z-50 h-full w-[290px] border-r border-sky-100 bg-[#f7fbff] lg:hidden"
            >
              <button onClick={() => setMobileOpen(false)} className="absolute right-4 top-4 text-slate-400">
                <X size={18} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
