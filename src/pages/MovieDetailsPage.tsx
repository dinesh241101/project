import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock, Calendar, Star, DollarSign, Download, Link } from 'lucide-react';
import { MovieDetails } from '../types';
import { TMDB_API_BASE_URL, TMDB_API_KEY, TMDB_IMAGE_BASE_URL } from '../config';

export function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      const response = await fetch(
        `${TMDB_API_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
      );
      return response.json() as Promise<MovieDetails>;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="text-white">
      <div className="relative h-[500px] mb-8">
        <img
          src={`${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          {movie.tagline && (
            <p className="text-xl text-gray-300 italic mb-4">{movie.tagline}</p>
          )}
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-400" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock />
              <span>{movie.runtime} min</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar />
              <span>{new Date(movie.release_date).getFullYear()}</span>
            </div>
            {movie.budget > 0 && (
              <div className="flex items-center gap-2">
                <DollarSign />
                <span>{(movie.budget / 1000000).toFixed(1)}M</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-8">
        <div className="space-y-6">
          <img
            src={`${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded-lg shadow-lg w-full"
          />
          
          {movie.downloads && movie.downloads.length > 0 && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Download size={20} />
                Download Options
              </h3>
              <div className="space-y-3">
                {movie.downloads.map((download, index) => (
                  <a
                    key={index}
                    href={download.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400">{download.quality}</span>
                        <span className="text-gray-400">•</span>
                        <span>{download.size}</span>
                      </div>
                      <Link size={16} className="text-blue-400" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="flex gap-2 flex-wrap mb-4">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="px-3 py-1 bg-blue-500 rounded-full text-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>
          <p className="text-lg leading-relaxed">{movie.overview}</p>
        </div>
      </div>
    </div>
  );
}