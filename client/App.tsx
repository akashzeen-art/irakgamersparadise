import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import { Account } from "./pages/Account";
import NotFound from "./pages/NotFound";
import { I18nProvider, Lang } from "./lib/i18n";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function LangWrapper({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <I18nProvider lang={lang}>
      {children}
    </I18nProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LangWrapper lang="en"><Index /></LangWrapper>} />
          <Route path="/content/url" element={<LangWrapper lang="en"><Index /></LangWrapper>} />
          <Route path="/ar" element={<LangWrapper lang="ar"><Index /></LangWrapper>} />
          <Route path="/ar/content/url" element={<LangWrapper lang="ar"><Index /></LangWrapper>} />
          <Route path="/account" element={<LangWrapper lang="en"><Account /></LangWrapper>} />
          <Route path="/ar/account" element={<LangWrapper lang="ar"><Account /></LangWrapper>} />
          <Route path="/game/:id" element={<Navigate to="/" replace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);