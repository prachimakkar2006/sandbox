import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useRecruiter } from '../../context/RecruiterContext';
import { Building2, ChevronRight } from 'lucide-react';
import Navbar from '../../components/Navbar';

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'E-commerce', 'EdTech', 'Consulting', 'Manufacturing', 'Other'];
const SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];
const DOMAINS = ['DSA', 'Web Dev', 'AI/ML', 'Data Science', 'System Design', 'CS Fundamentals'];
const ROLE_TYPES = ['Intern', 'Full-time', 'Contract', 'Part-time'];

export default function RecruiterOnboarding({ onComplete }) {
  const { updateRecruiter } = useRecruiter();
  const [form, setForm] = useState({ companyName: '', industry: '', size: '', domains: [], roleTypes: [], linkedinUrl: '', designation: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggle = (key, val) => setForm(f => ({ ...f, [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName) return setError('Company name is required.');
    setLoading(true); setError('');
    try {
      const { data } = await axios.post('/api/recruiter/onboarding', form);
      updateRecruiter({ ...data, onboardingComplete: true });
      onComplete();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save. Try again.');
    } finally { setLoading(false); }
  };

  const inputCls = "w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors";

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <div className="flex items-center justify-center px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <Building2 size={24} className="text-primary" />
            </div>
            <h2 className="text-2xl font-black text-white">Set Up Your Company</h2>
            <p className="text-text-secondary text-sm mt-1">Tell us about your company to get started</p>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-2xl p-7 shadow-sm">
            {error && <div className="mb-4 px-3 py-2.5 bg-danger/10 border border-danger/20 rounded-xl text-danger text-xs">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-text-secondary mb-1.5 block">Company Name *</label>
                <input type="text" value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
                  placeholder="e.g. Zepto, PhonePe, Swiggy" className={inputCls} required />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1.5 block">Your Designation</label>
                <input type="text" value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
                  placeholder="e.g. Senior Recruiter, HR Manager" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-secondary mb-1.5 block">Industry</label>
                  <select value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} className={inputCls}>
                    <option value="">Select...</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-secondary mb-1.5 block">Company Size</label>
                  <select value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} className={inputCls}>
                    <option value="">Select...</option>
                    {SIZES.map(s => <option key={s} value={s}>{s} employees</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-2 block">Domains You Hire For</label>
                <div className="flex flex-wrap gap-2">
                  {DOMAINS.map(d => (
                    <button type="button" key={d} onClick={() => toggle('domains', d)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.domains.includes(d) ? 'bg-primary/10 text-primary border-primary/30' : 'border-dark-border text-text-secondary hover:border-primary/30'}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-2 block">Hiring Role Types</label>
                <div className="flex flex-wrap gap-2">
                  {ROLE_TYPES.map(r => (
                    <button type="button" key={r} onClick={() => toggle('roleTypes', r)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.roleTypes.includes(r) ? 'bg-secondary/10 text-secondary border-secondary/30' : 'border-dark-border text-text-secondary hover:border-secondary/30'}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1.5 block">LinkedIn Company URL (optional)</label>
                <input type="url" value={form.linkedinUrl} onChange={e => setForm(f => ({ ...f, linkedinUrl: e.target.value }))}
                  placeholder="https://linkedin.com/company/..." className={inputCls} />
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-secondary to-primary text-dark-card rounded-xl font-semibold text-sm disabled:opacity-60 mt-2">
                {loading ? <span className="w-4 h-4 border-2 border-dark-card border-t-transparent rounded-full animate-spin" />
                  : <>Go to Dashboard <ChevronRight size={16} /></>}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
