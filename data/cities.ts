export interface CityProfile {
  id: string; // The backend UUID or name-based string (e.g. 'mumbai')
  name: string;
  displayLabel: string;
  weatherLabel: string;
  latitude: number;
  longitude: number;
  state: string;
  openMeteoCoordinates: {
    latitude: number;
    longitude: number;
  };
}

export const DEFAULT_CITY: CityProfile = {
  id: 'mumbai',
  name: 'Mumbai',
  displayLabel: 'Mumbai Command Zone',
  weatherLabel: 'Mumbai Metro Area',
  latitude: 19.0760,
  longitude: 72.8777,
  state: 'Maharashtra',
  openMeteoCoordinates: { latitude: 19.0760, longitude: 72.8777 }
};

export const SUPPORTED_CITIES: CityProfile[] = [
  DEFAULT_CITY,
  {
    id: 'delhi',
    name: 'Delhi',
    displayLabel: 'Delhi Command Zone',
    weatherLabel: 'Delhi Metro Area',
    latitude: 28.7041,
    longitude: 77.1025,
    state: 'Delhi',
    openMeteoCoordinates: { latitude: 28.7041, longitude: 77.1025 }
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    displayLabel: 'Bengaluru Command Zone',
    weatherLabel: 'Bengaluru Metro Area',
    latitude: 12.9716,
    longitude: 77.5946,
    state: 'Karnataka',
    openMeteoCoordinates: { latitude: 12.9716, longitude: 77.5946 }
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    displayLabel: 'Hyderabad Command Zone',
    weatherLabel: 'Hyderabad Metro Area',
    latitude: 17.3850,
    longitude: 78.4867,
    state: 'Telangana',
    openMeteoCoordinates: { latitude: 17.3850, longitude: 78.4867 }
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    displayLabel: 'Ahmedabad Command Zone',
    weatherLabel: 'Ahmedabad Metro Area',
    latitude: 23.0225,
    longitude: 72.5714,
    state: 'Gujarat',
    openMeteoCoordinates: { latitude: 23.0225, longitude: 72.5714 }
  },
  {
    id: 'chennai',
    name: 'Chennai',
    displayLabel: 'Chennai Command Zone',
    weatherLabel: 'Chennai Metro Area',
    latitude: 13.0827,
    longitude: 80.2707,
    state: 'Tamil Nadu',
    openMeteoCoordinates: { latitude: 13.0827, longitude: 80.2707 }
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    displayLabel: 'Kolkata Command Zone',
    weatherLabel: 'Kolkata Metro Area',
    latitude: 22.5726,
    longitude: 88.3639,
    state: 'West Bengal',
    openMeteoCoordinates: { latitude: 22.5726, longitude: 88.3639 }
  },
  {
    id: 'surat',
    name: 'Surat',
    displayLabel: 'Surat Command Zone',
    weatherLabel: 'Surat Metro Area',
    latitude: 21.1702,
    longitude: 72.8311,
    state: 'Gujarat',
    openMeteoCoordinates: { latitude: 21.1702, longitude: 72.8311 }
  },
  {
    id: 'pune',
    name: 'Pune',
    displayLabel: 'Pune Command Zone',
    weatherLabel: 'Pune Metro Area',
    latitude: 18.5204,
    longitude: 73.8567,
    state: 'Maharashtra',
    openMeteoCoordinates: { latitude: 18.5204, longitude: 73.8567 }
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    displayLabel: 'Jaipur Command Zone',
    weatherLabel: 'Jaipur Metro Area',
    latitude: 26.9124,
    longitude: 75.7873,
    state: 'Rajasthan',
    openMeteoCoordinates: { latitude: 26.9124, longitude: 75.7873 }
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    displayLabel: 'Lucknow Command Zone',
    weatherLabel: 'Lucknow Metro Area',
    latitude: 26.8467,
    longitude: 80.9462,
    state: 'Uttar Pradesh',
    openMeteoCoordinates: { latitude: 26.8467, longitude: 80.9462 }
  },
  {
    id: 'kanpur',
    name: 'Kanpur',
    displayLabel: 'Kanpur Command Zone',
    weatherLabel: 'Kanpur Metro Area',
    latitude: 26.4499,
    longitude: 80.3319,
    state: 'Uttar Pradesh',
    openMeteoCoordinates: { latitude: 26.4499, longitude: 80.3319 }
  },
  {
    id: 'nagpur',
    name: 'Nagpur',
    displayLabel: 'Nagpur Command Zone',
    weatherLabel: 'Nagpur Metro Area',
    latitude: 21.1458,
    longitude: 79.0882,
    state: 'Maharashtra',
    openMeteoCoordinates: { latitude: 21.1458, longitude: 79.0882 }
  },
  {
    id: 'indore',
    name: 'Indore',
    displayLabel: 'Indore Command Zone',
    weatherLabel: 'Indore Metro Area',
    latitude: 22.7196,
    longitude: 75.8577,
    state: 'Madhya Pradesh',
    openMeteoCoordinates: { latitude: 22.7196, longitude: 75.8577 }
  },
  {
    id: 'thane',
    name: 'Thane',
    displayLabel: 'Thane Command Zone',
    weatherLabel: 'Thane Metro Area',
    latitude: 19.2183,
    longitude: 72.9781,
    state: 'Maharashtra',
    openMeteoCoordinates: { latitude: 19.2183, longitude: 72.9781 }
  },
  {
    id: 'bhopal',
    name: 'Bhopal',
    displayLabel: 'Bhopal Command Zone',
    weatherLabel: 'Bhopal Metro Area',
    latitude: 23.2599,
    longitude: 77.4126,
    state: 'Madhya Pradesh',
    openMeteoCoordinates: { latitude: 23.2599, longitude: 77.4126 }
  },
  {
    id: 'visakhapatnam',
    name: 'Visakhapatnam',
    displayLabel: 'Visakhapatnam Command Zone',
    weatherLabel: 'Visakhapatnam Metro Area',
    latitude: 17.6868,
    longitude: 83.2185,
    state: 'Andhra Pradesh',
    openMeteoCoordinates: { latitude: 17.6868, longitude: 83.2185 }
  },
  {
    id: 'pimpri-chinchwad',
    name: 'Pimpri-Chinchwad',
    displayLabel: 'Pimpri-Chinchwad Command Zone',
    weatherLabel: 'Pimpri-Chinchwad Metro Area',
    latitude: 18.6298,
    longitude: 73.7997,
    state: 'Maharashtra',
    openMeteoCoordinates: { latitude: 18.6298, longitude: 73.7997 }
  },
  {
    id: 'patna',
    name: 'Patna',
    displayLabel: 'Patna Command Zone',
    weatherLabel: 'Patna Metro Area',
    latitude: 25.5941,
    longitude: 85.1376,
    state: 'Bihar',
    openMeteoCoordinates: { latitude: 25.5941, longitude: 85.1376 }
  },
  {
    id: 'vadodara',
    name: 'Vadodara',
    displayLabel: 'Vadodara Command Zone',
    weatherLabel: 'Vadodara Metro Area',
    latitude: 22.3072,
    longitude: 73.1812,
    state: 'Gujarat',
    openMeteoCoordinates: { latitude: 22.3072, longitude: 73.1812 }
  }
];
