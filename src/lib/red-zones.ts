// In a real application, this data would likely be fetched from a secure API.
// For this prototype, we define it statically.

// Each zone is a circle defined by a center (lat, lng) and a radius in meters.
export const redZones = [
  // Arunachal Pradesh
  {
    center: { lat: 27.1185, lng: 95.7352 }, // Changlang (town)
    radius: 500,
  },
  {
    center: { lat: 26.3950, lng: 95.3060 }, // Longding (town)
    radius: 500,
  },
  {
    center: { lat: 27.0155, lng: 95.5625 }, // Tirap (Khonsa)
    radius: 500,
  },
  {
    center: { lat: 27.0844, lng: 93.6053 }, // Pare (Itanagar/Naharlagun)
    radius: 500,
  },
  {
    center: { lat: 27.0930, lng: 93.7380 }, // State Highways (NH-415/NH-13)
    radius: 500,
  },
  {
    center: { lat: 27.3400, lng: 96.0000 }, // SE Forest Belt (Jairampur)
    radius: 500,
  },
  {
    center: { lat: 28.0666, lng: 95.3268 }, // Pasighat (East Siang)
    radius: 500,
  },
  {
    center: { lat: 27.5940, lng: 93.8380 }, // Ziro (Lower Subansiri)
    radius: 500,
  },
  {
    center: { lat: 27.2646, lng: 92.4245 }, // Bomdila (West Kameng)
    radius: 500,
  },
  {
    center: { lat: 27.5860, lng: 91.8690 }, // Tawang (tourist hub)
    radius: 500,
  },
  // Assam
  {
    center: { lat: 26.4038, lng: 90.2709 }, // Kokrajhar (Bodoland)
    radius: 500,
  },
  {
    center: { lat: 26.6833, lng: 90.7167 }, // Chirang (BTAD)
    radius: 500,
  },
  {
    center: { lat: 26.4680, lng: 91.3060 }, // Baksa (BTAD)
    radius: 500,
  },
  {
    center: { lat: 26.7333, lng: 89.9833 }, // Dhubri (border)
    radius: 500,
  },
  {
    center: { lat: 24.8739, lng: 92.3640 }, // Karimganj (border)
    radius: 500,
  },
  {
    center: { lat: 24.9300, lng: 90.1200 }, // South Salmara-Mankachar
    radius: 500,
  },
  {
    center: { lat: 25.0219, lng: 93.0165 }, // Dima Hasao (Haflong)
    radius: 500,
  },
  {
    center: { lat: 26.3500, lng: 92.6833 }, // Nagaon
    radius: 500,
  },
  {
    center: { lat: 26.7433, lng: 92.9722 }, // Hojai
    radius: 500,
  },
  {
    center: { lat: 26.1445, lng: 91.7362 }, // Guwahati
    radius: 500,
  },
  // Manipur
  {
    center: { lat: 24.8170, lng: 93.9368 }, // Imphal (East & West)
    radius: 500,
  },
  {
    center: { lat: 24.3333, lng: 93.6667 }, // Churachandpur
    radius: 500,
  },
  {
    center: { lat: 24.6393, lng: 93.9687 }, // Bishnupur
    radius: 500,
  },
  {
    center: { lat: 24.6464, lng: 94.0714 }, // Thoubal
    radius: 500,
  },
  {
    center: { lat: 24.4950, lng: 93.8670 }, // Tengnoupal
    radius: 500,
  },
  {
    center: { lat: 24.4800, lng: 94.0297 }, // Chandel
    radius: 500,
  },
  {
    center: { lat: 24.8890, lng: 93.0850 }, // Jiribam / Moreh
    radius: 500,
  },
  // Meghalaya
  {
    center: { lat: 25.5196, lng: 90.2201 }, // West Garo Hills (Tura)
    radius: 500,
  },
  {
    center: { lat: 25.7500, lng: 90.2333 }, // South Garo Hills (Baghmara)
    radius: 500,
  },
  {
    center: { lat: 25.5800, lng: 90.3600 }, // East Garo Hills (Williamnagar)
    radius: 500,
  },
  {
    center: { lat: 25.5788, lng: 91.8933 }, // East Khasi Hills (Shillong)
    radius: 500,
  },
  {
    center: { lat: 25.4000, lng: 92.2000 }, // West/East Jaintia Hills
    radius: 500,
  },
  {
    center: { lat: 25.8890, lng: 91.8820 }, // Ri-Bhoi (Nongpoh)
    radius: 500,
  },
  // Mizoram
  {
    center: { lat: 22.5522, lng: 92.9712 }, // Lawngtlai
    radius: 500,
  },
  {
    center: { lat: 22.8879, lng: 92.7826 }, // Lunglei
    radius: 500,
  },
  {
    center: { lat: 23.7271, lng: 92.7176 }, // Aizawl outskirts
    radius: 500,
  },
  {
    center: { lat: 23.9180, lng: 93.2667 }, // Champhai
    radius: 500,
  },
  // Nagaland
  {
    center: { lat: 26.7246, lng: 94.8200 }, // Mon
    radius: 500,
  },
  {
    center: { lat: 25.9192, lng: 94.8366 }, // Kiphire
    radius: 500,
  },
  {
    center: { lat: 25.6700, lng: 94.5800 }, // Phek
    radius: 500,
  },
  {
    center: { lat: 25.6740, lng: 94.1103 }, // Kohima outskirts / Wokha
    radius: 500,
  },
  {
    center: { lat: 25.9040, lng: 93.7300 }, // Dimapur
    radius: 500,
  },
  // Tripura
  {
    center: { lat: 24.0142, lng: 91.8363 }, // North Tripura (Dharmanagar)
    radius: 500,
  },
  {
    center: { lat: 24.0196, lng: 91.9293 }, // Dhalai (Ambassa)
    radius: 500,
  },
  {
    center: { lat: 23.6136, lng: 91.4286 }, // Sepahijala / Unakoti hills
    radius: 500,
  },
  {
    center: { lat: 23.8315, lng: 91.2868 }, // Agartala (city)
    radius: 500,
  },
  // Bhopal
  {
    center: { lat: 23.2682, lng: 77.4644 }, // Narela Shankri / Road
    radius: 500,
  },
  {
    center: { lat: 23.2508, lng: 77.4858 }, // Anand Nagar
    radius: 500,
  },
  {
    center: { lat: 23.2550, lng: 77.5020 }, // Patel Nagar
    radius: 500,
  },
  {
    center: { lat: 23.2504, lng: 77.5250 }, // LNCT Bhopal
    radius: 500,
  },
];
