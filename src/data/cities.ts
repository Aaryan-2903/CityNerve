export interface CityProfile {
  id: string; // The backend UUID or name-based string (e.g. 'mumbai')
  name: string;
  displayLabel: string;
  weatherLabel: string;
  latitude: number;
  longitude: number;
}

export const DEFAULT_CITY: CityProfile = {
  id: 'mumbai',
  name: 'Mumbai',
  displayLabel: 'Mumbai Command Zone',
  weatherLabel: 'Mumbai Metro Area',
  latitude: 19.0760,
  longitude: 72.8777,
};
