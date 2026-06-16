import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMail } from 'react-icons/hi';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => { setEmail(''); setSubmitted(false); }, 3000);
    }
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-950">
      {/* Background orbs */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-purple rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-neon-cyan rounded-full blur-3xl pointer-events-none"
      />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            left: `${10 + (i * 7.5) % 80}%`,
            background: i % 2 === 0 ? '#a855f7' : '#06b6d4',
          }}
          animate={{ y: [0, -80, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
        />
      ))}

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Animated border glow */}
          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -inset-px rounded-2xl pointer-events-none"
            style={{ background: 'linear-gradient(135deg, #a855f7, #06b6d4, #ec4899, #a855f7)', backgroundSize: '300% 300%' }}
          />

          <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-white/5">
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="text-4xl mb-4 inline-block"
              >
                🎮
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl font-black text-white mb-2"
              >
                Stay Updated
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/50"
              >
                Get the latest games and exclusive offers delivered to your inbox
              </motion.p>
            </div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
            >
              <div className="flex-1 relative group">
                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-purple/60 text-xl z-10" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-950/60 border border-white/10 focus:border-neon-cyan/60 rounded-xl text-white placeholder-white/30 focus:outline-none transition-all duration-300"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168,85,247,0.8)' }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-8 py-3 font-bold rounded-xl text-white whitespace-nowrap transition-all"
                style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}
              >
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.span key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      ✓ Done!
                    </motion.span>
                  ) : (
                    <motion.span key="sub" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      Subscribe
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 mt-8 pt-8 border-t border-white/10"
            >
              {[{ icon: '🎮', text: 'New Games' }, { icon: '🎁', text: 'Exclusive Offers' }, { icon: '📊', text: 'Trending Games' }].map((f, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, color: '#06b6d4' }}
                  className="flex items-center gap-2 text-white/50 cursor-default"
                >
                  <span className="text-xl">{f.icon}</span>
                  <span className="text-sm">{f.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
