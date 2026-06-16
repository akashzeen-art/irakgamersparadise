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
    subscriptionService.initContentPage().then((result) => {
      if (result.redirected) {
        return;
      }
      setIsSubscribed(result.subscribed);
      setIsLoading(false);
    });
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
