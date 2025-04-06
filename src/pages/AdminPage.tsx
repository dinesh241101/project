import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Film, Link, Settings } from 'lucide-react';
import { AdminMovie, DownloadOption } from '../types';
import { getAuth, login, logout, addMovie, getAdSpots, getAdContent, addAdContent, toggleAdActive } from '../lib/storage';

export function AdminPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adSpots, setAdSpots] = useState<any[]>([]);
  const [newAd, setNewAd] = useState({
    spotId: '',
    type: 'affiliate',
    content: '',
  });
  const [movie, setMovie] = useState<AdminMovie>({
    title: '',
    overview: '',
    release_date: '',
    poster_url: '',
    backdrop_url: '',
    downloads: [],
    genres: [],
  });
  const [currentGenre, setCurrentGenre] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadOption, setDownloadOption] = useState<DownloadOption>({
    quality: '',
    size: '',
    url: '',
  });

  useEffect(() => {
    const auth = getAuth();
    setIsAuthenticated(auth.isAuthenticated);
    if (auth.isAuthenticated) {
      fetchAdSpots();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      setIsAuthenticated(true);
      fetchAdSpots();
    } else {
      alert('Invalid credentials');
    }
  };

  const handleSignUp = () => {
    alert('Sign up is disabled in demo mode. Use any email with password "admin"');
  };

  const fetchAdSpots = () => {
    const spots = getAdSpots();
    const ads = getAdContent();
    const spotsWithAds = spots.map(spot => ({
      ...spot,
      ad_content: ads.filter(ad => ad.spotId === spot.id),
    }));
    setAdSpots(spotsWithAds);
  };

  const handleAddAd = (e: React.FormEvent) => {
    e.preventDefault();
    addAdContent(newAd.spotId, newAd.type as any, newAd.content);
    setNewAd({ spotId: '', type: 'affiliate', content: '' });
    fetchAdSpots();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      addMovie(movie);
      setMovie({
        title: '',
        overview: '',
        release_date: '',
        poster_url: '',
        backdrop_url: '',
        downloads: [],
        genres: [],
      });
      alert('Movie added successfully!');
    } catch (error) {
      console.error('Error adding movie:', error);
      alert('Failed to add movie. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addGenre = () => {
    if (currentGenre && !movie.genres.includes(currentGenre)) {
      setMovie(prev => ({
        ...prev,
        genres: [...prev.genres, currentGenre],
      }));
      setCurrentGenre('');
    }
  };

  const removeGenre = (genreToRemove: string) => {
    setMovie(prev => ({
      ...prev,
      genres: prev.genres.filter(genre => genre !== genreToRemove),
    }));
  };

  const addDownloadOption = () => {
    if (downloadOption.quality && downloadOption.size && downloadOption.url) {
      setMovie(prev => ({
        ...prev,
        downloads: [...prev.downloads, downloadOption],
      }));
      setDownloadOption({ quality: '', size: '', url: '' });
    }
  };

  const removeDownloadOption = (index: number) => {
    setMovie(prev => ({
      ...prev,
      downloads: prev.downloads.filter((_, i) => i !== index),
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg w-96">
          <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={() => {
              logout();
              setIsAuthenticated(false);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Movie Upload Form */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Upload Movie</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                required
                value={movie.title}
                onChange={e => setMovie(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Overview
              </label>
              <textarea
                required
                value={movie.overview}
                onChange={e => setMovie(prev => ({ ...prev, overview: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Release Date
              </label>
              <input
                type="date"
                required
                value={movie.release_date}
                onChange={e => setMovie(prev => ({ ...prev, release_date: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Poster URL
              </label>
              <input
                type="url"
                required
                value={movie.poster_url}
                onChange={e => setMovie(prev => ({ ...prev, poster_url: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/poster.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Backdrop URL
              </label>
              <input
                type="url"
                required
                value={movie.backdrop_url}
                onChange={e => setMovie(prev => ({ ...prev, backdrop_url: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/backdrop.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Download Options
              </label>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={downloadOption.quality}
                    onChange={e => setDownloadOption(prev => ({ ...prev, quality: e.target.value }))}
                    placeholder="Quality (e.g., 1080p)"
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={downloadOption.size}
                    onChange={e => setDownloadOption(prev => ({ ...prev, size: e.target.value }))}
                    placeholder="Size (e.g., 2.1GB)"
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={downloadOption.url}
                      onChange={e => setDownloadOption(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="Download URL"
                      className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addDownloadOption}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {movie.downloads.map((download, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-blue-400">{download.quality}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-300">{download.size}</span>
                        <span className="text-gray-400">•</span>
                        <Link size={16} className="text-blue-400" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDownloadOption(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Genres
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={currentGenre}
                  onChange={e => setCurrentGenre(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a genre"
                />
                <button
                  type="button"
                  onClick={addGenre}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map(genre => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-blue-600 text-white rounded-full flex items-center gap-2"
                  >
                    {genre}
                    <button
                      type="button"
                      onClick={() => removeGenre(genre)}
                      className="hover:text-red-300"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Upload Movie
                </>
              )}
            </button>
          </form>
        </div>

        {/* Ad Management */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Ad Management</h2>
          
          {/* Add New Ad */}
          <form onSubmit={handleAddAd} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={newAd.spotId}
                onChange={(e) => setNewAd({ ...newAd, spotId: e.target.value })}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg"
              >
                <option value="">Select Ad Spot</option>
                {adSpots.map((spot) => (
                  <option key={spot.id} value={spot.id}>
                    {spot.name}
                  </option>
                ))}
              </select>
              <select
                value={newAd.type}
                onChange={(e) => setNewAd({ ...newAd, type: e.target.value })}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg"
              >
                <option value="affiliate">Affiliate Link</option>
                <option value="google_ad">Google Ad</option>
                <option value="custom">Custom</option>
              </select>
              <input
                type="text"
                placeholder="Ad Content"
                value={newAd.content}
                onChange={(e) => setNewAd({ ...newAd, content: e.target.value })}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Add Ad
            </button>
          </form>

          {/* Ad Spots List */}
          <div className="space-y-4">
            {adSpots.map((spot) => (
              <div key={spot.id} className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {spot.name}
                </h3>
                <p className="text-gray-300 mb-2">
                  Clicks: {spot.clickCount}
                </p>
                <div className="space-y-2">
                  {spot.ad_content?.map((ad: any) => (
                    <div
                      key={ad.id}
                      className="flex items-center justify-between bg-gray-600 p-2 rounded"
                    >
                      <span className="text-white">{ad.type}</span>
                      <button
                        onClick={() => {
                          toggleAdActive(ad.id);
                          fetchAdSpots();
                        }}
                        className={`px-3 py-1 rounded ${
                          ad.isActive
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-500 text-gray-300'
                        }`}
                      >
                        {ad.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}