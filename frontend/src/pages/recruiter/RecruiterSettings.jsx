import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import RecruiterSidebar from '../../components/recruiter/RecruiterSidebar';
import { useRecruiter } from '../../context/RecruiterContext';
import { Save } from 'lucide-react';

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'E-commerce', 'EdTech', 'Consulting', 'Manufacturing', 'Other'];
const SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];
const DOMAINS = ['DSA', 'Web Dev', 'AI/ML', 'Data Science', 'System Design', 'CS Fundamentals'];

const inputCls = 'w-full rounded-2xl border border-sky-100 bg-[#f8fbff] px-4 py-3 text-[15px] font-medium text-slate-700 placeholder:text-slate-400 transition-colors focus:border-sky-300 focus:outline-none';
const labelCls = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500';

export default function RecruiterSettings() {
  const { recruiter, logout, updateRecruiter } = useRecruiter();
  const [form, setForm] = useState({
    companyName: recruiter?.company?.name || '',
    industry: recruiter?.company?.industry || '',
    size: recruiter?.company?.size || '',
    domains: recruiter?.company?.domains || [],
    roleTypes: recruiter?.company?.roleTypes || [],
    linkedinUrl: recruiter?.company?.linkedinUrl || '',
    designation: recruiter?.designation || ''
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const toggle = (key, val) => setForm((f) => ({
    ...f,
    [key]: f[key].includes(val) ? f[key].filter((x) => x !== val) : [...f[key], val]
  }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await axios.put('/api/recruiter/settings', form);
      updateRecruiter(data);
      showToast('Settings saved!');
    } catch {
      showToast('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#edf5ff_48%,#f4f9ff_100%)] text-slate-900">
      <RecruiterSidebar recruiter={recruiter} onLogout={logout} />

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-5 right-5 z-50 rounded-2xl border border-sky-100 bg-[#fcfeff] px-4 py-2.5 text-sm font-medium text-slate-700 shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
        >
          {toast}
        </motion.div>
      )}

      <main className="min-h-screen pt-14 lg:ml-[290px] lg:pt-0">
        <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-[2.1rem] font-extrabold tracking-[-0.02em] text-slate-900">Settings</h1>
              <p className="mt-1 text-[15px] font-medium text-slate-500">Manage your company profile and recruiter preferences</p>
            </div>
            <div className="inline-flex w-fit items-center rounded-full border border-sky-100 bg-[#fcfeff] px-4 py-2 text-[14px] font-medium text-slate-600 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
              Keep your hiring profile polished and up to date
            </div>
          </div>

          <div className="mb-5 rounded-[28px] border border-sky-100 bg-[#fcfeff] p-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
            <div className="mb-6 flex items-center gap-4">
              {recruiter?.avatar ? (
                <img src={recruiter.avatar} alt={recruiter.name} className="h-14 w-14 rounded-full border border-sky-100 object-cover" />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-xl font-black text-white shadow-[0_10px_20px_rgba(14,165,233,0.22)]">
                  {recruiter?.name?.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-[1.85rem] font-bold leading-none tracking-[-0.03em] text-slate-900">{recruiter?.name}</p>
                <p className="mt-1 text-[15px] font-medium text-slate-500">{recruiter?.email}</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className={labelCls}>Company Name</label>
                  <input
                    className={inputCls}
                    value={form.companyName}
                    onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className={labelCls}>Your Designation</label>
                  <input
                    className={inputCls}
                    value={form.designation}
                    onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                    placeholder="Senior Recruiter"
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className={labelCls}>Industry</label>
                  <select className={inputCls} value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}>
                    <option value="">Select...</option>
                    {INDUSTRIES.map((industry) => <option key={industry} value={industry}>{industry}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Company Size</label>
                  <select className={inputCls} value={form.size} onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}>
                    <option value="">Select...</option>
                    {SIZES.map((size) => <option key={size} value={size}>{size} employees</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Domains You Hire For</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {DOMAINS.map((domain) => (
                    <button
                      type="button"
                      key={domain}
                      onClick={() => toggle('domains', domain)}
                      className={`rounded-full border px-3.5 py-2 text-[13px] font-medium leading-none transition-all ${
                        form.domains.includes(domain)
                          ? 'border-sky-200 bg-sky-50 text-sky-700 shadow-[0_4px_12px_rgba(14,165,233,0.08)]'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-sky-200 hover:bg-white hover:text-slate-700'
                      }`}
                    >
                      {domain}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls}>LinkedIn Company URL</label>
                <input
                  type="url"
                  className={inputCls}
                  value={form.linkedinUrl}
                  onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))}
                  placeholder="https://linkedin.com/company/..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-500 to-blue-500 px-5 py-3 text-[15px] font-semibold text-white shadow-[0_12px_22px_rgba(14,165,233,0.18)] transition hover:shadow-[0_14px_26px_rgba(14,165,233,0.22)] disabled:opacity-60"
              >
                {saving ? <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Save size={15} />}
                Save Changes
              </motion.button>
            </form>
          </div>

          <div className="mb-5 rounded-[28px] border border-sky-100 bg-[#fcfeff] p-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
            <h2 className="mb-4 text-[1.9rem] font-bold tracking-[-0.03em] text-slate-900">Plan</h2>
            <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-semibold ${recruiter?.plan === 'pro' ? 'border-amber-200 bg-amber-50 text-amber-600' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
              {recruiter?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
            </div>
            <div className="grid gap-3 text-sm md:grid-cols-2">
              {[
                ['Assessments', recruiter?.plan === 'pro' ? 'Unlimited' : 'Up to 3', true],
                ['Talent Pool Access', 'Full', true],
                ['AI Candidate Summary', recruiter?.plan === 'pro' ? 'Included' : 'Upgrade Required', recruiter?.plan === 'pro'],
                ['CSV Export', 'Included', true],
                ['Priority Support', recruiter?.plan === 'pro' ? 'Included' : 'Upgrade Required', recruiter?.plan === 'pro']
              ].map(([feature, value, enabled]) => (
                <div key={feature} className="flex items-center justify-between rounded-2xl border border-sky-100 bg-[#f8fbff] px-4 py-3">
                  <span className="text-[15px] font-medium text-slate-600">{feature}</span>
                  <span className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-rose-200 bg-[#fff8f8] p-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
            <h2 className="mb-2 text-[1.9rem] font-bold tracking-[-0.03em] text-rose-500">Danger Zone</h2>
            <p className="mb-4 text-[15px] font-medium text-rose-400">These actions affect your current recruiter session. Be careful.</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { if (window.confirm('Logout from eraAI Recruiter Portal?')) logout(); }}
              className="rounded-2xl border border-rose-200 bg-white px-5 py-3 text-[15px] font-semibold text-rose-500 transition-all hover:bg-rose-50"
            >
              Logout
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  );
}
