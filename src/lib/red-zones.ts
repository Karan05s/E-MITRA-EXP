// In a real application, this data would likely be fetched from a secure API.
// For this prototype, we define it statically.

// Each zone is a circle defined by a center (lat, lng) and a radius in meters.
export const redZones = [
  // Higher Risk Areas
  {
    // MP Nagar
    center: { lat: 23.235, lng: 77.436 },
    radius: 1500,
  },
  {
    // Govindpura
    center: { lat: 23.238, lng: 77.465 },
    radius: 1200,
  },
  {
    // Piplani
    center: { lat: 23.24, lng: 77.47 },
    radius: 1000,
  },
  {
    // Kolar
    center: { lat: 23.18, lng: 77.38 },
    radius: 2000,
  },
  {
    // Ashoka Garden
    center: { lat: 23.26, lng: 77.44 },
    radius: 1500,
  },
  {
    // Kamla Nagar
    center: { lat: 23.21, lng: 77.38 },
    radius: 1000,
  },
  {
    // Bag Sewania
    center: { lat: 23.2, lng: 77.43 },
    radius: 1200,
  },
  // Dark Spots
  {
    // TT Nagar
    center: { lat: 23.23, lng: 77.41 },
    radius: 1000,
  },
  {
    // Barah Daftar (approximated within Old Bhopal)
    center: { lat: 23.25, lng: 77.4 },
    radius: 800,
  },
];
