import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAMES } from '../data/games';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { IoPlay } from 'react-icons/io5';
import { FaStar } from 'react-icons/fa';
import { GameModal } from './GameModal';
import { useI18n, getGameTitle, getCategoryLabel } from '../lib/i18n';

const featuredGames = GAMES.filter(g => g.featured);

export function FeaturedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const { t, lang } = useI18n();

  const goToPrevious = () => setCurrentIndex((prev) => (prev - 1 + featuredGames.length) % featuredGames.length);
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % featuredGames.length);

  const currentGame = featuredGames[currentIndex];

  return (
    <>
      <section className="relative w-full h-96 sm:h-[500px] lg:h-[600px] overflow-hidden bg-gradient-to-r from-slate-950 to-purple-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full h-full">
          {/* Image carousel */}
          <div className="relative h-full rounded-lg overflow-hidden group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <img
                  src={currentGame.thumbnail}
                  alt={getGameTitle(currentGame, lang)}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/50 to-transparent" />

            {/* Navigation buttons */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-neon-purple/80 hover:bg-neon-purple text-white p-2 rounded-full transition-all backdrop-blur-sm"
            >
              <HiChevronLeft className="text-2xl" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-neon-purple/80 hover:bg-neon-purple text-white p-2 rounded-full transition-all backdrop-blur-sm"
            >
              <HiChevronRight className="text-2xl" />
            </button>

            {/* Glow effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          {/* Content */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center h-full"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block w-fit px-4 py-2 bg-neon-purple/20 text-neon-cyan text-sm font-semibold rounded-lg mb-4 backdrop-blur-sm border border-neon-purple/40"
            >
              {t('featuredGame') as string}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl font-black text-white mb-4"
            >
              {getGameTitle(currentGame, lang)}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/70 text-lg mb-6"
            >
              {currentGame.description}
            </motion.p>

            {/* Rating and category */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg">
                <FaStar className="text-neon-cyan" />
                <span className="text-white font-semibold">{currentGame.rating}</span>
              </div>
              <div className="px-4 py-2 bg-neon-purple/30 text-white rounded-lg font-semibold border border-neon-purple/50">
                {getCategoryLabel(currentGame.category, t)}
              </div>
            </motion.div>

            {/* Play button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-neon-cyan/50"
            >
              <IoPlay /> {t('playNow') as string}
            </motion.button>

            {/* Carousel dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-2 mt-8"
            >
              {featuredGames.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-gradient-to-r from-neon-cyan to-neon-purple w-8'
                      : 'bg-white/20 w-2 hover:bg-white/40'
                  }`}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>

      {showModal && <GameModal game={currentGame} onClose={() => setShowModal(false)} />}
    </>
  );
}
