import { useEffect, useState } from 'react';
import { subscriptionService } from '../services/subscriptionService';

export function useSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    subscriptionService.initContentPage().then((result) => {
      if (cancelled || result.redirected) {
        return;
      }
      setIsSubscribed(result.subscribed);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { isSubscribed, isLoading };
}
