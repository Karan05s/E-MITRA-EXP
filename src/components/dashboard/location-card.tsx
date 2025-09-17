'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader, AlertTriangle, Expand } from 'lucide-react';
import type { Position, User } from '@/types';
import {
  GoogleMap,
  MarkerF,
  CircleF,
} from '@react-google-maps/api';
import { redZones } from '@/lib/red-zones';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { updateUserPosition } from '@/app/actions';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LocationCardProps {
  onPositionChange: (position: Position | null) => void;
  isMapLoaded: boolean;
}

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
};

// Haversine formula to calculate distance between two lat/lng points
function getDistance(
  pos1: { lat: number; lng: number },
  pos2: { lat: number; lng: number }
) {
  const R = 6371e3; // metres
  const φ1 = (pos1.lat * Math.PI) / 180;
  const φ2 = (pos2.lat * Math.PI) / 180;
  const Δφ = ((pos2.lat - pos1.lat) * Math.PI) / 180;
  const Δλ = ((pos2.lng - pos1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
}

const redZoneCircleOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    clickableIcons: false,
};

const MapView = ({ position, zoom = 14 }: { position: Position, zoom?: number }) => (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: position.latitude, lng: position.longitude }}
      zoom={zoom}
      options={mapOptions}
    >
      <MarkerF
        position={{ lat: position.latitude, lng: position.longitude }}
      />
      {redZones.map((zone, index) => (
        <CircleF
          key={index}
          center={zone.center}
          radius={zone.radius}
          options={redZoneCircleOptions}
        />
      ))}
    </GoogleMap>
  );


export function LocationCard({ onPositionChange, isMapLoaded }: LocationCardProps) {
  const { user } = useUser();
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [activeToastId, setActiveToastId] = useState<string | null>(null);
  const [isMapExpanded, setMapExpanded] = useState(false);

  // Debounce the database update to avoid excessive writes
  const debouncedUpdatePosition = useDebouncedCallback(
    (userId: string, newPosition: Position) => {
      updateUserPosition(userId, newPosition);
    },
    2000 // Only update every 2 seconds
  );

  // Geofencing logic
  useEffect(() => {
    if (!position) return;

    const userLatLng = { lat: position.latitude, lng: position.longitude };
    let isInRedZone = false;

    for (const zone of redZones) {
      const distance = getDistance(userLatLng, zone.center);
      if (distance <= zone.radius) {
        isInRedZone = true;
        break;
      }
    }

    if (isInRedZone) {
      if (!activeToastId) {
        const { id } = toast({
          variant: 'destructive',
          title: 'You are in a High-Risk Zone',
          description: 'Be careful with your stuff and members.',
          duration: Infinity, // Keep toast open until dismissed
        });
        setActiveToastId(id);

        // Vibrate 3 times if the API is supported
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200, 100, 200]);
        }
      }
    } else {
      if (activeToastId) {
        // This is a bit of a hack. Since we can't programmatically dismiss,
        // we'll just allow a new toast if they re-enter a zone.
        setActiveToastId(null);
      }
    }
  }, [position, toast, activeToastId]);

  useEffect(() => {
    let watchId: number;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const newPosition = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          setPosition(newPosition);
          onPositionChange(newPosition);
          if (user?.id) {
            debouncedUpdatePosition(user.id, newPosition);
          }
          setError(null);
        },
        (err) => {
          let message = 'An unknown error occurred.';
          switch (err.code) {
            case err.PERMISSION_DENIED:
              message =
                'Location access denied. Please enable it in your browser settings.';
              break;
            case err.POSITION_UNAVAILABLE:
              message = 'Location information is unavailable.';
              break;
            case err.TIMEOUT:
              message = 'The request to get user location timed out.';
              break;
          }
          setError(message);
          onPositionChange(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      onPositionChange(null);
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [onPositionChange, user, debouncedUpdatePosition]);

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-destructive">
          <AlertTriangle className="mb-2 h-8 w-8" />
          <p className="font-semibold">Location Error</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }
    if (isMapLoaded && position) {
      return (
        <div className="w-full h-full space-y-2 relative group">
          <div className="w-full h-full aspect-square">
            <MapView position={position} />
          </div>
          <div className="absolute top-1 right-1">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8"
              onClick={() => setMapExpanded(true)}
              title="Expand Map"
            >
              <Expand className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center">
            <div className="font-mono text-sm text-muted-foreground">
              <span>Lat: {position.latitude.toFixed(5)}</span>
              <span className="ml-4">
                Lon: {position.longitude.toFixed(5)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
        <Loader className="mb-2 h-8 w-8 animate-spin" />
        <p>Acquiring your location...</p>
      </div>
    );
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader className="flex-row items-center justify-center space-x-2 pb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-headline">Live Location</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] md:h-auto md:aspect-square items-center justify-center p-2">
          {renderContent()}
        </CardContent>
      </Card>

      <Dialog open={isMapExpanded} onOpenChange={setMapExpanded}>
        <DialogContent className="h-[90vh] w-[95vw] max-w-7xl p-2 md:p-4">
          {isMapLoaded && position && (
            <div className="w-full h-full">
               <MapView position={position} zoom={15}/>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
