import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Globe, 
  Eye, 
  Menu, 
  X, 
  Bot, 
  FileText, 
  LayoutDashboard, 
  ShieldCheck
} from 'lucide-react';
import { AppLanguage } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    currentView, 
    setCurrentView, 
    notifications, 
    language, 
    setLanguage, 
    highContrast, 
    toggleHighContrast,
    setIsNotificationDrawerOpen,
    setIsAiAssistantOpen,
    t 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleNavClick = (view: any) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-30 transition-colors border-b ${
      highContrast 
        ? 'bg-black text-white border-white' 
        : 'bg-white/95 backdrop-blur-md text-slate-800 border-slate-200 shadow-xs'
    }`}>
      {/* Top Bar: Exactly 3 Zones as per universal frontend contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleNavClick(currentUser.role === 'officer' ? 'officer_portal' : currentUser.role === 'admin' ? 'admin_dashboard' : 'citizen_home')}
            className="flex items-center gap-2 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-700 text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:bg-indigo-800 transition-colors">
              G
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                GovFlow
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-normal mt-0.5">
                Public Service Prototype
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {currentUser.role === 'citizen' && (
            <>
              <button
                onClick={() => handleNavClick('citizen_home')}
                className={`transition-colors py-1 ${
                  currentView === 'citizen_home' 
                    ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' 
                    : 'hover:text-slate-900'
                }`}
              >
                {t('navHome')}
              </button>
              <button
                onClick={() => handleNavClick('citizen_services')}
                className={`transition-colors py-1 ${
                  currentView === 'citizen_services' 
                    ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' 
                    : 'hover:text-slate-900'
                }`}
              >
                {t('navServices')}
              </button>
              <button
                onClick={() => handleNavClick('citizen_applications')}
                className={`transition-colors py-1 ${
                  currentView === 'citizen_applications' || currentView === 'citizen_tracking'
                    ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' 
                    : 'hover:text-slate-900'
                }`}
              >
                {t('navApplications')}
              </button>
              <button
                onClick={() => handleNavClick('citizen_documents')}
                className={`transition-colors py-1 ${
                  currentView === 'citizen_documents' 
                    ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' 
                    : 'hover:text-slate-900'
                }`}
              >
                {t('navDocuments')}
              </button>
            </>
          )}

          {currentUser.role === 'officer' && (
            <>
              <button
                onClick={() => handleNavClick('officer_portal')}
                className={`transition-colors py-1 flex items-center gap-1.5 ${
                  currentView === 'officer_portal' 
                    ? 'text-amber-700 font-semibold border-b-2 border-amber-600' 
                    : 'hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Officer Scrutiny Queue</span>
              </button>
              <button
                onClick={() => handleNavClick('admin_dashboard')}
                className="hover:text-slate-900 transition-colors py-1 text-slate-500"
              >
                Department Overview
              </button>
            </>
          )}

          {currentUser.role === 'admin' && (
            <>
              <button
                onClick={() => handleNavClick('admin_dashboard')}
                className={`transition-colors py-1 flex items-center gap-1.5 ${
                  currentView === 'admin_dashboard' 
                    ? 'text-teal-700 font-semibold border-b-2 border-teal-600' 
                    : 'hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Executive Analytics</span>
              </button>
              <button
                onClick={() => handleNavClick('officer_portal')}
                className="hover:text-slate-900 transition-colors py-1 text-slate-500"
              >
                Officer Caseload
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Citizen Assistant Launcher */}
          <button
            onClick={() => setIsAiAssistantOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium flex items-center gap-1.5 border border-indigo-200 transition-colors"
            title="Ask AI Assistant"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>

          {/* Multilingual Selector */}
          <div className="relative inline-flex items-center">
            <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-2 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as AppLanguage)}
              aria-label="Language selector"
              className="pl-7 pr-2 py-1 text-xs font-medium rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="gu">ગુજરાતી</option>
            </select>
          </div>

          {/* High Contrast Accessibility Toggle */}
          <button
            onClick={toggleHighContrast}
            title={highContrast ? 'Normal Contrast' : 'High Contrast Mode'}
            aria-label="Toggle high contrast mode"
            className={`p-1.5 rounded-md border text-xs transition-colors ${
              highContrast 
                ? 'bg-amber-400 text-black border-amber-500 font-bold' 
                : 'border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setIsNotificationDrawerOpen(true)}
            title="Open Notifications"
            aria-label="Notifications"
            className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-1.5 rounded-md md:hidden border border-slate-200 text-slate-700"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {currentUser.role === 'citizen' && (
            <>
              <button
                onClick={() => handleNavClick('citizen_home')}
                className="w-full text-left py-2 px-3 rounded-md hover:bg-slate-100 text-sm font-medium text-slate-700"
              >
                {t('navHome')}
              </button>
              <button
                onClick={() => handleNavClick('citizen_services')}
                className="w-full text-left py-2 px-3 rounded-md hover:bg-slate-100 text-sm font-medium text-slate-700"
              >
                {t('navServices')}
              </button>
              <button
                onClick={() => handleNavClick('citizen_applications')}
                className="w-full text-left py-2 px-3 rounded-md hover:bg-slate-100 text-sm font-medium text-slate-700"
              >
                {t('navApplications')}
              </button>
              <button
                onClick={() => handleNavClick('citizen_documents')}
                className="w-full text-left py-2 px-3 rounded-md hover:bg-slate-100 text-sm font-medium text-slate-700"
              >
                {t('navDocuments')}
              </button>
            </>
          )}

          {currentUser.role === 'officer' && (
            <button
              onClick={() => handleNavClick('officer_portal')}
              className="w-full text-left py-2 px-3 rounded-md hover:bg-slate-100 text-sm font-medium text-slate-700"
            >
              Officer Portal
            </button>
          )}

          {currentUser.role === 'admin' && (
            <button
              onClick={() => handleNavClick('admin_dashboard')}
              className="w-full text-left py-2 px-3 rounded-md hover:bg-slate-100 text-sm font-medium text-slate-700"
            >
              Admin Dashboard
            </button>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Signed in as: <strong>{currentUser.name}</strong></span>
            <span className="uppercase text-[10px] tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-700">
              {currentUser.role}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
