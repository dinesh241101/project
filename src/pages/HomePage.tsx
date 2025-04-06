import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { MovieCard } from '../components/MovieCard';
import { MovieSection } from '../components/MovieSection';
import { AdSpot } from '../components/AdSpot';
import { YouTubeSidebar } from '../components/YouTubeSidebar';
import { Movie, MovieSection as MovieSectionType } from '../types';
import { getMovies } from '../lib/storage';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: searchResults = [], isLoading: isSearchLoading } = useQuery({
    queryKey: ['movies', searchQuery],
    enabled: searchQuery.length > 0,
    queryFn: async () => {
      const movies = getMovies();
      return movies.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    },
  });

  const { data: movieSections = [], isLoading: isSectionsLoading } = useQuery({
    queryKey: ['movieSections'],
    enabled: searchQuery.length === 0,
    queryFn: async () => {
      const movies = getMovies();
      const sections: MovieSectionType[] = [
        {
          title: 'Latest Uploads',
          movies: movies.slice(0, 8),
        },
      ];
      return sections;
    },
  });

  const isLoading = isSearchLoading || isSectionsLoading;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-8">
      <div>
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <AdSpot name="search_next" className="mt-4 h-[100px]" />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : searchQuery ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {searchResults.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          movieSections.map((section, index) => (
            <MovieSection key={index} section={section} />
          ))
        )}
      </div>

      <div className="space-y-8">
        <AdSpot name="homepage_sidebar" className="w-full h-[250px]" />
        <YouTubeSidebar videoId="dQw4w9WgXcQ" />
      </div>
    </div>
  );
}