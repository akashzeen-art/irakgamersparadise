import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoPlay } from 'react-icons/io5';
import { FaStar } from 'react-icons/fa';
import { HiX, HiOutlineArrowsExpand, HiChevronLeft } from 'react-icons/hi';
import { Game } from '../data/games';
import { useI18n, getGameTitle } from '../lib/i18n';

interface GameModalProps {
  game: Game;
  onClose: () => void;
}

export function GameModal({ game, onClose }: GameModalProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { t, lang } = useI18n();
  const displayTitle = getGameTitle(game, lang);

  if (isFullscreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[60] bg-black"
      >
        <iframe
          src={game.iframeUrl}
          title={displayTitle}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          style={{ zIndex: 1 }}
        />
        {/* Exit bar */}
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-end px-3 py-2 gap-2"
          style={{ zIndex: 10, background: 'linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)' }}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-xs font-semibold"
            style={{ background: 'rgba(10,5,25,0.85)', border: '1px solid rgba(168,85,247,0.5)' }}
          >
            {t('exitFullscreen') as string}
          </button>
        </div>
        {/* Bottom right exit icon */}
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute bottom-4 left-4 p-2 rounded-xl text-white"
          style={{ zIndex: 10, background: 'rgba(10,5,25,0.85)', border: '1px solid rgba(168,85,247,0.5)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="relative w-full sm:max-w-lg bg-slate-900 rounded-2xl overflow-hidden border border-neon-purple/30"
          style={{ boxShadow: '0 0 60px rgba(168,85,247,0.3)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-950/60">
            <div className="flex items-center gap-2 min-w-0">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="flex items-center gap-1 px-2 py-1.5 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10 text-sm font-semibold flex-shrink-0"
              >
                <HiChevronLeft className="text-lg" /> {t('back') as string}
              </motion.button>
              <div className="w-px h-4 bg-white/10 flex-shrink-0" />
              <span className="text-white font-bold text-sm truncate">{displayTitle}</span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <FaStar className="text-yellow-400 text-xs" />
                <span className="text-white/60 text-xs">{game.rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => { setGameStarted(true); setIsFullscreen(true); }}
                className="p-2 text-white hover:text-neon-cyan transition-colors rounded-lg hover:bg-white/10"
                title="Fullscreen"
              >
                <HiOutlineArrowsExpand className="text-lg" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              >
                <HiX className="text-base" />
              </motion.button>
            </div>
          </div>

          {/* Game area */}
          <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
            {!gameStarted ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <img src={game.thumbnail} alt={displayTitle}
                  className="absolute inset-0 w-full h-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                <motion.button
                  whileHover={{ scale: 1.1, boxShadow: '0 0 40px rgba(168,85,247,0.9)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameStarted(true)}
                  className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #a855f7)' }}
                >
                  <IoPlay className="text-2xl ml-1" />
                </motion.button>
                <p className="relative z-10 text-white font-bold text-lg sm:text-xl">{displayTitle}</p>
                <p className="relative z-10 text-white/50 text-xs">{t('tapToPlay') as string}</p>
              </div>
            ) : (
              <iframe
                src={game.iframeUrl}
                title={displayTitle}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
