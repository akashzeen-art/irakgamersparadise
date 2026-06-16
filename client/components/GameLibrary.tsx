import { useRef } from 'react';
import { motion } from 'framer-motion';
import { GAMES, CATEGORIES } from '../data/games';
import { GameCard } from './GameCard';
import { useI18n, getCategoryLabel } from '../lib/i18n';

interface GameLibraryProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const SECTION_THEMES = [
  { gradient: 'from-yellow-500/10 to-orange-500/5', border: 'border-yellow-500/20', accent: '#f59e0b', glow: 'rgba(245,158,11,0.15)' },
  { gradient: 'from-cyan-500/10 to-blue-500/5',    border: 'border-cyan-500/20',    accent: '#06b6d4', glow: 'rgba(6,182,212,0.15)' },
  { gradient: 'from-purple-500/10 to-pink-500/5',  border: 'border-purple-500/20',  accent: '#a855f7', glow: 'rgba(168,85,247,0.15)' },
  { gradient: 'from-green-500/10 to-emerald-500/5',border: 'border-green-500/20',   accent: '#22c55e', glow: 'rgba(34,197,94,0.15)' },
  { gradient: 'from-pink-500/10 to-rose-500/5',    border: 'border-pink-500/20',    accent: '#ec4899', glow: 'rgba(236,72,153,0.15)' },
  { gradient: 'from-indigo-500/10 to-violet-500/5',border: 'border-indigo-500/20',  accent: '#6366f1', glow: 'rgba(99,102,241,0.15)' },
];

function GameRow({ category, icon, theme, onSeeAll, seeAllLabel, categoryLabel }: {
  category: string;
  icon: string;
  theme: typeof SECTION_THEMES[0];
  onSeeAll: () => void;
  seeAllLabel: string;
  categoryLabel: string;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const games = GAMES.filter(g => g.category === category).slice(0, 12);
  if (games.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className={`relative rounded-2xl border ${theme.border} bg-gradient-to-r ${theme.gradient} p-6 sm:p-8 overflow-hidden`}
      style={{ boxShadow: `0 0 40px ${theme.glow}` }}
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none"
        style={{ background: theme.glow }} />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="text-3xl">
            {icon}
          </motion.span>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white">{categoryLabel}</h3>
          </div>
          <motion.div
            initial={{ width: 0 }} whileInView={{ width: 40 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="h-0.5 rounded-full hidden sm:block" style={{ background: theme.accent }}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onSeeAll}
          className="px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all"
          style={{ borderColor: theme.accent, color: theme.accent }}
        >
          {seeAllLabel}
        </motion.button>
      </div>

      <div ref={rowRef} className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {games.map((game, index) => (
          <div key={game.id} className="flex-shrink-0" style={{ width: '200px' }}>
            <GameCard game={game} index={index} compact />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function GameLibrary({ selectedCategory, onCategoryChange }: GameLibraryProps) {
  const { t } = useI18n();
  const filteredGames = GAMES.filter(g => g.category === selectedCategory);
  const isAll = selectedCategory === 'All';

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-black text-white mb-2"
          >
            {isAll ? t('gameLibrary') as string : getCategoryLabel(selectedCategory, t)}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/50"
          >
            {isAll ? t('browseByCategory') as string : ''}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-10 pb-8 border-b border-white/10"
        >
          <button
            onClick={() => onCategoryChange('All')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              isAll ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-lg shadow-neon-purple/40'
                    : 'bg-slate-800/60 text-white/60 hover:text-white hover:bg-slate-800'
            }`}
          >
            {t('gameLibrary') as string}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onCategoryChange(cat.name)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.name
                  ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white shadow-lg shadow-neon-purple/40'
                  : 'bg-slate-800/60 text-white/60 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{cat.icon}</span>{getCategoryLabel(cat.name, t)}
            </button>
          ))}
        </motion.div>

        {isAll && (
          <div className="space-y-8">
            {CATEGORIES.map((cat, i) => (
              <GameRow
                key={cat.name}
                category={cat.name}
                icon={cat.icon}
                theme={SECTION_THEMES[i % SECTION_THEMES.length]}
                onSeeAll={() => onCategoryChange(cat.name)}
                seeAllLabel={t('seeAll') as string}
                categoryLabel={getCategoryLabel(cat.name, t)}
              />
            ))}
          </div>
        )}

        {!isAll && (
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
          >
            {filteredGames.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
