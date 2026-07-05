export interface CityProfile {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  displayLabel: string;
  weatherLabel: string;
}

export const SUPPORTED_CITIES: CityProfile[] = [
  { id: 'mumbai', name: 'Mumbai', latitude: 19.0760, longitude: 72.8777, displayLabel: 'Mumbai Command Zone', weatherLabel: 'Mumbai Metro Area' },
  { id: 'delhi', name: 'Delhi', latitude: 28.7041, longitude: 77.1025, displayLabel: 'Delhi Command Zone', weatherLabel: 'NCR Area' },
  { id: 'bengaluru', name: 'Bengaluru', latitude: 12.9716, longitude: 77.5946, displayLabel: 'Bengaluru Command Zone', weatherLabel: 'Bengaluru Metro Area' },
  { id: 'chennai', name: 'Chennai', latitude: 13.0827, longitude: 80.2707, displayLabel: 'Chennai Command Zone', weatherLabel: 'Chennai Metro Area' },
  { id: 'hyderabad', name: 'Hyderabad', latitude: 17.3850, longitude: 78.4867, displayLabel: 'Hyderabad Command Zone', weatherLabel: 'Hyderabad Metro Area' },
  { id: 'kolkata', name: 'Kolkata', latitude: 22.5726, longitude: 88.3639, displayLabel: 'Kolkata Command Zone', weatherLabel: 'Kolkata Metro Area' },
  { id: 'pune', name: 'Pune', latitude: 18.5204, longitude: 73.8567, displayLabel: 'Pune Command Zone', weatherLabel: 'Pune Metro Area' },
  { id: 'ahmedabad', name: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714, displayLabel: 'Ahmedabad Command Zone', weatherLabel: 'Ahmedabad Metro Area' },
  { id: 'jaipur', name: 'Jaipur', latitude: 26.9124, longitude: 75.7873, displayLabel: 'Jaipur Command Zone', weatherLabel: 'Jaipur Metro Area' },
  { id: 'lucknow', name: 'Lucknow', latitude: 26.8467, longitude: 80.9462, displayLabel: 'Lucknow Command Zone', weatherLabel: 'Lucknow Metro Area' },
  { id: 'bhopal', name: 'Bhopal', latitude: 23.2599, longitude: 77.4126, displayLabel: 'Bhopal Command Zone', weatherLabel: 'Bhopal Metro Area' },
  { id: 'kochi', name: 'Kochi', latitude: 9.9312, longitude: 76.2673, displayLabel: 'Kochi Command Zone', weatherLabel: 'Kochi Metro Area' },
  { id: 'surat', name: 'Surat', latitude: 21.1702, longitude: 72.8311, displayLabel: 'Surat Command Zone', weatherLabel: 'Surat Metro Area' },
  { id: 'nagpur', name: 'Nagpur', latitude: 21.1458, longitude: 79.0882, displayLabel: 'Nagpur Command Zone', weatherLabel: 'Nagpur Metro Area' },
  { id: 'patna', name: 'Patna', latitude: 25.5941, longitude: 85.1376, displayLabel: 'Patna Command Zone', weatherLabel: 'Patna Metro Area' },
  { id: 'chandigarh', name: 'Chandigarh', latitude: 30.7333, longitude: 76.7794, displayLabel: 'Chandigarh Command Zone', weatherLabel: 'Chandigarh Metro Area' },
  { id: 'indore', name: 'Indore', latitude: 22.7196, longitude: 75.8577, displayLabel: 'Indore Command Zone', weatherLabel: 'Indore Metro Area' },
  { id: 'visakhapatnam', name: 'Visakhapatnam', latitude: 17.6868, longitude: 83.2185, displayLabel: 'Visakhapatnam Command Zone', weatherLabel: 'Visakhapatnam Metro Area' },
  { id: 'bhubaneswar', name: 'Bhubaneswar', latitude: 20.2961, longitude: 85.8245, displayLabel: 'Bhubaneswar Command Zone', weatherLabel: 'Bhubaneswar Metro Area' },
  { id: 'thiruvananthapuram', name: 'Thiruvananthapuram', latitude: 8.5241, longitude: 76.9366, displayLabel: 'Thiruvananthapuram Command Zone', weatherLabel: 'Thiruvananthapuram Metro Area' }
];

export const DEFAULT_CITY = SUPPORTED_CITIES[0]; // Mumbai

/** Helper to shift lat/lng and replace text in mock objects for the selected city */
export function localizeData<T>(data: T, city: CityProfile): T {
  if (city.id === 'mumbai') return data; // Default dataset is already Mumbai

  const latDelta = city.latitude - DEFAULT_CITY.latitude;
  const lngDelta = city.longitude - DEFAULT_CITY.longitude;

  const jsonStr = JSON.stringify(data);
  const localizedStr = jsonStr
    // Replace text occurrences
    .replace(/Mumbai/g, city.name)
    .replace(/Kurla|Sion|Dharavi|BKC/g, `${city.name} Central`)
    .replace(/Bandra-Worli Sea Link/g, `${city.name} Expressway`)
    .replace(/CSMT/g, `${city.name} Station`)
    // Replace lat/lng via regex (basic numerical shifting for mock data)
    .replace(/"lat":\s*([\d.]+)/g, (_, p1) => `"lat":${(parseFloat(p1) + latDelta).toFixed(4)}`)
    .replace(/"latitude":\s*([\d.]+)/g, (_, p1) => `"latitude":${(parseFloat(p1) + latDelta).toFixed(4)}`)
    .replace(/"lng":\s*([\d.]+)/g, (_, p1) => `"lng":${(parseFloat(p1) + lngDelta).toFixed(4)}`)
    .replace(/"longitude":\s*([\d.]+)/g, (_, p1) => `"longitude":${(parseFloat(p1) + lngDelta).toFixed(4)}`);

  // Handle nested geojson arrays [lng, lat]
  // This is a naive regex but works perfectly for our mock arrays like [72.8600, 19.0500]
  const finalStr = localizedStr.replace(/\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\]/g, (_, lng, lat) => {
    return `[${(parseFloat(lng) + lngDelta).toFixed(4)}, ${(parseFloat(lat) + latDelta).toFixed(4)}]`;
  });

  return JSON.parse(finalStr);
}
