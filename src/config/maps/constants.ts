export const GOOGLE_MAPS_API_KEY = 'AIzaSyDqrXFYxJPqHXZUZYVQGqBaKWvHiVvHJxs';

export const GOOGLE_MAPS_CONFIG = {
  apiKey: GOOGLE_MAPS_API_KEY,
  libraries: ['places', 'geometry', 'geocoding'] as const,
  region: 'US',
  language: 'en'
};

export const SCRIPT_CONFIG = {
  id: 'google-maps-script',
  callbackName: 'initGoogleMaps'
};

export const PLACES_CONFIG = {
  componentRestrictions: { country: 'us' },
  fields: ['formatted_address', 'place_id', 'geometry']
};