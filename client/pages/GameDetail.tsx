import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { GAMES } from '../data/games';
import { FaStar } from 'react-icons/fa';
import { HiChevronLeft, HiOutlineArrowsExpand } from 'react-icons/hi';
import { IoPlay } from 'react-icons/io5';

export default function GameDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const game = GAMES.find((g) => g.id === id);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  if (!game) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-4xl font-black text-white mb-4">Game Not Found</h1>
          <p className="text-white/60 mb-8">The game you're looking for doesn't exist.</p>
          <Link to="/">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold rounded-lg">
              Back to Home
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const relatedGames = GAMES.filter((g) => g.category === game.category && g.id !== game.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-neon-purple/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/70 hover:text-neon-cyan transition-colors">
            <HiChevronLeft className="text-xl" /> Back
          </button>
          <h1 className="text-xl font-bold text-white">{game.title}</h1>
          <div className="w-12" />
        </div>
      </motion.div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Inline Game iframe */}
        {game.iframeUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full rounded-xl overflow-hidden border border-neon-purple/30 mb-8 relative"
            style={{ aspectRatio: '16/9' }}
          >
            {!gameStarted ? (
              /* Thumbnail + Play overlay */
              <div className="relative w-full h-full">
                <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1, boxShadow: '0 0 40px rgba(168,85,247,0.8)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setGameStarted(true)}
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl"
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #a855f7)' }}
                  >
                    <IoPlay className="ml-1" />
                  </motion.button>
                  <p className="text-white font-bold text-xl">Click to Play</p>
                </div>
              </div>
            ) : (
              <iframe
                src={game.iframeUrl}
                title={game.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

            {/* Fullscreen button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setIsFullscreen(true)}
              className="absolute top-3 right-3 p-2 bg-slate-950/70 hover:bg-slate-900 text-white rounded-lg backdrop-blur-sm transition-colors z-10"
            >
              <HiOutlineArrowsExpand className="text-xl" />
            </motion.button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm border border-neon-purple/30 rounded-xl p-6"
          >
            <h2 className="text-3xl font-black text-white mb-2">{game.title}</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400" />
                <span className="text-white font-bold">{game.rating}</span>
              </div>
              <span className="px-3 py-1 bg-neon-purple/20 text-neon-cyan rounded-lg text-sm font-semibold border border-neon-purple/40">
                {game.category}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(6,182,212,0.7)' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { setGameStarted(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-2 px-8 py-3 text-white font-bold rounded-xl mb-6"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #a855f7)' }}
            >
              <IoPlay /> Play Now
            </motion.button>

            <div className="grid grid-cols-3 gap-4 text-sm">
              {[
                { label: 'Developer', value: 'GameStudio Pro' },
                { label: 'Released', value: '2026' },
                { label: 'Plays', value: '12,345' },
              ].map((item) => (
                <div key={item.label} className="bg-slate-800/40 rounded-lg p-3">
                  <p className="text-white/50 text-xs mb-1">{item.label}</p>
                  <p className="text-white font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Related Games */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-neon-purple/30 rounded-xl p-6 h-fit"
          >
            <h3 className="text-xl font-bold text-white mb-4">Related Games</h3>
            <div className="space-y-3">
              {relatedGames.map((g) => (
                <Link key={g.id} to={`/game/${g.id}`}>
                  <motion.div whileHover={{ x: 5 }} className="flex gap-3 cursor-pointer group mb-3">
                    <img src={g.thumbnail} alt={g.title}
                      className="w-14 h-14 rounded-lg object-cover group-hover:opacity-80 transition-opacity flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm line-clamp-2 group-hover:text-neon-cyan transition-colors">{g.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <FaStar className="text-yellow-400 text-xs" />
                        <span className="text-white/50 text-xs">{g.rating}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center"
        >
          <button onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white text-3xl z-50 hover:text-neon-cyan transition-colors">
            ✕
          </button>
          <iframe
            src={game.iframeUrl}
            title={game.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>
      )}
    </div>
  );
}
