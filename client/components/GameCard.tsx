import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { IoPlay } from 'react-icons/io5';
import { FaStar } from 'react-icons/fa';
import { Game } from '../data/games';
import { GameModal } from './GameModal';
import { NumberEntryPopup } from './NumberEntryPopup';
import { useI18n } from '../lib/i18n';

interface GameCardProps {
  game: Game;
  index?: number;
  compact?: boolean;
}

export function GameCard({ game, index = 0, compact = false }: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showNumberPopup, setShowNumberPopup] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { lang } = useI18n();

  const handleGameClick = () => {
    console.log('🎮 Game clicked:', game.title);
    // Show number entry popup for ALL games
    setShowNumberPopup(true);
  };

  const handleSubscriptionSuccess = () => {
    // User is subscribed - open the game
    console.log('✅ Opening game after subscription verification');
    setShowModal(true);
  };

  const glowColor = index % 3 === 0 ? 'rgba(6,182,212,0.6)' : index % 3 === 1 ? 'rgba(168,85,247,0.6)' : 'rgba(236,72,153,0.6)';

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: (index % 8) * 0.04, duration: 0.4 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleGameClick}
        whileHover={{ scale: 1.04, y: -4 }}
        className="relative cursor-pointer rounded-xl overflow-hidden"
        style={{
          aspectRatio: compact ? '3/4' : '3/4',
          boxShadow: isHovered ? `0 8px 32px ${glowColor}` : '0 2px 8px rgba(0,0,0,0.4)',
          transition: 'box-shadow 0.3s',
          zIndex: 1,
        }}
      >
        {/* Thumbnail */}
        <motion.img
          src={game.thumbnail}
          alt={game.title}
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Neon border on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ boxShadow: `inset 0 0 16px ${glowColor}` }}
        />

        {/* Featured badge */}
        {game.featured && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full"
            style={{ boxShadow: '0 0 8px rgba(234,179,8,0.6)', fontSize: '10px' }}>
            ⭐ TOP 10
          </div>
        )}

        {/* Play button on hover */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #a855f7)', boxShadow: '0 0 20px rgba(6,182,212,0.8)' }}
          >
            <IoPlay className="text-sm ml-0.5" />
          </div>
        </motion.div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <h3 className="text-white font-bold leading-tight line-clamp-1 drop-shadow"
            style={{ fontSize: compact ? '11px' : '13px' }}>
            {lang === 'ar' && game.titleAr ? game.titleAr : game.title}
          </h3>
          <div className="flex items-center gap-1 mt-0.5">
            <FaStar className="text-yellow-400" style={{ fontSize: '9px' }} />
            <span className="text-white/60" style={{ fontSize: '10px' }}>{game.rating}</span>
          </div>
        </div>
      </motion.div>

      {/* Number Entry Popup */}
      <NumberEntryPopup
        isOpen={showNumberPopup}
        onClose={() => setShowNumberPopup(false)}
        onSuccess={handleSubscriptionSuccess}
        gameTitle={lang === 'ar' && game.titleAr ? game.titleAr : game.title}
      />

      {/* Game Modal */}
      {showModal && <GameModal game={game} onClose={() => setShowModal(false)} />}
    </>
  );
}