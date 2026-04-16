import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Bookmark, BookmarkCheck } from 'lucide-react';

const ScoreRing = ({ score }) => {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const fill = circ - (score / 100) * circ;
  const color = score >= 80 ? '#059669' : score >= 60 ? '#D97706' : '#DC2626';
  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg width="56" height="56" className="-rotate-90">
        <circle cx="28" cy="28" r={r} stroke="#E2E8F0" strokeWidth="4" fill="none" />
        <circle cx="28" cy="28" r={r} stroke={color} strokeWidth="4" fill="none"
          strokeDasharray={circ} strokeDashoffset={fill} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-900">{score}</span>
    </div>
  );
};

export default function StudentCard({ student, onView, onShortlist, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      whileHover={{ y: -3 }}
      className="relative rounded-[24px] border border-sky-100 bg-[#fcfeff] p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-1 hover:border-sky-200">
      <button onClick={() => onShortlist(student._id, student.isSaved)}
        className={`absolute top-4 right-4 transition-colors ${student.isSaved ? 'text-sky-600' : 'text-slate-400 hover:text-sky-600'}`}>
        {student.isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
      </button>

      <div className="flex items-start gap-3 mb-4">
        <ScoreRing score={student.scores?.overall || 0} />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">{student.name}</p>
          <p className="truncate text-xs text-slate-500">{student.college || 'College N/A'}</p>
          <p className="text-xs text-slate-500">{student.year || ''}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {student.stream && <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs text-sky-700">{student.stream}</span>}
        {student.tier && <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600">{student.tier}</span>}
      </div>

      <div className="flex items-center gap-1 mb-3">
        <span className="mr-1 text-xs text-slate-500">Rounds:</span>
        {[1, 2, 3, 4].map(r => (
          <div key={r} className={`h-2 w-2 rounded-full ${student.roundsCompleted?.includes(r) ? 'bg-emerald-600' : 'bg-slate-200'}`} />
        ))}
      </div>

      {student.badges?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {student.badges.slice(0, 2).map((b, i) => (
            <span key={i} className="rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs text-violet-600">{b}</span>
          ))}
        </div>
      )}

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={() => onView(student)}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-sky-100 bg-[#fdfefe] py-2 text-sm text-slate-600 transition-all hover:border-sky-200 hover:bg-[#f7fbff] hover:text-sky-700">
        <Eye size={12} /> View Full Profile
      </motion.button>
    </motion.div>
  );
}
