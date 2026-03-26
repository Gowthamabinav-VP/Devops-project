import { motion } from 'framer-motion';

const Badge = ({ children, status }) => {
  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Approved':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Modification Required':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <motion.span 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle(status)}`}
    >
      {children}
    </motion.span>
  );
};

export default Badge;
