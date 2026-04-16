import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, Trash2, Link, Users, BarChart2, Copy, Mail } from 'lucide-react';
import RecruiterSidebar from '../../components/recruiter/RecruiterSidebar';
import { useRecruiter } from '../../context/RecruiterContext';

const STATUS_STYLE = {
  draft:  'text-warning bg-warning/10 border-warning/20',
  active: 'text-success bg-success/10 border-success/20',
  closed: 'text-danger bg-danger/10 border-danger/20',
};

export default function MyAssessments() {
  const { recruiter, logout } = useRecruiter();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [toast, setToast] = useState('');
  const [emailingId, setEmailingId] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/recruiter/assessments', { params: { status: filter, sort } });
      setAssessments(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter, sort]); // eslint-disable-line

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assessment?')) return;
    try {
      await axios.delete(`/api/recruiter/assessments/${id}`);
      setAssessments(a => a.filter(x => x._id !== id));
      showToast('Assessment deleted.');
    } catch { showToast('Failed to delete.'); }
  };

  const handlePublish = async (id) => {
    try {
      const { data } = await axios.post(`/api/recruiter/assessments/${id}/publish`);
      setAssessments(a => a.map(x => x._id === id ? data : x));
      showToast(data?.message || 'Assessment published!');
      load();
    } catch { showToast('Failed to publish.'); }
  };

  const handleEmailShortlisted = async (id) => {
    setEmailingId(id);
    try {
      const { data } = await axios.post(`/api/recruiter/assessments/${id}/email-shortlisted`);
      showToast(data?.message || 'Assessment emails sent.');
      load();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to send assessment emails.');
    } finally {
      setEmailingId('');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <RecruiterSidebar recruiter={recruiter} onLogout={logout} />

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-5 right-5 z-50 bg-dark-card border border-dark-border text-white px-4 py-2.5 rounded-xl text-sm shadow-lg">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="lg:ml-[260px] pt-14 lg:pt-0 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-white">My Assessments</h1>
              <p className="text-text-secondary text-sm mt-0.5">{assessments.length} assessment{assessments.length !== 1 ? 's' : ''}</p>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/recruiter/assessments/create')}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-secondary to-primary text-dark-card rounded-xl text-sm font-semibold shadow-sm">
              <PlusCircle size={15} /> Create New
            </motion.button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex bg-dark-card border border-dark-border rounded-xl p-1 gap-1 shadow-sm">
              {['all', 'active', 'draft', 'closed'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-primary/10 text-primary' : 'text-text-muted hover:text-white'}`}>
                  {f}
                </button>
              ))}
            </div>
            <select className="bg-dark-card border border-dark-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none shadow-sm"
              value={sort} onChange={e => setSort(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="candidates">Most Candidates</option>
              <option value="score">Highest Score</option>
            </select>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[0,1,2].map(i => <div key={i} className="bg-dark-card border border-dark-border rounded-2xl p-5 h-28 animate-pulse" />)}
            </div>
          ) : assessments.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-dark-card border border-dark-border flex items-center justify-center mx-auto mb-4 shadow-sm">
                <BarChart2 size={24} className="text-text-muted" />
              </div>
              <p className="text-white font-bold mb-1">No assessments yet</p>
              <p className="text-text-secondary text-sm mb-5">Create your first assessment to start finding talent.</p>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/recruiter/assessments/create')}
                className="px-5 py-2.5 bg-primary/10 border border-primary/20 text-primary rounded-xl text-sm font-semibold">
                Create Assessment
              </motion.button>
            </div>
          ) : (
            <div className="space-y-4">
              {assessments.map((a, i) => (
                <motion.div key={a._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -1 }}
                  className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-sm hover:border-primary/20 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-white font-bold">{a.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold capitalize ${STATUS_STYLE[a.status]}`}>{a.status}</span>
                        <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">{a.domain}</span>
                      </div>
                      <p className="text-text-muted text-xs">{a.targetRole || 'Open role'} · {a.difficulty}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {a.status === 'draft' && (
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => handlePublish(a._id)}
                          className="px-3 py-1.5 bg-success/10 border border-success/20 text-success rounded-lg text-xs font-semibold">
                          Publish
                        </motion.button>
                      )}
                      {a.shareableLink && (
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => handleEmailShortlisted(a._id)}
                          disabled={emailingId === a._id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/10 text-xs font-semibold text-primary disabled:opacity-60">
                          <Mail size={13} />
                          {emailingId === a._id ? 'Sending...' : 'Email Shortlisted'}
                        </motion.button>
                      )}
                      {a.shareableLink && (
                        <button onClick={() => { navigator.clipboard.writeText(a.shareableLink); showToast('Link copied!'); }}
                          className="text-text-muted hover:text-primary transition-colors"><Link size={15} /></button>
                      )}
                      <button onClick={() => handleDelete(a._id)} className="text-text-muted hover:text-danger transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 mt-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1.5"><Users size={11} />{a.candidatesAttempted} attempted</span>
                    <span className="flex items-center gap-1.5"><BarChart2 size={11} />Avg: {a.averageScore || 0}%</span>
                    <span className="flex items-center gap-1.5"><Copy size={11} />{a.candidatesShortlisted} shortlisted</span>
                    <span className="ml-auto">Created {new Date(a.createdAt).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
