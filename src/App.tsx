import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoSwitcherBar } from './components/common/DemoSwitcherBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { DemoGuideModal } from './components/common/DemoGuideModal';
import { CitizenDashboard } from './components/citizen/CitizenDashboard';
import { ServiceDetailModal } from './components/citizen/ServiceDetailModal';
import { ApplicationWizard } from './components/citizen/ApplicationWizard';
import { ApplicationTracker } from './components/citizen/ApplicationTracker';
import { CitizenApplicationsList } from './components/citizen/CitizenApplicationsList';
import { CitizenDocumentsView } from './components/citizen/CitizenDocumentsView';
import { OfficerPortal } from './components/officer/OfficerPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CertificateModal } from './components/certificate/CertificateModal';
import { PublicVerificationView } from './components/certificate/PublicVerificationView';
import { AiCitizenAssistant } from './components/ai/AiCitizenAssistant';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    currentView, 
    serviceDetailModal, 
    certificateModal, 
    setCertificateModal,
    toast,
    highContrast 
  } = useApp();

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${
      highContrast 
        ? 'bg-black text-white font-sans' 
        : 'bg-slate-50 text-slate-900 font-sans'
    }`}>
      
      {/* 1. Quick Demo Switcher Bar for Hackathon / Academic Judges */}
      <DemoSwitcherBar />

      {/* 2. Standard 3-Zone Navigation Header */}
      <Navbar />

      {/* 3. Global Toast Notifications */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg border text-xs font-medium bg-slate-900 text-white border-slate-700 animate-slide-left">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* 4. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentView === 'citizen_home' && <CitizenDashboard />}
        {currentView === 'citizen_services' && <CitizenDashboard />}
        {currentView === 'citizen_wizard' && <ApplicationWizard />}
        {currentView === 'citizen_applications' && <CitizenApplicationsList />}
        {currentView === 'citizen_tracking' && <ApplicationTracker />}
        {currentView === 'citizen_documents' && <CitizenDocumentsView />}
        {currentView === 'officer_portal' && <OfficerPortal />}
        {currentView === 'admin_dashboard' && <AdminDashboard />}
        {currentView === 'verify_certificate' && <PublicVerificationView />}
      </main>

      {/* 5. Modals & Overlays */}
      <ServiceDetailModal />
      {certificateModal && (
        <CertificateModal
          certificate={certificateModal}
          onClose={() => setCertificateModal(null)}
        />
      )}
      <NotificationDrawer />
      <DemoGuideModal />
      <AiCitizenAssistant />

      {/* 6. Footer */}
      <Footer />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
