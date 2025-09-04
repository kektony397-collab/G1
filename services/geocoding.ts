/**
 * Fetches a human-readable address for given coordinates using the Nominatim API.
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns A promise that resolves to a formatted address string.
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
    if (!response.ok) {
      throw new Error(`Network response was not ok, status: ${response.status}`);
    }
    const data = await response.json();
    
    if (data && data.display_name) {
      // The display_name is often too long, let's try to build a shorter version
      const address = data.address;
      if (address) {
        const road = address.road || '';
        const neighbourhood = address.neighbourhood || '';
        const city = address.city || address.town || address.village || '';
        const state = address.state || '';
        const country = address.country || '';
        
        // Prioritize more specific location info
        const locationName = address.amenity || address.shop || address.historic || address.tourism || road;

        const parts = [locationName, neighbourhood, city, state, country].filter(Boolean);
        // Remove duplicates that might appear (e.g., city in neighbourhood)
        const uniqueParts = [...new Set(parts)]; 
        return uniqueParts.join(', ');
      }
      return data.display_name; // Fallback to full display_name
    }
    return 'Unknown Location';
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return 'Location lookup failed';
  }
};