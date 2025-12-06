
import React, { useState, useEffect } from 'react';
import { Language, RecipeResponse, MeatType, MeatWeight, CuisineType, DietMode } from './types';
import { generateRecipeData } from './services/geminiService';
import LanguageToggle from './components/LanguageToggle';
import Hero from './components/Hero';
import RecipeView from './components/RecipeView';
import DietPlanner from './components/DietPlanner';
import AdBanner from './components/AdBanner';
import AdminDashboard from './components/AdminDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import AuthModal from './components/AuthModal';
import { User, LogOut, ChevronDown, Shield } from 'lucide-react';

type ViewMode = 'search' | 'planner' | 'admin';

const AppContent: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  
  // Recipe Search State
  const [recipeResponse, setRecipeResponse] = useState<RecipeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth State
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Check URL params on mount for shared links
  useEffect(() => {
    // Basic check to ensure we can access window.location in this environment
    if (typeof window !== 'undefined' && !window.location.href.startsWith('blob:')) {
      const params = new URLSearchParams(window.location.search);
      const query = params.get('q');
      
      if (query) {
         const meat = (params.get('meat') as MeatType) || null;
         const weight = (params.get('weight') as MeatWeight) || '1kg';
         const cuisine = (params.get('cuisine') as CuisineType) || 'Desi';
         const diet = (params.get('diet') as DietMode) || 'Standard';
         
         handleSearch(query, meat, weight, cuisine, diet);
      }
    }
  }, []);

  const handleSearch = async (query: string, meatType: MeatType, meatWeight: MeatWeight, cuisineType: CuisineType, dietMode: DietMode) => {
    setLoading(true);
    setError(null);
    
    // Update URL without reloading
    const params = new URLSearchParams();
    params.set('q', query);
    if (meatType) params.set('meat', meatType);
    if (meatWeight) params.set('weight', meatWeight);
    if (cuisineType) params.set('cuisine', cuisineType);
    if (dietMode) params.set('diet', dietMode);
    
    try {
      // Skip history updates in blob/sandbox environments to avoid SecurityError
      if (!window.location.href.startsWith('blob:')) {
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, '', newUrl);
      }
    } catch (err) {
      // Silently ignore history errors in restricted environments
    }

    try {
      const data = await generateRecipeData(query, meatType, meatWeight, cuisineType, dietMode);
      if (data.matched_recipes.length === 0) {
        setError("No recipes found matching your criteria. Try different ingredients or keywords.");
        setRecipeResponse(null);
      } else {
        setRecipeResponse(data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate recipe. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setRecipeResponse(null);
    setError(null);
    // Clear query params when going back
    try {
      if (!window.location.href.startsWith('blob:')) {
        window.history.pushState({}, '', window.location.pathname);
      }
    } catch (err) {
      // Silently ignore history errors
    }
  };

  const openAuth = (view: 'login' | 'register') => {
    setAuthView(view);
    setIsAuthModalOpen(true);
  };

  // If Admin Dashboard is active, render it exclusively (it handles its own layout)
  if (viewMode === 'admin' && user?.role === 'admin') {
      return <AdminDashboard onBack={() => setViewMode('search')} />;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 relative selection:bg-orange-200">
      {/* Texture Overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

      <header className="fixed top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-50 backdrop-blur-md bg-white/80 border-b border-stone-200/50 shadow-sm transition-all">
        <div 
          className="font-serif font-bold text-xl md:text-2xl text-orange-900 cursor-pointer flex items-center gap-2 hover:scale-105 transition-transform"
          onClick={() => {
            handleBack();
            setViewMode('search');
          }}
        >
           <span className="text-3xl filter drop-shadow-sm">🥘</span> 
           <span className="hidden md:inline tracking-tight">DesiDastarkhwan</span>
        </div>
        
        <div className="flex items-center gap-3">
          <LanguageToggle currentLang={lang} onToggle={setLang} />
          
          {/* User Menu */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-orange-900 hidden sm:block">{user.name.split(' ')[0]}</span>
                <ChevronDown size={16} className={`text-orange-700 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-100 py-2 animate-fade-in-up">
                  <div className="px-4 py-2 border-b border-stone-100 mb-2">
                    <p className="text-xs text-stone-400 font-bold uppercase">Signed in as</p>
                    <p className="text-sm font-bold text-stone-800 truncate">{user.email}</p>
                    {user.role === 'admin' && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase">Admin</span>
                    )}
                  </div>
                  
                  {user.role === 'admin' && (
                      <button 
                        onClick={() => { setViewMode('admin'); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-stone-700 hover:bg-stone-50 text-sm font-bold flex items-center gap-2"
                      >
                        <Shield size={16} /> Admin Panel
                      </button>
                  )}

                  <button 
                    onClick={() => { logout(); setIsUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm font-bold flex items-center gap-2"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => openAuth('login')}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 text-white text-sm font-bold hover:bg-orange-600 transition-colors shadow-md"
            >
              <User size={16} /> <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-10 min-h-screen flex flex-col">
        
        {/* Global Top Banner Ad */}
        <div className="container mx-auto max-w-5xl px-4">
           <AdBanner size="leaderboard" className="mt-0 mb-8" />
        </div>

        {viewMode === 'planner' ? (
           <DietPlanner onBack={() => setViewMode('search')} lang={lang} />
        ) : (
           <>
             {error && (
               <div className="max-w-md mx-auto mt-4 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-center animate-bounce shadow-xl">
                 {error}
               </div>
             )}

             {loading && !recipeResponse && (
               <div className="flex-1 flex flex-col items-center justify-center animate-pulse">
                 <div className="w-24 h-24 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-6 shadow-lg shadow-orange-200/50"></div>
                 <p className="text-2xl text-stone-600 font-serif font-medium">
                    {lang === 'ur' ? 'باورچی خانے کے راز کھل رہے ہیں...' : lang === 'roman' ? 'Bawarchi khanay ke raaz khul rahay hain...' : 'Consulting the Master Chefs...'}
                 </p>
               </div>
             )}

             {!loading && !recipeResponse && (
               <Hero 
                 lang={lang} 
                 onSearch={handleSearch} 
                 loading={loading} 
                 onOpenPlanner={() => {
                   if (!user) {
                     openAuth('register');
                   } else {
                     setViewMode('planner');
                   }
                 }}
                 user={user}
               />
             )}

             {recipeResponse && !loading && (
               <RecipeView recipeResponse={recipeResponse} lang={lang} onBack={handleBack} />
             )}
           </>
        )}
      </main>

      <footer className="relative z-10 py-8 text-center text-stone-400 text-sm border-t border-stone-200 bg-white">
        <p className="font-medium">&copy; {new Date().getFullYear()} DesiDastarkhwan. Powered by Gemini AI.</p>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialView={authView}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SettingsProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
    </SettingsProvider>
  );
};

export default App;
