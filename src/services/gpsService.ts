/**
 * GPS Service: Tự động lấy tọa độ và địa chỉ chi tiết theo thời gian thực
 */

export interface GPSLocationResult {
  address: string;
  latitude?: number;
  longitude?: number;
}

export async function fetchCurrentGPSAddress(): Promise<GPSLocationResult> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ address: '' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          // Reverse geocoding via OpenStreetMap Nominatim (Miễn phí 100%)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'vi,en;q=0.9',
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const addr = data.address;

            const placeName =
              data.name ||
              addr.amenity ||
              addr.tourism ||
              addr.leisure ||
              addr.building ||
              addr.road;

            const district = addr.city_district || addr.district || addr.quarter || addr.suburb;
            const city = addr.city || addr.town || addr.province || addr.state;

            const parts = [placeName, district, city].filter(Boolean);
            const addressString = parts.length > 0 ? parts.join(', ') : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

            resolve({
              address: addressString,
              latitude: lat,
              longitude: lng,
            });
            return;
          }
        } catch {
          // Fallback to coordinates
        }

        resolve({
          address: `Tọa độ GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          latitude: lat,
          longitude: lng,
        });
      },
      (error) => {
        console.warn('Geolocation denied or unavailable:', error.message);
        resolve({ address: '' });
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  });
}
