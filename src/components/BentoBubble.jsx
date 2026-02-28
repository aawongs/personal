import { motion } from 'framer-motion';

function BentoBubble({ className = '', delay = 0, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={`glass rounded-3xl p-5 sm:p-6 ${className}`}
    >
      {children}
    </motion.section>
  );
}

export default BentoBubble;
