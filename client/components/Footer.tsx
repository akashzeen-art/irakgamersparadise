import { motion } from 'framer-motion';
import { MdGamepad } from 'react-icons/md';
import { useI18n } from '../lib/i18n';

export function Footer() {
  const { t } = useI18n();
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-gradient-to-t from-slate-950 to-slate-900/50 border-t border-neon-purple/20 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
          className="flex flex-col items-center gap-3 mb-8"
        >
          <div className="flex items-center gap-2">
            <img 
              src="/logo/gamersparadiselogo-removebg-preview.png" 
              alt="GamersParadise Logo" 
              className="h-12 w-auto"
            />
          </div>
          <p className="text-white/60 text-sm text-center max-w-sm">
            Premium gaming portal with 100+ amazing games for everyone.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
          className="h-px bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent mb-8"
          style={{ originX: 0 }}
        />

        {/* Bottom */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          className="flex flex-col sm:flex-row justify-between items-center text-white/60 text-sm"
        >
          <p>&copy; 2026 Gamers Paradise. {t('allRights') as string}</p>
          <p>{t('designedFor') as string}</p>
        </motion.div>
      </div>
    </footer>
  );
}
