'use client';

import { useState, useEffect, useRef } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
} from '@react-google-maps/api';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Loader,
  User,
  MapPin,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { getUserById } from '@/app/actions';
import type { User as UserType, Position } from '@/types';
import Link from 'next/link';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  fullscreenControl: true,
  clickableIcons: false,
};

const LIBRARIES = ['places'];
const TRACKING_INTERVAL = 3000; // 3 seconds

export default function AdminPage() {
  const [userId, setUserId] = useState('');
  const [trackedUser, setTrackedUser] = useState<UserType | null>(null);
  const [trackedPosition, setTrackedPosition] = useState<Position | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: LIBRARIES as any,
  });

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  const startTracking = (userIdToTrack: string) => {
    stopTracking(); // Stop any existing tracking

    intervalRef.current = setInterval(async () => {
      const result = await getUserById(userIdToTrack);
      if (result.success && result.data?.user) {
        // Only update position if it's available
        if (result.data.position) {
          setTrackedPosition(result.data.position);
        }
      }
    }, TRACKING_INTERVAL);
  };

  const handleTrackUser = async () => {
    stopTracking();
    const cleanUserId = userId.replace(/\s/g, '');
    if (!cleanUserId) {
      setError('Please enter a User ID.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setTrackedUser(null);
    setTrackedPosition(null);

    const result = await getUserById(cleanUserId);

    // Check if the user was found, even if position is not yet available.
    if (result.success && result.data?.user) {
      setTrackedUser(result.data.user);
      // Set position if it exists, otherwise it remains null
      setTrackedPosition(result.data.position);
      // Start polling for location updates immediately.
      startTracking(cleanUserId);
    } else {
      setError('User ID not found or user has no position data yet.');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-4 md:p-6">
      <header className="w-full max-w-4xl">
        <Link href="/" className="inline-block">
          <Logo />
        </Link>
      </header>
      <main className="w-full max-w-4xl flex-grow pt-8">
        <Card className="w-full shadow-xl border-2">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">
              Administrator Panel
            </CardTitle>
            <CardDescription>
              Track a user's live location by entering their Unique User ID.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Tracking Section */}
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="text"
                placeholder="Enter User ID..."
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrackUser()}
                disabled={isLoading}
              />
              <Button onClick={handleTrackUser} disabled={isLoading}>
                {isLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span className="ml-2 hidden sm:inline">Track User</span>
              </Button>
            </div>

            {error && (
              <div className="text-destructive flex items-center gap-2 mt-2">
                <AlertTriangle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            )}

            {trackedUser && (
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold">Live Tracking Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="flex-row items-center space-x-2 pb-2">
                        <User className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">User</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-semibold text-lg">
                          {trackedUser.name}
                        </p>
                        <p className="text-sm text-muted-foreground font-mono">
                          ID: {trackedUser.id.replace(/(\d{4})(?=\d)/g, '$1 ')}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex-row items-center space-x-2 pb-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">
                          Live Location
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {trackedPosition ? (
                          <>
                            <p className="font-mono text-sm">
                              Lat: {trackedPosition.latitude.toFixed(5)}
                            </p>
                            <p className="font-mono text-sm">
                              Lon: {trackedPosition.longitude.toFixed(5)}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Waiting for location data...
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-full h-[300px] md:h-full rounded-lg overflow-hidden border">
                    {isLoaded && trackedPosition ? (
                      <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={{
                          lat: trackedPosition.latitude,
                          lng: trackedPosition.longitude,
                        }}
                        zoom={15}
                        options={mapOptions}
                      >
                        <MarkerF
                          position={{
                            lat: trackedPosition.latitude,
                            lng: trackedPosition.longitude,
                          }}
                        />
                      </GoogleMap>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Loader className="animate-spin text-muted-foreground" />
                        <span className="ml-2 text-muted-foreground">
                          {isLoaded
                            ? 'Waiting for location...'
                            : 'Loading map...'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
