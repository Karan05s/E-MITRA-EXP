// In a real application, this data would likely be fetched from a secure API.
// For this prototype, we define it statically.

// Each zone is a circle defined by a center (lat, lng) and a radius in meters.
export const redZones = [
  {
    // Example Red Zone 1: Hamidia Road Area, Bhopal
    center: { lat: 23.2594, lng: 77.4037 }, 
    radius: 700, // 700 meters
  },
  {
    // Example Red Zone 2: Near Bhopal Junction Railway Station
    center: { lat: 23.2666, lng: 77.4203 },
    radius: 800, // 800 meters
  },
   {
    // Example Red Zone 3: A part of Old Bhopal
    center: { lat: 23.2530, lng: 77.4093 },
    radius: 600, // 600 meters
  },
];
