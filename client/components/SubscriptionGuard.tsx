import { useEffect, useState } from 'react';
import { subscriptionService } from '../services/subscriptionService';
import { useI18n } from '../lib/i18n';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SubscriptionGuard({ children, fallback }: SubscriptionGuardProps) {
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const status = await subscriptionService.checkStatus();
        if (status.status === 1) {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false);
          // Redirect to campaign URL if not subscribed
          subscriptionService.redirectToCampaign();
        }
      } catch (error) {
        console.error('Subscription check failed:', error);
        setIsSubscribed(false);
        subscriptionService.redirectToCampaign();
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">{t('checkingStatus')}</div>
      </div>
    );
  }

  if (!isSubscribed) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">{t('redirectingToSubscription')}</div>
      </div>
    );
  }

  return <>{children}</>;
}