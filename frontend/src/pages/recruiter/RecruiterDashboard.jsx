import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, ClipboardList, TrendingUp, Star, Clock3, PlusCircle, Eye, Download } from 'lucide-react';
import RecruiterSidebar from '../../components/recruiter/RecruiterSidebar';
import StatsCard from '../../components/recruiter/StatsCard';
import { useRecruiter } from '../../context/RecruiterContext';

const Skeleton = ({ className }) => <div className={`animate-pulse rounded-3xl bg-slate-200/80 ${className}`} />;

const formatScoreTone = (score) => {
  if (score >= 80) return 'bg-emerald-50 text-emerald-600';
  if (score >= 60) return 'bg-amber-50 text-amber-600';
  return 'bg-rose-50 text-rose-500';
};

export default function RecruiterDashboard() {
  const { recruiter, logout, getAuthConfig } = useRecruiter();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportingCsv, setExportingCsv] = useState(false);

  useEffect(() => {
    axios.get('/api/recruiter/dashboard', getAuthConfig())
      .then((response) => setData(response.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [getAuthConfig]);

  const exportCandidatesCsv = async () => {
    setExportingCsv(true);
    try {
      const { data: response } = await axios.get('/api/recruiter/students', {
        params: { limit: 5000 },
        ...getAuthConfig()
      });

      const students = response?.students || [];
      const headers = ['Name', 'Email', 'College', 'Stream', 'Tier', 'Overall Score', 'Rounds Completed', 'Badges'];
      const escapeCsv = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
      const rows = students.map((student) => ([
        student.name,
        student.email,
        student.college,
        student.stream,
        student.tier,
        student.scores?.overall ?? 0,
        student.roundsCompleted?.length ?? 0,
        (student.badges || []).join('; ')
      ].map(escapeCsv).join(',')));

      const csv = [headers.map(escapeCsv).join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'eraai-recruiter-candidates.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV export failed:', error);
    } finally {
      setExportingCsv(false);
    }
  };

  const stats = data?.stats || {};
  const recentActivity = data?.recentActivity || [];
  const topPerformers = data?.topPerformers || [];
  const welcomeLine = [recruiter?.name, recruiter?.company?.name].filter(Boolean).join(' · ');

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#edf5ff_48%,#f4f9ff_100%)]">
      <RecruiterSidebar recruiter={recruiter} onLogout={logout} />
      <main className="min-h-screen pt-14 lg:ml-[290px] lg:pt-0">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-[2.15rem] font-bold tracking-[-0.03em] text-slate-900">Overview</h1>
                <p className="mt-1.5 text-base text-slate-600">
                  {welcomeLine ? `Welcome back, ${welcomeLine}` : 'Welcome back'}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={exportCandidatesCsv}
                disabled={exportingCsv}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-[#fdfefe] px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition hover:bg-[#f7fbff] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download size={16} />
                {exportingCsv ? 'Exporting CSV...' : 'Export CSV'}
              </motion.button>
            </div>
          </motion.div>

          <div className="mb-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {loading ? (
              [0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-28" />)
            ) : (
              <>
                <StatsCard icon={<Users size={22} />} label="Total Candidates" value={stats.totalCandidates ?? 0} color="blue" delay={0} />
                <StatsCard icon={<ClipboardList size={22} />} label="Assessments" value={stats.assessmentsCreated ?? 0} color="purple" delay={0.05} />
                <StatsCard icon={<TrendingUp size={22} />} label="Average Score" value={`${stats.avgScore ?? 0}%`} color="green" delay={0.1} />
                <StatsCard icon={<Star size={22} />} label="Shortlisted" value={stats.shortlisted ?? 0} color="orange" delay={0.15} />
              </>
            )}
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)]">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[26px] border border-sky-100 bg-[#fcfeff] px-6 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
            >
              <h2 className="flex items-center gap-2.5 text-xl font-bold tracking-[-0.02em] text-slate-900">
                <Clock3 size={20} className="text-sky-500" />
                Recent Activity
              </h2>

              {loading ? (
                <div className="mt-8 space-y-4">
                  {[0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-16" />)}
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="mt-6 space-y-3">
                  {recentActivity.map((item, index) => (
                    <motion.div
                      key={`${item._id || item.studentId?._id || index}`}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                    className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-slate-50/55 px-4 py-3"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">
                        {item.studentId?.name?.charAt(0) || '?'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {item.studentId?.name || 'Unknown candidate'}
                        </p>
                        <p className="truncate text-sm text-slate-500">
                          Completed {item.assessmentId?.title || 'an assessment'} · Score: {item.overallScore ?? 0}%
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${formatScoreTone(item.overallScore ?? 0)}`}>
                        {item.overallScore ?? 0}%
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                  <p className="text-2xl font-semibold text-slate-500">No recent activity yet.</p>
                  <p className="mt-2 text-base text-slate-400">Create an assessment to start tracking candidates.</p>
                </div>
              )}
            </motion.section>

            <div className="space-y-7">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
                className="rounded-[26px] border border-sky-100 bg-[#fcfeff] px-5 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
              >
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">Quick Actions</h2>
                <div className="mt-5 space-y-3">
                  {[
                    {
                      icon: <PlusCircle size={18} />,
                      label: 'Create Assessment',
                      tone: 'border-sky-200 bg-sky-50 text-sky-600 hover:bg-sky-100',
                      onClick: () => navigate('/recruiter/assessments/create')
                    },
                    {
                      icon: <Eye size={18} />,
                      label: 'View Talent Pool',
                      tone: 'border-violet-200 bg-violet-50 text-violet-600 hover:bg-violet-100',
                      onClick: () => navigate('/recruiter/talent-pool')
                    },
                    {
                      icon: <Download size={18} />,
                      label: 'Export Shortlist',
                      tone: 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100',
                      onClick: () => window.open('/api/recruiter/export/shortlist', '_blank')
                    }
                  ].map(({ icon, label, tone, onClick }) => (
                    <motion.button
                      key={label}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={onClick}
                      className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-[15px] font-medium transition ${tone}`}
                    >
                      {icon}
                      <span>{label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="rounded-[26px] border border-sky-100 bg-[#fcfeff] px-5 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
              >
                <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-900">Top Performers</h2>
                {loading ? (
                  <div className="mt-6 space-y-3">
                    {[0, 1, 2].map((item) => <Skeleton key={item} className="h-16" />)}
                  </div>
                ) : topPerformers.length > 0 ? (
                  <div className="mt-6 space-y-3">
                    {topPerformers.map((performer, index) => (
                      <div key={`${performer._id || performer.studentId?._id || index}`} className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-slate-50/60 px-4 py-3">
                        <span className="w-7 text-sm font-semibold text-slate-400">#{index + 1}</span>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                          {performer.studentId?.name?.charAt(0) || '?'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900">{performer.studentId?.name || 'Unknown candidate'}</p>
                          <p className="truncate text-sm text-slate-500">{performer.studentId?.stream || 'No stream'}</p>
                        </div>
                        <span className="text-sm font-bold text-emerald-600">{performer.overallScore ?? 0}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[160px] items-center justify-center text-center text-base text-slate-400">
                    No performers yet.
                  </div>
                )}
              </motion.section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
