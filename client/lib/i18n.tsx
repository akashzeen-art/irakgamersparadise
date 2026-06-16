import { createContext, useContext, ReactNode } from 'react';
import type { Game } from '../data/games';

export type Lang = 'en' | 'ar';

const CATEGORY_KEYS: Record<string, TranslationKey> = {
  'Top 10 Games': 'top10games',
  'All Games': 'allgames',
  'Easy to Play': 'easytoplay',
  'Puzzle': 'puzzle',
  'Action': 'action',
  'Arcade': 'arcade',
};

export function getGameTitle(game: Game, lang: Lang): string {
  return lang === 'ar' && game.titleAr ? game.titleAr : game.title;
}

export function getCategoryLabel(category: string, t: (key: TranslationKey) => string | string[]): string {
  const key = CATEGORY_KEYS[category];
  return key ? (t(key) as string) : category;
}

export const translations = {
  en: {
    // Navbar
    home: 'Home',
    games: 'Games',
    categories: 'Categories',
    trending: 'Trending',
    gamePro: 'Gamers Paradise',
    myAccount: 'My Account',
    // Hero
    heroPlay: 'Play',
    heroGamesOnline: 'Games Online',
    heroSub: 'Discover hundreds of games instantly. No downloads, no installs — just pure fun.',
    playNow: 'Play Now',
    browseGames: 'Browse Games',
    scrollToExplore: 'Scroll to explore',
    // Featured
    featuredGame: 'Featured Game',
    // Stats
    trustedBy: 'Trusted by',
    millions: 'Millions',
    joinCommunity: 'Join our growing gaming community',
    players: 'Players',
    totalPlays: 'Total Plays',
    // Categories
    gameCategories: 'Game Categories',
    exploreGenres: 'Explore different genres and find your favorite games',
    // Library
    gameLibrary: 'Game Library',
    browseByCategory: 'Browse games by category',
    seeAll: 'See All →',
    // Modal
    back: 'Back',
    tapToPlay: 'Tap to start playing',
    exitFullscreen: 'Exit Fullscreen',
    // Footer
    footerDesc: 'Premium gaming portal with 100+ amazing games for everyone.',
    allRights: 'All rights reserved.',
    designedFor: 'Designed with 🎮 for gamers worldwide',
    // Account page
    accountTitle: 'My Account',
    phoneNumber: 'Phone Number',
    serviceName: 'Service Name',
    validFrom: 'Valid From',
    validTo: 'Valid To',
    subscriptionStatus: 'Subscription Status',
    active: 'Active',
    inactive: 'Inactive',
    unsubscribe: 'Unsubscribe',
    subscribeNow: 'Subscribe Now',
    unsubscribing: 'Unsubscribing...',
    checkingStatus: 'Checking subscription status...',
    redirectingToSubscription: 'Redirecting to subscription...',
    loadingAccountDetails: 'Loading account details...',
    unableToLoadAccount: 'Unable to load account details',
    // Number Entry Popup
    enterPhoneNumber: 'Enter Phone Number',
    enterPhoneToPlay: 'Enter your phone number to play this game',
    checking: 'Checking...',
    subscriptionRequired: 'Subscription required to play games',
    playRandomGame: 'Play Random Game',
    // Typewriter words
    words: ['Action', 'Puzzle', 'Arcade', 'Racing', 'Adventure'],
    // Preloader
    preloaderTitle: 'GAMERS PARADISE',
    preloaderSub: 'LOADING EXPERIENCE',
    top10Badge: '⭐ TOP 10',
    unableToVerifySubscription: 'Unable to verify subscription. Redirecting to subscription page...',
    languageEnglish: 'English',
    languageArabic: 'العربية',
    // Game categories (translated names shown in cards)
    topTenGames: 'Top 10 Games',
    allGames: 'All Games',
    easyToPlay: 'Easy to Play',
    puzzle: 'Puzzle',
    action: 'Action',
    arcade: 'Arcade',
    top10games: 'Top 10 Games',
    allgames: 'All Games',
    easytoplay: 'Easy to Play',
  },
  ar: {
    // Navbar
    home: 'الرئيسية',
    games: 'الألعاب',
    categories: 'الفئات',
    trending: 'الأكثر شيوعاً',
    gamePro: 'جيمرز بارادايس',
    myAccount: 'حسابي',
    // Hero
    heroPlay: 'العب',
    heroGamesOnline: 'ألعاباً أونلاين',
    heroSub: 'اكتشف مئات الألعاب فوراً. بدون تنزيل، بدون تثبيت — متعة خالصة.',
    playNow: 'العب الآن',
    browseGames: 'تصفح الألعاب',
    scrollToExplore: 'مرر للاستكشاف',
    // Featured
    featuredGame: 'لعبة مميزة',
    // Stats
    trustedBy: 'موثوق به من قِبَل',
    millions: 'الملايين',
    joinCommunity: 'انضم إلى مجتمع الألعاب المتنامي',
    players: 'اللاعبون',
    totalPlays: 'إجمالي الجلسات',
    // Categories
    gameCategories: 'فئات الألعاب',
    exploreGenres: 'استكشف الأنواع المختلفة وابحث عن ألعابك المفضلة',
    // Library
    gameLibrary: 'مكتبة الألعاب',
    browseByCategory: 'تصفح الألعاب حسب الفئة',
    seeAll: 'عرض الكل →',
    // Modal
    back: 'رجوع',
    tapToPlay: 'اضغط للبدء',
    exitFullscreen: 'خروج من ملء الشاشة',
    // Footer
    footerDesc: 'بوابة ألعاب متميزة تضم أكثر من 100 لعبة رائعة للجميع.',
    allRights: 'جميع الحقوق محفوظة.',
    designedFor: 'صُمِّم بـ 🎮 للاعبين حول العالم',
    // Account page
    accountTitle: 'حسابي',
    phoneNumber: 'رقم الهاتف',
    serviceName: 'اسم الخدمة',
    validFrom: 'صالح من',
    validTo: 'صالح حتى',
    subscriptionStatus: 'حالة الاشتراك',
    active: 'نشط',
    inactive: 'غير نشط',
    unsubscribe: 'إلغاء الاشتراك',
    subscribeNow: 'اشترك الآن',
    unsubscribing: 'جارٍ إلغاء الاشتراك...',
    checkingStatus: 'جارٍ فحص حالة الاشتراك...',
    redirectingToSubscription: 'جارٍ التوجيه إلى صفحة الاشتراك...',
    loadingAccountDetails: 'جارٍ تحميل تفاصيل الحساب...',
    unableToLoadAccount: 'غير قادر على تحميل تفاصيل الحساب',
    // Number Entry Popup
    enterPhoneNumber: 'أدخل رقم الهاتف',
    enterPhoneToPlay: 'أدخل رقم هاتفك لتشغيل هذه اللعبة',
    checking: 'جارٍ الفحص...',
    subscriptionRequired: 'يتطلب اشتراك لتشغيل الألعاب',
    playRandomGame: 'العب لعبة عشوائية',
    // Typewriter words
    words: ['أكشن', 'ألغاز', 'أركيد', 'سباقات', 'مغامرات'],
    // Preloader
    preloaderTitle: 'جيمرز بارادايس',
    preloaderSub: 'جارٍ تحميل التجربة',
    top10Badge: '⭐ أفضل 10',
    unableToVerifySubscription: 'تعذّر التحقق من الاشتراك. جارٍ التوجيه إلى صفحة الاشتراك...',
    languageEnglish: 'English',
    languageArabic: 'العربية',
    // Game categories (translated names shown in cards)
    topTenGames: 'أفضل 10 ألعاب',
    allGames: 'جميع الألعاب',
    easyToPlay: 'سهلة اللعب',
    puzzle: 'ألغاز',
    action: 'أكشن',
    arcade: 'أركيد',
    top10games: 'أفضل 10 ألعاب',
    allgames: 'جميع الألعاب',
    easytoplay: 'سهلة اللعب',
  },
};

export type TranslationKey = keyof typeof translations.en;

interface I18nContextType {
  lang: Lang;
  t: (key: TranslationKey) => string | string[];
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  t: (key) => translations.en[key] as string,
  isRTL: false,
});

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const t = (key: TranslationKey) => translations[lang][key] as string | string[];
  return (
    <I18nContext.Provider value={{ lang, t, isRTL: lang === 'ar' }}>
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
