import { Hostel, NearbyResponse, SearchParams } from '../types/hostel';

const API_BASE_URL = 'http://localhost:8000';

export async function fetchRankedHostels(params: SearchParams): Promise<Hostel[]> {
  const { lat, lon, radius, w_dist = 0.5, w_food = 0.2, w_laundry = 0.1, w_grocery = 0.1 } = params;
  const url = `${API_BASE_URL}/hostels/ranked?lat=${lat}&lon=${lon}&radius=${radius}&w_dist=${w_dist}&w_food=${w_food}&w_laundry=${w_laundry}&w_grocery=${w_grocery}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ranked hostels: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchHostelsByRadius(lat: number, lon: number, radius: number): Promise<Hostel[]> {
  const url = `${API_BASE_URL}/hostels?lat=${lat}&lon=${lon}&radius=${radius}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch hostels: ${response.statusText}`);
  }
  return response.json();
}

export async function searchHostelsByName(query: string): Promise<Hostel[]> {
  const url = `${API_BASE_URL}/hostels/search?q=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to search hostels: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchNearbyServices(hostelId: number, radius: number = 1000): Promise<NearbyResponse> {
  const url = `${API_BASE_URL}/hostels/${hostelId}/nearby?radius=${radius}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch nearby services: ${response.statusText}`);
  }
  return response.json();
}
