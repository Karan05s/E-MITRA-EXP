'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader, AlertTriangle } from 'lucide-react';
import type { Position } from '@/types';
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  CircleF,
} from '@react-google-maps/api';
import { redZones } from '@/lib/red-zones';
import { useToast } from '@/hooks/use-toast';

interface LocationCardProps {
  onPositionChange: (position: Position | null) => void;
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

export function LocationCard({ onPositionChange }: LocationCardProps) {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });
  const { toast } = useToast();
  const [activeToastId, setActiveToastId] = useState<string | null>(null);

  // Memoize map options to prevent re-renders
  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      zoomControl: true,
      clickableIcons: false,
    }),
    []
  );

  const redZoneCircleOptions = useMemo(
    () => ({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
    }),
    []
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
        // Dismiss the toast if the user leaves the red zone
        // This part is tricky because use-toast doesn't have a direct dismiss function.
        // For now, we rely on the user to close it. A more robust implementation
        // would involve enhancing the toast hook.
        setActiveToastId(null); // Allow a new toast if they re-enter
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
  }, [onPositionChange]);

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
    if (isLoaded && position) {
      return (
        <div className="w-full h-full space-y-2">
          <div className="w-full h-full aspect-square">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{ lat: position.latitude, lng: position.longitude }}
              zoom={14}
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
    <Card className="shadow-lg">
      <CardHeader className="flex-row items-center justify-center space-x-2 pb-4">
        <MapPin className="h-5 w-5 text-primary" />
        <CardTitle className="text-xl font-headline">Live Location</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[300px] md:h-auto md:aspect-square items-center justify-center p-2">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
