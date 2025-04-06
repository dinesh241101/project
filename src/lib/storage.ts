import { Movie, AdminMovie, DownloadOption } from '../types';

const STORAGE_KEYS = {
  MOVIES: 'movies',
  ADS: 'ads',
  AD_SPOTS: 'ad_spots',
  AUTH: 'auth',
};

export interface AdSpot {
  id: string;
  name: string;
  clickCount: number;
}

export interface AdContent {
  id: string;
  spotId: string;
  type: 'google_ad' | 'affiliate' | 'custom';
  content: string;
  isActive: boolean;
}

// Helper functions
const generateId = () => Math.random().toString(36).substr(2, 9);
const getItem = <T>(key: string): T[] => JSON.parse(localStorage.getItem(key) || '[]');
const setItem = (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value));

// Movies
export const getMovies = () => getItem<Movie>(STORAGE_KEYS.MOVIES);

export const addMovie = (movie: AdminMovie) => {
  const movies = getMovies();
  const newMovie = {
    id: generateId(),
    ...movie,
    vote_average: 0,
    poster_path: movie.poster_url,
    backdrop_path: movie.backdrop_url,
    downloads: movie.downloads,
  };
  movies.push(newMovie);
  setItem(STORAGE_KEYS.MOVIES, movies);
  return newMovie;
};

// Ad Spots
export const getAdSpots = () => {
  let spots = getItem<AdSpot>(STORAGE_KEYS.AD_SPOTS);
  if (spots.length === 0) {
    spots = [
      { id: generateId(), name: 'search_next', clickCount: 0 },
      { id: generateId(), name: 'movie_image', clickCount: 0 },
      { id: generateId(), name: 'movie_details', clickCount: 0 },
      { id: generateId(), name: 'homepage_sidebar', clickCount: 0 },
    ];
    setItem(STORAGE_KEYS.AD_SPOTS, spots);
  }
  return spots;
};

export const updateAdSpotClickCount = (name: string) => {
  const spots = getAdSpots();
  const updatedSpots = spots.map(spot => 
    spot.name === name ? { ...spot, clickCount: spot.clickCount + 1 } : spot
  );
  setItem(STORAGE_KEYS.AD_SPOTS, updatedSpots);
};

// Ad Content
export const getAdContent = () => getItem<AdContent>(STORAGE_KEYS.ADS);

export const addAdContent = (spotId: string, type: AdContent['type'], content: string) => {
  const ads = getAdContent();
  const newAd = {
    id: generateId(),
    spotId,
    type,
    content,
    isActive: true,
  };
  ads.push(newAd);
  setItem(STORAGE_KEYS.ADS, ads);
  return newAd;
};

export const toggleAdActive = (id: string) => {
  const ads = getAdContent();
  const updatedAds = ads.map(ad => 
    ad.id === id ? { ...ad, isActive: !ad.isActive } : ad
  );
  setItem(STORAGE_KEYS.ADS, updatedAds);
};

export const getActiveAdForSpot = (name: string) => {
  const spots = getAdSpots();
  const ads = getAdContent();
  const spot = spots.find(s => s.name === name);
  if (!spot) return null;
  return ads.find(ad => ad.spotId === spot.id && ad.isActive);
};

// Auth
interface AuthState {
  email: string;
  isAuthenticated: boolean;
}

export const getAuth = (): AuthState => 
  JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH) || '{"isAuthenticated": false, "email": ""}');

export const login = (email: string, password: string) => {
  // Simple auth for demo - in production, use proper authentication
  if (password === 'admin') {
    const auth = { isAuthenticated: true, email };
    setItem(STORAGE_KEYS.AUTH, auth);
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
};