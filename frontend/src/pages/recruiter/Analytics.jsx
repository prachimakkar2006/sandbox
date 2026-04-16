import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import RecruiterSidebar from '../../components/recruiter/RecruiterSidebar';
import { useRecruiter } from '../../context/RecruiterContext';
import { BarChart2 } from 'lucide-react';

const COLORS = ['#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B', '#F97316'];

const tooltipStyle = {
  contentStyle: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 16,
    color: '#0F172A',
    fontSize: 12,
    boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)'
  },
  cursor: { fill: 'rgba(14, 165, 233, 0.08)' },
  labelStyle: { color: '#334155', fontWeight: 600 }
};

export default function Analytics() {
  const { recruiter, logout } = useRecruiter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/recruiter/analytics')
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const ChartCard = ({ title, children, className = '' }) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-[26px] border border-sky-100 bg-[#fcfeff] p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)] ${className}`}
    >
      <h3 className="text-base font-extrabold text-slate-900">{title}</h3>
      {loading ? (
        <div className="mt-5 h-48 animate-pulse rounded-3xl bg-slate-200/80" />
      ) : children}
    </motion.div>
  );

  if (!loading && (!data || data.total === 0)) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#edf5ff_48%,#f4f9ff_100%)] text-slate-900">
        <RecruiterSidebar recruiter={recruiter} onLogout={logout} />
        <main className="min-h-screen pt-14 lg:ml-[290px] lg:pt-0">
          <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            <div className="mb-6">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Analytics</h1>
              <p className="mt-1 text-sm text-slate-500">Insights about your assessments and talent pool</p>
            </div>
            <div className="rounded-[28px] border border-sky-100 bg-[#fcfeff] px-6 py-20 text-center shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50">
                <BarChart2 size={24} className="text-slate-400" />
              </div>
              <p className="mb-1 text-lg font-bold text-slate-900">No analytics data yet</p>
              <p className="text-sm text-slate-500">Analytics will appear once candidates complete your assessments.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#edf5ff_48%,#f4f9ff_100%)] text-slate-900">
      <RecruiterSidebar recruiter={recruiter} onLogout={logout} />
      <main className="min-h-screen pt-14 lg:ml-[290px] lg:pt-0">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Analytics</h1>
            <p className="mt-1 text-sm text-slate-500">Insights about your assessments and talent pool</p>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: 'Total Candidates', value: data?.total ?? 0, tone: 'text-sky-600', accent: 'bg-sky-50 border-sky-200' },
              { label: 'Passed', value: data?.passed ?? 0, tone: 'text-emerald-600', accent: 'bg-emerald-50 border-emerald-200' },
              { label: 'Failed', value: data?.failed ?? 0, tone: 'text-rose-500', accent: 'bg-rose-50 border-rose-200' }
            ].map(({ label, value, tone, accent }) => (
              <div
                key={label}
                className="rounded-[24px] border border-sky-100 bg-[#fcfeff] p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
              >
                <div className={`mb-3 inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${accent}`}>
                  {label}
                </div>
                <p className={`text-3xl font-black leading-none ${tone}`}>{value}</p>
                <p className="mt-1.5 text-sm font-medium text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <ChartCard title="Score Distribution">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data?.scoreDist || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="range" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="count" fill="#0EA5E9" radius={[10, 10, 0, 0]} name="Candidates" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Domain Breakdown">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data?.domainBreakdown || []}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={74}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#94A3B8' }}
                  >
                    {(data?.domainBreakdown || []).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Monthly Trend" className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data?.monthlyTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12, color: '#475569', paddingTop: 12 }} />
                  <Line type="monotone" dataKey="candidates" stroke="#0EA5E9" strokeWidth={3} dot={{ fill: '#0EA5E9', r: 4 }} activeDot={{ r: 6 }} name="Candidates" />
                  <Line type="monotone" dataKey="avgScore" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 4 }} activeDot={{ r: 6 }} name="Avg Score" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </main>
    </div>
  );
}
