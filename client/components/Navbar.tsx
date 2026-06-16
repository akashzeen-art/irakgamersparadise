import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiMenu, HiX, HiGlobeAlt } from 'react-icons/hi';
import { useI18n } from '../lib/i18n';
import { useNavigate, useLocation } from 'react-router-dom';

export function Navbar({ onNavClick }: { onNavClick: (name: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { t, lang, isRTL } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLanguage = (newLang: 'en' | 'ar') => {
    const currentPath = location.pathname;
    const search = location.search;
    
    if (newLang === 'ar') {
      // Switch to Arabic
      if (currentPath === '/') {
        navigate('/ar' + search);
      } else if (currentPath === '/account') {
        navigate('/ar/account' + search);
      } else if (!currentPath.startsWith('/ar')) {
        navigate('/ar' + currentPath + search);
      }
    } else {
      // Switch to English
      if (currentPath.startsWith('/ar')) {
        const newPath = currentPath.replace('/ar', '') || '/';
        navigate(newPath + search);
      }
    }
    setShowLangMenu(false);
  };

  const menuItems = [
    { key: 'Home', label: t('home') as string },
    { key: 'Games', label: t('games') as string },
    { key: 'Categories', label: t('categories') as string },
    { key: 'Trending', label: t('trending') as string },
    { key: 'Account', label: t('myAccount') as string },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/70 backdrop-blur-md border-b border-neon-purple/20'
          : 'bg-transparent'
      }`}
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => onNavClick('Home')}>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 2 }}
              className="group-hover:drop-shadow-lg transition-all"
              style={{ filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.6))' }}
            >
              <img 
                src="/logo/gamersparadiselogo-removebg-preview.png" 
                alt="GamersParadise Logo" 
                className="h-10 w-auto"
              />
            </motion.div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <motion.div
                key={item.key}
                className="relative px-3 py-2 text-white/80 hover:text-white cursor-pointer group"
                whileHover={{ y: -2 }}
                onClick={() => onNavClick(item.key)}
              >
                {item.label}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple"
                  initial={{ width: '0%' }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
            
            {/* Language Selector */}
            <div className="relative ml-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white transition-colors"
              >
                <HiGlobeAlt className="text-lg" />
                <span className="text-sm font-medium">{lang.toUpperCase()}</span>
              </motion.button>
              
              {showLangMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 bg-slate-800/95 backdrop-blur-md border border-neon-purple/20 rounded-lg overflow-hidden z-50"
                >
                  <button
                    onClick={() => switchLanguage('en')}
                    className={`block w-full px-4 py-2 text-left hover:bg-slate-700/50 transition-colors ${
                      lang === 'en' ? 'bg-neon-purple/20 text-neon-cyan' : 'text-white/80'
                    }`}
                  >
                    {t('languageEnglish') as string}
                  </button>
                  <button
                    onClick={() => switchLanguage('ar')}
                    className={`block w-full px-4 py-2 text-left hover:bg-slate-700/50 transition-colors ${
                      lang === 'ar' ? 'bg-neon-purple/20 text-neon-cyan' : 'text-white/80'
                    }`}
                  >
                    {t('languageArabic') as string}
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Language Selector */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="text-white/80 hover:text-white transition-colors relative"
            >
              <HiGlobeAlt className="text-xl" />
              {showLangMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 bg-slate-800/95 backdrop-blur-md border border-neon-purple/20 rounded-lg overflow-hidden z-50"
                >
                  <button
                    onClick={() => switchLanguage('en')}
                    className={`block w-full px-4 py-2 text-left hover:bg-slate-700/50 transition-colors ${
                      lang === 'en' ? 'bg-neon-purple/20 text-neon-cyan' : 'text-white/80'
                    }`}
                  >
                    {t('languageEnglish') as string}
                  </button>
                  <button
                    onClick={() => switchLanguage('ar')}
                    className={`block w-full px-4 py-2 text-left hover:bg-slate-700/50 transition-colors ${
                      lang === 'ar' ? 'bg-neon-purple/20 text-neon-cyan' : 'text-white/80'
                    }`}
                  >
                    {t('languageArabic') as string}
                  </button>
                </motion.div>
              )}
            </motion.button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white text-2xl"
            >
              {isOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-slate-950/95 backdrop-blur-md border-t border-neon-purple/20 p-4"
          >
            {menuItems.map((item, i) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => { onNavClick(item.key); setIsOpen(false); }}
                className="block py-2 text-white/80 hover:text-neon-cyan transition-colors cursor-pointer"
              >
                {item.label}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
