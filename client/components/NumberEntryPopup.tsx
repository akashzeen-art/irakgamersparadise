import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import { useI18n } from '../lib/i18n';
import { subscriptionService } from '../services/subscriptionService';

interface NumberEntryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  gameTitle: string;
}

export function NumberEntryPopup({ isOpen, onClose, onSuccess, gameTitle }: NumberEntryPopupProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 8) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsChecking(true);
    setError('');

    try {
      // Check subscription status with the entered phone number as subid
      const status = await subscriptionService.checkStatusWithPhone(phoneNumber);
      
      if (status.status === 1) {
        // User is subscribed - allow access
        console.log('✅ Subscription verified - access granted');
        onSuccess();
        onClose();
      } else {
        // User is not subscribed - redirect to campaign URL
        console.log('❌ Not subscribed - redirecting to campaign');
        const campaignUrl = subscriptionService.getCampaignUrlForPhone(phoneNumber);
        window.open(campaignUrl, '_blank');
        onClose();
      }
    } catch (error) {
      console.error('🚨 Subscription check failed:', error);
      setError('Unable to verify subscription. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleClose = () => {
    setPhoneNumber('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-slate-900/95 backdrop-blur-md border border-neon-purple/30 rounded-2xl p-6 w-full max-w-md mx-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {t('enterPhoneNumber')}
                </h3>
                <button
                  onClick={handleClose}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <HiX className="text-2xl" />
                </button>
              </div>

              {/* Game Info */}
              <div className="mb-6 text-center">
                <p className="text-neon-cyan font-semibold mb-2">{gameTitle}</p>
                <p className="text-white/70 text-sm">
                  {t('enterPhoneToPlay')}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    {t('phoneNumber')}
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan transition-colors"
                    disabled={isChecking}
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isChecking || !phoneNumber}
                  className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/80 hover:to-neon-purple/80 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isChecking ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {t('checking')}
                    </>
                  ) : (
                    t('playNow')
                  )}
                </button>
              </form>

              {/* Info */}
              <div className="mt-4 text-center">
                <p className="text-white/50 text-xs">
                  {t('subscriptionRequired')}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}