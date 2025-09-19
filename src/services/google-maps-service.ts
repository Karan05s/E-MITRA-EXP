'use server';

import type { Position } from '@/types';

const API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const DISTANCE_MATRIX_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json';

interface Place {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

/**
 * Finds nearby places (e.g., police, hospital) using the Google Places API
 * and then finds the one with the shortest walking distance using the Distance Matrix API.
 */
export async function findNearbyPlaces(
  placeType: string,
  userPosition: Position
): Promise<{
    name: string;
    vicinity: string;
    location: { lat: number; lng: number };
    distanceText: string;
    durationText: string;
    url: string;
} | null> {
  if (!API_KEY) {
    throw new Error('Google Maps API key is not configured.');
  }

  const location = `${userPosition.latitude},${userPosition.longitude}`;

  // 1. Find nearby places using Places API
  const searchUrl = new URL(BASE_URL);
  searchUrl.searchParams.append('location', location);
  searchUrl.searchParams.append('rankby', 'distance');
  searchUrl.searchParams.append('type', placeType);
  searchUrl.searchParams.append('keyword', placeType);
  searchUrl.searchParams.append('key', API_KEY);
  
  const searchResponse = await fetch(searchUrl.toString());
  const searchData = await searchResponse.json();

  if (searchData.status !== 'OK' || !searchData.results || searchData.results.length === 0) {
    console.error('Places API search failed:', searchData.status, searchData.error_message);
    return null;
  }
  
  // Take top 5 results to check distance
  const nearbyPlaces: Place[] = searchData.results.slice(0, 5);
  const destinations = nearbyPlaces.map(p => `${p.geometry.location.lat},${p.geometry.location.lng}`).join('|');

  // 2. Use Distance Matrix API to find the closest one by walking time
  const matrixUrl = new URL(DISTANCE_MATRIX_URL);
  matrixUrl.searchParams.append('origins', location);
  matrixUrl.searchParams.append('destinations', destinations);
  matrixUrl.searchParams.append('mode', 'walking');
  matrixUrl.searchParams.append('key', API_KEY);

  const matrixResponse = await fetch(matrixUrl.toString());
  const matrixData = await matrixResponse.json();

  if (matrixData.status !== 'OK' || !matrixData.rows?.[0]?.elements) {
     console.error('Distance Matrix API failed:', matrixData.status, matrixData.error_message);
     // Fallback to the first result from nearby search if matrix fails
     const firstPlace = nearbyPlaces[0];
     return {
        name: firstPlace.name,
        vicinity: firstPlace.vicinity,
        location: firstPlace.geometry.location,
        distanceText: 'N/A',
        durationText: 'N/A',
        url: `https://www.google.com/maps/dir/?api=1&origin=${location}&destination=${firstPlace.geometry.location.lat},${firstPlace.geometry.location.lng}&travelmode=walking`
     }
  }

  const elements = matrixData.rows[0].elements;

  let closestPlaceIndex = -1;
  let minDuration = Infinity;

  elements.forEach((element: any, index: number) => {
    if (element.status === 'OK' && element.duration.value < minDuration) {
      minDuration = element.duration.value;
      closestPlaceIndex = index;
    }
  });

  if (closestPlaceIndex === -1) {
    return null; // No valid routes found
  }

  const closestPlace = nearbyPlaces[closestPlaceIndex];
  const closestElement = elements[closestPlaceIndex];
  
  const placeResult = {
    name: closestPlace.name,
    vicinity: closestPlace.vicinity,
    location: closestPlace.geometry.location,
    distanceText: closestElement.distance.text,
    durationText: closestElement.duration.text,
    url: `https://www.google.com/maps/dir/?api=1&origin=${location}&destination=${closestPlace.geometry.location.lat},${closestPlace.geometry.location.lng}&travelmode=walking`,
  };

  return placeResult;
}
