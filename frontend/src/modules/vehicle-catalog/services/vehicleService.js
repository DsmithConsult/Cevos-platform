const API_URL = 'http://localhost:5000/api/vehicles';

export async function searchVehicles({ search = '', vehicleType = '' } = {}) {
  const params = new URLSearchParams();

  if (search) {
    params.set('search', search);
  }

  if (vehicleType) {
    params.set('vehicleType', vehicleType);
  }

  const response = await fetch(`${API_URL}${params.toString() ? `?${params.toString()}` : ''}`);
  if (!response.ok) {
    throw new Error('Failed to load vehicles');
  }

  return response.json();
}
