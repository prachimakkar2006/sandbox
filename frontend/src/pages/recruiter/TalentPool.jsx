import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Filter, Mail, Search } from 'lucide-react';
import RecruiterSidebar from '../../components/recruiter/RecruiterSidebar';
import StudentCard from '../../components/recruiter/StudentCard';
import StudentProfileModal from '../../components/recruiter/StudentProfileModal';
import { useRecruiter } from '../../context/RecruiterContext';

const STREAMS = ['DSA', 'AI/ML', 'Web Dev', 'CS Fundamentals'];

export default function TalentPool() {
  const { recruiter, logout, getAuthConfig } = useRecruiter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [emailingShortlist, setEmailingShortlist] = useState(false);
  const [filters, setFilters] = useState({ stream: '', minScore: '', maxScore: '', roundsCompleted: '', sort: 'score' });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 18, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '')) };
      const { data } = await axios.get('/api/recruiter/talent-pool', { params, ...getAuthConfig() });
      setStudents(data.students || []);
      setTotal(data.total || 0);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to load talent pool.');
    }
    setLoading(false);
  }, [filters, page, getAuthConfig]);

  useEffect(() => { load(); }, [load]);

  const handleShortlist = async (id, isSaved) => {
    try {
      if (isSaved) {
        await axios.delete(`/api/recruiter/shortlist/${id}`, getAuthConfig());
        showToast('Removed from shortlist.');
      } else {
        await axios.post(`/api/recruiter/shortlist/${id}`, {}, getAuthConfig());
        showToast('Student shortlisted!');
      }
      setStudents(s => s.map(st => st._id === id ? { ...st, isSaved: !isSaved } : st));
      if (selected?._id === id) setSelected(s => ({ ...s, isSaved: !isSaved }));
    } catch { showToast('Action failed.'); }
  };

  const handleView = async (student) => {
    try {
      const { data } = await axios.get(`/api/recruiter/talent-pool/${student._id}`, getAuthConfig());
      setSelected(data);
    } catch {
      setSelected(student);
    }
  };

  const setF = (k, v) => { setFilters(f => ({ ...f, [k]: v })); setPage(1); };
  const clearFilters = () => { setFilters({ stream: '', minScore: '', maxScore: '', roundsCompleted: '', sort: 'score' }); setPage(1); };

  const handleEmailShortlisted = async () => {
    setEmailingShortlist(true);
    try {
      const { data } = await axios.post('/api/recruiter/shortlist/email', {}, getAuthConfig());
      showToast(data?.message || 'Shortlist emails sent.');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to send shortlist emails.');
    } finally {
      setEmailingShortlist(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#edf5ff_48%,#f4f9ff_100%)] text-slate-900">
      <RecruiterSidebar recruiter={recruiter} onLogout={logout} />

      {toast && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="fixed top-5 right-5 z-50 rounded-2xl border border-sky-100 bg-[#fcfeff] px-4 py-2.5 text-sm text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
          {toast}
        </motion.div>
      )}

      <main className="min-h-screen pt-14 lg:ml-[290px] lg:pt-0">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Talent Pool</h1>
              <p className="mt-1 text-sm text-slate-500">{total} verified students</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleEmailShortlisted}
                disabled={emailingShortlist}
                className="inline-flex items-center gap-2 rounded-2xl border border-sky-200 bg-[#fcfeff] px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Mail size={15} />
                {emailingShortlist ? 'Sending...' : 'Email Shortlisted'}
              </button>
              <div className="inline-flex w-fit items-center rounded-full border border-sky-100 bg-[#fcfeff] px-4 py-2 text-sm font-medium text-slate-600 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
                Filters update live as you refine the pool
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-[26px] border border-sky-100 bg-[#fcfeff] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                <Filter size={15} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Filter candidates</p>
                <p className="text-xs text-slate-500">Search by stream, score range, progress, and sort order</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select className="rounded-xl border border-sky-100 bg-[#f8fbff] px-3 py-2 text-sm text-slate-700 focus:border-sky-300 focus:outline-none"
                value={filters.stream} onChange={e => setF('stream', e.target.value)}>
                <option value="">All Streams</option>
                {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input type="number" placeholder="Min Score" min={0} max={100} value={filters.minScore}
                onChange={e => setF('minScore', e.target.value)}
                className="w-28 rounded-xl border border-sky-100 bg-[#f8fbff] px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-sky-300 focus:outline-none" />
              <input type="number" placeholder="Max Score" min={0} max={100} value={filters.maxScore}
                onChange={e => setF('maxScore', e.target.value)}
                className="w-28 rounded-xl border border-sky-100 bg-[#f8fbff] px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-sky-300 focus:outline-none" />
              <select className="rounded-xl border border-sky-100 bg-[#f8fbff] px-3 py-2 text-sm text-slate-700 focus:border-sky-300 focus:outline-none"
                value={filters.roundsCompleted} onChange={e => setF('roundsCompleted', e.target.value)}>
                <option value="">All Rounds</option>
                {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} round{n > 1 ? 's' : ''} completed</option>)}
              </select>
              <select className="rounded-xl border border-sky-100 bg-[#f8fbff] px-3 py-2 text-sm text-slate-700 focus:border-sky-300 focus:outline-none"
                value={filters.sort} onChange={e => setF('sort', e.target.value)}>
                <option value="score">Sort: Score</option>
                <option value="recent">Sort: Recent</option>
                <option value="name">Sort: Name</option>
              </select>
              {Object.entries(filters).some(([k, v]) => k !== 'sort' && v) && (
                <button onClick={clearFilters} className="text-sm font-medium text-red-500 transition hover:text-red-600">Clear filters</button>
              )}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-52 animate-pulse rounded-[24px] border border-sky-100 bg-[#fcfeff] shadow-[0_10px_24px_rgba(15,23,42,0.05)]" />
              ))}
            </div>
          ) : students.length === 0 ? (
            <div className="rounded-[28px] border border-sky-100 bg-[#fcfeff] py-20 text-center shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50">
                <Search size={24} className="text-slate-400" />
              </div>
              <p className="mb-1 font-bold text-slate-800">No students found</p>
              <p className="text-sm text-slate-500">Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {students.map((s, i) => (
                  <StudentCard key={s._id} student={s} onView={handleView} onShortlist={handleShortlist} delay={i * 0.03} />
                ))}
              </div>
              {/* Pagination */}
              <div className="flex justify-center gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="rounded-xl border border-sky-100 px-4 py-2 text-sm text-slate-500 transition-all hover:border-sky-200 hover:bg-[#f8fbff] hover:text-slate-800 disabled:opacity-40">
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-slate-500">Page {page}</span>
                <button disabled={students.length < 18} onClick={() => setPage(p => p + 1)}
                  className="rounded-xl border border-sky-100 px-4 py-2 text-sm text-slate-500 transition-all hover:border-sky-200 hover:bg-[#f8fbff] hover:text-slate-800 disabled:opacity-40">
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {selected && (
        <StudentProfileModal
          student={selected}
          onClose={() => setSelected(null)}
          onShortlist={handleShortlist}
        />
      )}
    </div>
  );
}
