'use client';

import { useState, useEffect } from 'react';
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
  RefreshCw,
  Users,
  Lock,
} from 'lucide-react';
import { getUserById } from '@/services/user-service';
import { getAllActiveUsers } from '@/app/actions';
import type { User as UserType, Position } from '@/types';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

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

const LIBRARIES = ['places'];

export default function AdminPage() {
  const [userId, setUserId] = useState('');
  const [trackedUser, setTrackedUser] = useState<UserType | null>(null);
  const [trackedPosition, setTrackedPosition] = useState<Position | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeUsers, setActiveUsers] = useState<UserType[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  const [usersPassword, setUsersPassword] = useState('');
  const [isUsersSectionUnlocked, setIsUsersSectionUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: LIBRARIES as any,
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

  const fetchActiveUsers = async () => {
    setIsLoadingUsers(true);
    setUsersError(null);
    const result = await getAllActiveUsers();
    if (result.success && result.data) {
      setActiveUsers(result.data);
    } else {
      setUsersError(result.error || 'Could not fetch users.');
    }
    setIsLoadingUsers(false);
  };
  
  const handleUnlockUsers = () => {
    if (usersPassword === '865524') {
      setIsUsersSectionUnlocked(true);
      setPasswordError(null);
      fetchActiveUsers();
    } else {
      setPasswordError('Incorrect password.');
    }
  };

  useEffect(() => {
    if (isUsersSectionUnlocked) {
      fetchActiveUsers();
    }
  }, [isUsersSectionUnlocked]);

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
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Tracking Section */}
            <div>
              <CardDescription className="mb-2">
                Track a user by entering their Unique User ID.
              </CardDescription>
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
                            Last Known Location
                          </CardTitle>
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
            </div>

            <Separator />

            {/* Active Users Section */}
            <div>
              {!isUsersSectionUnlocked ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-headline flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Unlock Active Users List
                  </h3>
                   <p className="text-muted-foreground text-sm">
                    Enter the password to view the list of all active users.
                  </p>
                  <div className="flex w-full max-w-xs items-center space-x-2">
                    <Input
                      type="password"
                      placeholder="Enter password..."
                      value={usersPassword}
                      onChange={(e) => setUsersPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUnlockUsers()}
                    />
                    <Button onClick={handleUnlockUsers}>Unlock</Button>
                  </div>
                   {passwordError && (
                    <div className="text-destructive flex items-center gap-2 mt-2">
                      <AlertTriangle className="h-4 w-4" />
                      <p>{passwordError}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-headline flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Active Users
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        A list of all currently active users.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={fetchActiveUsers}
                      disabled={isLoadingUsers}
                    >
                      {isLoadingUsers ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      <span className="sr-only">Refresh User List</span>
                    </Button>
                  </div>

                  {isLoadingUsers && <p>Loading users...</p>}
                  {usersError && (
                    <p className="text-destructive">{usersError}</p>
                  )}
                  {!isLoadingUsers &&
                    !usersError &&
                    (activeUsers.length > 0 ? (
                      <ul className="space-y-3">
                        {activeUsers.map((user) => (
                          <li
                            key={user.id}
                            className="flex items-center justify-between rounded-lg border p-3"
                          >
                            <span className="font-semibold">{user.name}</span>
                            <span className="font-mono text-sm text-muted-foreground">
                              {user.id.replace(/(\d{4})(?=\d)/g, '$1 ')}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No active users found.
                      </p>
                    ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
