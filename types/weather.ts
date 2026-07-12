export interface Weather {
  id: string;
  city_id: string;
  temperature: number;
  apparent_temperature: number;
  rainfall: number;
  precipitation_probability: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  weather_condition: string;
  cloud_cover: number;
  label: string;
  emoji: string;
  alertText: string;
  alertLevel: string;
  last_updated: string;
}
