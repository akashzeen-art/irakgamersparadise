import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiGlobeAlt } from 'react-icons/hi';
import { subscriptionService } from '../services/subscriptionService';
import { SubscriberDetails } from '../../shared/api';
import { useI18n, Lang } from '../lib/i18n';

function AccountToolbar() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const switchLanguage = (newLang: Lang) => {
    const search = location.search;
    if (newLang === 'ar') {
      navigate(`/ar/account${search}`);
    } else {
      navigate(`/account${search}`);
    }
  };

  return (
    <div className="flex items-center justify-between mb-6 gap-4">
      <div className="flex items-center gap-2 text-white/70">
        <HiGlobeAlt className="text-lg text-neon-cyan" />
        <label htmlFor="account-language" className="text-sm font-medium">
          {t('language') as string}
        </label>
      </div>
      <select
        id="account-language"
        value={lang}
        onChange={(e) => switchLanguage(e.target.value as Lang)}
        className="bg-slate-700/80 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-neon-cyan cursor-pointer min-w-[140px]"
      >
        <option value="en">{t('languageEnglish') as string}</option>
        <option value="ar">{t('languageArabic') as string}</option>
      </select>
    </div>
  );
}

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
      window.location.reload();
    } catch (error) {
      console.error('Unsubscription failed:', error);
      setIsUnsubscribing(false);
    }
  };

  const handleSubscribe = () => {
    subscriptionService.redirectToCampaign();
  };

  const handleLogout = () => {
    subscriptionService.logout();
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 px-4"
      >
        <div className="w-full max-w-2xl">
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-neon-purple/20">
            <AccountToolbar />
            <div className="text-white text-lg text-center">{t('loadingAccountDetails')}</div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!details) {
    const missingSubid = !subscriptionService.hasValidSubid();
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 px-4"
      >
        <div className="max-w-md w-full">
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-neon-purple/20 space-y-4">
            <AccountToolbar />
            <p className="text-white text-lg text-center">
              {missingSubid ? t('accountMissingSubid') : t('unableToLoadAccount')}
            </p>
            {missingSubid && (
              <p className="text-white/60 text-sm text-center">{t('accountMissingSubidHint')}</p>
            )}
            <button
              onClick={() => subscriptionService.redirectToCampaign()}
              className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold py-3 px-6 rounded-lg"
            >
              {t('subscribeNow')}
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const isSubscribed = subscriptionService.isAccountSubscribed(details);

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
          <AccountToolbar />

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
              <div className={`rounded-lg p-3 ${isSubscribed ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
                {isSubscribed ? t('active') : t('inactive')}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-700 space-y-3">
              {isSubscribed ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUnsubscribe}
                  disabled={isUnsubscribing}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {isUnsubscribing ? t('unsubscribing') : t('unsubscribe')}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubscribe}
                  className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/80 hover:to-neon-purple/80 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {t('subscribeNow')}
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-slate-600"
              >
                {t('logout')}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
