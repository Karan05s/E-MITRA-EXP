'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/use-user';
import { Header } from '@/components/dashboard/header';
import { LocationCard } from '@/components/dashboard/location-card';
import { ActionsBar } from '@/components/dashboard/actions-bar';
import { SosModal } from '@/components/dashboard/sos-modal';
import { SuggestionsModal } from '@/components/dashboard/suggestions-modal';
import { TranslationModal } from '@/components/dashboard/translation-modal';
import { EmergencyChatModal } from '@/components/dashboard/emergency-chat-modal';
import { ReportIncidentModal } from '@/components/dashboard/report-incident-modal';
import { ProfileSidebar } from '@/components/dashboard/profile-sidebar';
import { Logo } from '@/components/logo';
import { Skeleton } from '@/components/ui/skeleton';
import type { Position, EmergencyContact } from '@/types';
import { UserIDCard } from '@/components/dashboard/user-id-card';
import { useJsApiLoader } from '@react-google-maps/api';
import { RotatingArtBackground } from '@/components/auth/rotating-art-background';

const LIBRARIES = ['places'];
const EMERGENCY_CONTACTS_KEY = 'e-mitra-emergency-contacts';


const DashboardLoadingSkeleton: FC = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
    <div className="flex w-full max-w-2xl flex-col items-center gap-8">
      <Logo />
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-16 w-full rounded-full" />
    </div>
  </div>
);

export default function DashboardPage() {
  const { user, isLoading, logout } = useUser();
  const [isSosOpen, setSosOpen] = useState(false);
  const [isSuggestionsOpen, setSuggestionsOpen] = useState(false);
  const [isTranslationOpen, setTranslationOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const [isReportOpen, setReportOpen] = useState(false);
  const [isProfileSidebarOpen, setProfileSidebarOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  const { isLoaded: isMapLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: LIBRARIES as any,
  });

  // Load contacts from localStorage on initial render
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(EMERGENCY_CONTACTS_KEY);
      if (item) {
        setEmergencyContacts(JSON.parse(item));
      }
    } catch (error) {
      console.error('Failed to parse emergency contacts from localStorage', error);
    }
  }, []);

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    try {
      window.localStorage.setItem(EMERGENCY_CONTACTS_KEY, JSON.stringify(emergencyContacts));
    } catch (error) {
       console.error('Failed to save emergency contacts to localStorage', error);
    }
  }, [emergencyContacts]);


  if (isLoading || !user) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <>
      <div className="relative flex min-h-screen flex-col bg-background overflow-hidden">
        <RotatingArtBackground animationSpeed="slow" />
        <div className="relative z-10 flex flex-col flex-grow bg-background/80 backdrop-blur-sm">
          <Header
            user={user}
            onLogout={logout}
            onProfileClick={() => setProfileSidebarOpen(true)}
          />
          <main className="flex-grow p-4 md:p-6">
            <div className="mx-auto max-w-4xl space-y-6">
              <UserIDCard user={user} />
              <LocationCard 
                onPositionChange={setPosition} 
                isMapLoaded={isMapLoaded} 
              />
            </div>
          </main>
          <ActionsBar
            onSos={() => setSosOpen(true)}
            onSuggestions={() => setSuggestionsOpen(true)}
            onTranslate={() => setTranslationOpen(true)}
            onChat={() => setChatOpen(true)}
            onReport={() => setReportOpen(true)}
          />
        </div>
        {/* Modals & Sidebars */}
        <SosModal
          isOpen={isSosOpen}
          onOpenChange={setSosOpen}
          position={position}
          user={user}
          emergencyContacts={emergencyContacts}
          isMapLoaded={isMapLoaded}
        />
        <SuggestionsModal
          isOpen={isSuggestionsOpen}
          onOpenChange={setSuggestionsOpen}
          position={position}
        />
        <TranslationModal
          isOpen={isTranslationOpen}
          onOpenChange={setTranslationOpen}
        />
        <EmergencyChatModal
          isOpen={isChatOpen}
          onOpenChange={setChatOpen}
        />
        <ReportIncidentModal
          isOpen={isReportOpen}
          onOpenChange={setReportOpen}
          position={position}
        />
        <ProfileSidebar
          isOpen={isProfileSidebarOpen}
          onOpenChange={setProfileSidebarOpen}
          user={user}
          emergencyContacts={emergencyContacts}
          onEmergencyContactsChange={setEmergencyContacts}
        />
      </div>
    </>
  );
}
