// In a real application, this data would likely be fetched from a secure API.
// For this prototype, we define it statically.

// Each zone is a circle defined by a center (lat, lng) and a radius in meters.
export const redZones = [
  {
    // Example Red Zone 1: A sample location
    center: { lat: 28.6139, lng: 77.2090 }, // Approx. Connaught Place, Delhi
    radius: 500, // 500 meters
  },
  {
    // Example Red Zone 2: Another sample location
    center: { lat: 19.0760, lng: 72.8777 }, // Approx. Bandra, Mumbai
    radius: 750, // 750 meters
  },
   {
    // Example Red Zone 3: A larger area
    center: { lat: 12.9716, lng: 77.5946 }, // Approx. Bengaluru City
    radius: 1000, // 1 kilometer
  },
];
