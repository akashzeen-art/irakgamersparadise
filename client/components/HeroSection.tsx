import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../lib/i18n';
import { NumberEntryPopup } from './NumberEntryPopup';
import { GameModal } from './GameModal';
import { GAMES } from '../data/games';

interface HeroSectionProps {
  onPlayClick?: () => void;
}

const SHOOTING_STARS = Array.from({ length: 8 }, (_, i) => ({
  top: `${8 + i * 11}%`,
  delay: i * 1.4,
  duration: 1.8 + (i % 3) * 0.6,
  width: 60 + (i % 4) * 30,
}));

export function HeroSection({ onPlayClick }: HeroSectionProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showNumberPopup, setShowNumberPopup] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(GAMES[0]); // Default to first game
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const WORDS = t('words') as string[];

  // Typewriter
  useEffect(() => {
    const word = WORDS[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 100);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 60);
    } else {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % WORDS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIndex]);

  const handlePlayNowClick = () => {
    console.log('🎮 Play Now clicked from Hero');
    setShowNumberPopup(true);
  };

  const handleBrowseGamesClick = () => {
    // Browse Games can still scroll to games section
    onPlayClick?.();
  };

  const handleSubscriptionSuccess = () => {
    // User is subscribed - open a random featured game
    const featuredGames = GAMES.filter(g => g.featured);
    const randomGame = featuredGames[Math.floor(Math.random() * featuredGames.length)] || GAMES[0];
    setSelectedGame(randomGame);
    setShowGameModal(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #020817 0%, #1a0533 50%, #020817 100%)' }}
    >
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(168,85,247,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Shooting stars */}
      {SHOOTING_STARS.map((s, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ top: s.top, left: '-10%' }}
          animate={{ x: ['0vw', '120vw'], opacity: [0, 1, 1, 0] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: 'easeOut' }}
        >
          <div
            className="h-px rounded-full"
            style={{
              width: s.width,
              background: i % 3 === 0
                ? 'linear-gradient(90deg, transparent, #06b6d4, transparent)'
                : i % 3 === 1
                ? 'linear-gradient(90deg, transparent, #a855f7, transparent)'
                : 'linear-gradient(90deg, transparent, #ec4899, transparent)',
            }}
          />
        </motion.div>
      ))}

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent pointer-events-none"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      {/* Pulsing rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-neon-purple/20 pointer-events-none"
          style={{ width: 300 + i * 120, height: 300 + i * 120 }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}
        />
      ))}

      {/* Orbs */}
      <motion.div
        animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-[10%] w-80 h-80 bg-neon-purple/25 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -80, 0], y: [0, -40, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-20 right-[10%] w-80 h-80 bg-neon-pink/20 rounded-full blur-3xl pointer-events-none"
      />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 40 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: (i % 3) + 1.5,
              height: (i % 3) + 1.5,
              left: `${(i * 2.5) % 100}%`,
              top: `${(i * 4.7) % 100}%`,
              background: i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#a855f7' : '#ec4899',
              boxShadow: i % 3 === 0 ? '0 0 4px #06b6d4' : i % 3 === 1 ? '0 0 4px #a855f7' : '0 0 4px #ec4899',
            }}
            animate={{ opacity: [0, 1, 0], y: [0, -80], x: [0, (i % 2 === 0 ? 1 : -1) * 20] }}
            transition={{ duration: (i % 3) + 3, repeat: Infinity, delay: (i * 0.3) % 4, ease: 'easeOut' }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-4">

        {/* Glowing circle behind text */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-8xl font-black leading-tight mb-6"
        >
          <span className="block text-white drop-shadow-lg">{t('heroPlay') as string}</span>
          <span
            className="block min-h-[1.2em]"
            style={{
              background: 'linear-gradient(90deg, #06b6d4, #a855f7, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(168,85,247,0.5))',
            }}
          >
            {displayed}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              style={{ WebkitTextFillColor: '#a855f7' }}
            >|</motion.span>
          </span>
          <span className="block text-white/90 text-4xl sm:text-5xl lg:text-6xl mt-2">{t('heroGamesOnline') as string}</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl text-white/60 mb-10 max-w-2xl mx-auto"
        >
          {t('heroSub') as string}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.07, boxShadow: '0 0 40px rgba(168,85,247,0.8)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayNowClick}
            className="relative px-10 py-4 text-white font-bold text-lg rounded-xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
          >
            <span className="relative">🎮 {t('playNow') as string}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.07, borderColor: '#06b6d4', color: '#06b6d4', boxShadow: '0 0 20px rgba(6,182,212,0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBrowseGamesClick}
            className="px-10 py-4 border-2 border-neon-purple text-neon-purple font-bold text-lg rounded-xl transition-all"
          >
            {t('browseGames') as string}
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="text-white/30 text-xs tracking-widest uppercase">{t('scrollToExplore') as string}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
          >
            <motion.div
              animate={{ height: [4, 12, 4], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-0.5 bg-neon-purple rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
      
      {/* Number Entry Popup */}
      <NumberEntryPopup
        isOpen={showNumberPopup}
        onClose={() => setShowNumberPopup(false)}
        onSuccess={handleSubscriptionSuccess}
        gameTitle={t('playRandomGame') as string || 'Play Random Game'}
      />
      
      {/* Game Modal */}
      {showGameModal && (
        <GameModal 
          game={selectedGame} 
          onClose={() => setShowGameModal(false)} 
        />
      )}
    </div>
  );
}
