import React from 'react';
import { motion } from 'framer-motion';

export default function StatsCard({ icon, label, value, color = 'blue', delay = 0 }) {
  const colorMap = {
    blue: { card: 'border-sky-200', iconWrap: 'border-sky-200 bg-sky-50', icon: 'text-sky-600', value: 'text-sky-600' },
    purple: { card: 'border-violet-200', iconWrap: 'border-violet-200 bg-violet-50', icon: 'text-violet-600', value: 'text-violet-600' },
    green: { card: 'border-emerald-200', iconWrap: 'border-emerald-200 bg-emerald-50', icon: 'text-emerald-600', value: 'text-emerald-600' },
    orange: { card: 'border-amber-200', iconWrap: 'border-amber-200 bg-amber-50', icon: 'text-amber-600', value: 'text-amber-600' }
  };

  const styles = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -3 }}
      className={`flex items-center gap-3 rounded-[24px] border bg-[#fdfefe] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] ${styles.card}`}
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${styles.iconWrap} ${styles.icon}`}>
        {icon}
      </div>
      <div>
        <p className={`text-[1.85rem] font-bold leading-none tracking-[-0.02em] ${styles.value}`}>{value ?? '--'}</p>
        <p className="mt-1 text-sm font-medium tracking-[0.01em] text-slate-500">{label}</p>
      </div>
    </motion.div>
  );
}
