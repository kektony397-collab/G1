export interface LocationPoint {
  lat: number;
  lng: number;
  speed: number | null;
  timestamp: number;
}

export interface Trip {
  id: string;
  name: string;
  path: LocationPoint[];
  distance: number; // in km
  duration: number; // in seconds
  area: number; // in square meters
  startTime: number; // timestamp
  endTime: number; // timestamp
  startLocation?: string;
  endLocation?: string;
}