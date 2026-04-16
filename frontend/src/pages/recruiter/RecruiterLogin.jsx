import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { useRecruiter } from '../../context/RecruiterContext';
import Navbar from '../../components/Navbar';
import BrandLogo from '../../components/BrandLogo';

export default function RecruiterLogin({ onSuccess }) {
  const { login, register, googleLogin } = useRecruiter();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '', designation: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      await googleLogin(credentialResponse.credential);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full rounded-2xl border border-sky-100 bg-[#f8fbff] px-4 py-3 text-[15px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-sky-300 transition-colors';

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#edf5ff_48%,#f4f9ff_100%)] text-slate-900">
      <Navbar />
      <div className="flex items-center justify-center px-4 pb-12 pt-24">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[22px] border border-sky-100 bg-white shadow-[0_14px_30px_rgba(59,130,246,0.14)]">
              <BrandLogo size={42} />
            </div>
            <h2 className="text-[2rem] font-bold tracking-[-0.03em] text-slate-900">
              {mode === 'login' ? 'Recruiter Login' : 'Join as Recruiter'}
            </h2>
            <p className="mt-1 text-[15px] font-medium text-slate-500">Access India&apos;s verified AI talent pool</p>
          </div>

          <div className="rounded-[28px] border border-sky-100 bg-[#fcfeff] p-7 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
            <div className="mb-6 flex rounded-2xl border border-sky-100 bg-[#f8fbff] p-1">
              {['login', 'register'].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setError('');
                  }}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all ${
                    mode === m ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {m === 'login' ? 'Login' : 'Register'}
                </button>
              ))}
            </div>

            {error && <div className="mb-4 rounded-2xl border border-danger/20 bg-danger/10 px-3 py-2.5 text-xs text-danger">{error}</div>}

            <div className="mb-4 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogle}
                onError={() => setError('Google sign-in failed.')}
                theme="outline"
                size="large"
                text={mode === 'login' ? 'signin_with' : 'signup_with'}
                shape="rectangular"
              />
            </div>

            <div className="mb-4 flex items-center gap-3">
              <div className="flex-1 h-px bg-sky-100" />
              <span className="text-xs text-slate-400">or with email</span>
              <div className="flex-1 h-px bg-sky-100" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'register' && (
                <>
                  <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} required minLength={2} />
                  <input type="text" placeholder="Company Name" value={form.company} onChange={(e) => set('company', e.target.value)} className={inputCls} />
                  <input type="text" placeholder="Your Designation" value={form.designation} onChange={(e) => set('designation', e.target.value)} className={inputCls} />
                </>
              )}
              <input type="email" placeholder="Work Email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} required />
              <input type="password" placeholder="Password" value={form.password} onChange={(e) => set('password', e.target.value)} className={inputCls} required minLength={6} />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(14,165,233,0.18)] disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Loading...
                  </span>
                ) : mode === 'login' ? 'Access Dashboard' : 'Create Account'}
              </motion.button>
            </form>

            <p className="mt-4 text-center text-xs text-slate-500">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError('');
                }}
                className="text-sky-600 hover:underline"
              >
                {mode === 'login' ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
