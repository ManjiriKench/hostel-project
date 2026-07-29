export interface Hostel {
  id: number;
  name: string;
  lat: number;
  lon: number;
  distance_m: number;
  facility_count?: number;
  food_count?: number;
  laundry_count?: number;
  grocery_count?: number;
  score?: number;
}

export interface Facility {
  id: number;
  name: string;
  category: 'grocery' | 'food' | 'laundry';
  lat: number;
  lon: number;
  distance_m: number;
}

export interface NearbyResponse {
  hostel: {
    id: number;
    name: string;
    lat: number;
    lon: number;
  };
  nearby: {
    grocery: Facility[];
    food: Facility[];
    laundry: Facility[];
  };
}

export interface SearchParams {
  lat: number;
  lon: number;
  radius: number;
  w_dist?: number;
  w_food?: number;
  w_laundry?: number;
  w_grocery?: number;
}
