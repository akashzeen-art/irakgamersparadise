import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { subscriptionService } from '../services/subscriptionService';
import { SubscriberDetails } from '../../shared/api';
import { useI18n } from '../lib/i18n';

export function Account() {
  const [details, setDetails] = useState<SubscriberDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await subscriptionService.getSubscriberDetails();
        setDetails(data);
      } catch (error) {
        console.error('Failed to fetch subscriber details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, []);

  const handleUnsubscribe = async () => {
    setIsUnsubscribing(true);
    try {
      await subscriptionService.unsubscribe();
      // Refresh page after unsubscription
      window.location.reload();
    } catch (error) {
      console.error('Unsubscription failed:', error);
      setIsUnsubscribing(false);
    }
  };

  const handleSubscribe = () => {
    subscriptionService.redirectToCampaign();
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-950"
      >
        <div className="text-white text-lg">{t('loadingAccountDetails')}</div>
      </motion.div>
    );
  }

  if (!details) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-950"
      >
        <div className="text-white text-lg">{t('unableToLoadAccount')}</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 py-20 px-4"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-neon-purple/20"
        >
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            {t('accountTitle')}
          </h1>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">{t('phoneNumber')}</label>
                <div className="bg-slate-700/50 rounded-lg p-3 text-white">{details.msisdn}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">{t('serviceName')}</label>
                <div className="bg-slate-700/50 rounded-lg p-3 text-white">{details.service_name}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">{t('validFrom')}</label>
                <div className="bg-slate-700/50 rounded-lg p-3 text-white">
                  {new Date(details.valid_from).toLocaleDateString()}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">{t('validTo')}</label>
                <div className="bg-slate-700/50 rounded-lg p-3 text-white">
                  {new Date(details.valid_to).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">{t('subscriptionStatus')}</label>
              <div className={`rounded-lg p-3 ${details.status === '1' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
                {details.status === '1' ? t('active') : t('inactive')}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-700">
              {details.status === '1' ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUnsubscribe}
                  disabled={isUnsubscribing}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {isUnsubscribing ? t('unsubscribing') : t('unsubscribe')}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubscribe}
                  className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/80 hover:to-neon-purple/80 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {t('subscribeNow')}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}