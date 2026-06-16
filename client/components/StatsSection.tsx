import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useI18n } from '../lib/i18n';

export function StatsSection() {
  const [counts, setCounts] = useState({ games: 0, players: 0, plays: 0, categories: 0 });
  const statsRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);
  const { t } = useI18n();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          const stats = [
            { key: 'games', target: 147 },
            { key: 'players', target: 50000 },
            { key: 'plays', target: 500000 },
            { key: 'categories', target: 6 },
          ];
          stats.forEach(({ key, target }) => {
            gsap.to({ value: 0 }, {
              value: target,
              duration: 2.5,
              ease: 'power2.out',
              onUpdate: function () {
                setCounts((prev) => ({ ...prev, [key]: Math.floor(this.targets()[0].value) }));
              },
            });
          });
        }
      },
      { threshold: 0.4 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const statItems = [
    { label: t('players') as string, value: counts.players >= 1000 ? Math.floor(counts.players / 1000) : counts.players, suffix: counts.players >= 1000 ? 'K+' : '+', icon: '👥', color: '#a855f7' },
    { label: t('totalPlays') as string, value: counts.plays >= 1000 ? Math.floor(counts.plays / 1000) : counts.plays, suffix: counts.plays >= 1000 ? 'K+' : '+', icon: '🕹️', color: '#ec4899' },
  ];

  return (
    <section ref={statsRef} className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #020817 0%, #1a0533 50%, #020817 100%)' }}
    >
      {/* Background pulse rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neon-purple/10 pointer-events-none"
          animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: 'easeOut' }}
          style={{ width: 200, height: 200 }}
        />
      ))}

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            {t('trustedBy') as string}{' '}
            <span style={{ background: 'linear-gradient(90deg,#06b6d4,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {t('millions') as string}
            </span>
          </h2>
          <p className="text-white/50 text-lg">{t('joinCommunity') as string}</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-8 max-w-2xl mx-auto">
          {statItems.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -6 }}
              className="relative group"
            >
              {/* Glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                style={{ background: `radial-gradient(circle, ${stat.color}40, transparent)` }}
              />

              <div className="relative bg-slate-900/60 backdrop-blur-sm border border-white/10 group-hover:border-white/20 rounded-2xl p-6 sm:p-8 text-center transition-all duration-300"
                style={{ boxShadow: `0 0 0 0 ${stat.color}` }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                  className="text-3xl sm:text-4xl mb-3"
                >
                  {stat.icon}
                </motion.div>

                <div className="text-3xl sm:text-5xl font-black mb-1" style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}` }}>
                  {stat.value}{stat.suffix}
                </div>
                <p className="text-white/60 font-semibold text-sm sm:text-base">{stat.label}</p>

                {/* Bottom line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 rounded-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }}
                  initial={{ width: '0%', left: '50%' }}
                  whileInView={{ width: '100%', left: '0%' }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
