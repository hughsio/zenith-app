import React from 'react';
import { motion } from 'framer-motion';
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}
export function EmptyState({ icon, title, description, children }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="text-center py-16 px-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/20"
    >
      <div className="flex justify-center items-center mx-auto h-16 w-16 text-slate-400 dark:text-slate-500">
        {icon}
      </div>
      <h2 className="mt-6 text-2xl font-semibold text-slate-800 dark:text-slate-200">{title}</h2>
      <p className="mt-2 text-slate-500 dark:text-slate-400">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </motion.div>
  );
}