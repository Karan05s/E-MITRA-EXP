'use client';

import { useState } from 'react';
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
import { Loader, User, MapPin, AlertTriangle, Search } from 'lucide-react';
import { getUserById } from '@/services/user-service';
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
  clickableIcons: false,
};

export default function AdminPage() {
  const [userId, setUserId] = useState('');
  const [trackedUser, setTrackedUser] = useState<UserType | null>(null);
  const [trackedPosition, setTrackedPosition] = useState<Position | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const handleTrackUser = async () => {
    if (!userId.trim()) {
      setError('Please enter a User ID.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setTrackedUser(null);
    setTrackedPosition(null);

    const { user, position } = await getUserById(userId.replace(/\s/g, ''));

    if (user && position) {
      setTrackedUser(user);
      setTrackedPosition(position);
    } else {
      setError('User ID not found.');
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
              Track a user by entering their Unique User ID.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
              <div className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            )}

            {trackedUser && trackedPosition && (
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold">Tracking Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="flex-row items-center space-x-2 pb-2">
                        <User className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">User</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-semibold text-lg">{trackedUser.name}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          ID: {trackedUser.id.replace(/(\d{4})(?=\d)/g, '$1 ')}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex-row items-center space-x-2 pb-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">Last Known Location</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-mono text-sm">
                          Lat: {trackedPosition.latitude.toFixed(5)}
                        </p>
                        <p className="font-mono text-sm">
                          Lon: {trackedPosition.longitude.toFixed(5)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-full h-[300px] md:h-full rounded-lg overflow-hidden border">
                    {isLoaded ? (
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
