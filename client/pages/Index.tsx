import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { Preloader } from '../components/Preloader';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import { GameLibrary } from '../components/GameLibrary';
import { CategoriesSection } from '../components/CategoriesSection';
import { StatsSection } from '../components/StatsSection';
import { NewsletterSection } from '../components/NewsletterSection';
import { Footer } from '../components/Footer';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { useSubscription } from '../hooks/useSubscription';

export default function Index() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useI18n();
  useSubscription();

  const gamesRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const handleNavClick = (name: string) => {
    if (name === 'Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (name === 'Games') {
      setSelectedCategory('All');
      setTimeout(() => {
        gamesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else if (name === 'Categories') {
      setTimeout(() => {
        categoriesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else if (name === 'Trending') {
      setSelectedCategory('Top 10 Games');
      setTimeout(() => {
        gamesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else if (name === 'Account') {
      navigate((lang === 'ar' ? '/ar/account' : '/account') + location.search);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setTimeout(() => {
      gamesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  useEffect(() => {
    document.body.style.overflow = showPreloader ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showPreloader]);

  return (
    <div className="bg-slate-950 min-h-screen">
      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}

      {!showPreloader && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatedBackground />
          <Navbar onNavClick={handleNavClick} />
          <main className="pt-16 relative z-10">
            <HeroSection onPlayClick={() => handleNavClick('Games')} />
            <FeaturedCarousel />
            <div ref={categoriesRef}>
              <CategoriesSection onCategorySelect={handleCategorySelect} />
            </div>
            <div ref={gamesRef}>
              <GameLibrary selectedCategory={selectedCategory} onCategoryChange={handleCategorySelect} />
            </div>
            <StatsSection />
          </main>
          <Footer />
        </motion.div>
      )}
    </div>
  );
}
