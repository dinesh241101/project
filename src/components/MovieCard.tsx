import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Download } from 'lucide-react';
import { Movie } from '../types';
import { TMDB_IMAGE_BASE_URL } from '../config';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link to={`/movie/${movie.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105">
        <img
          src={`${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`}
          alt={movie.title}
          className="h-[400px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <h3 className="text-xl font-bold text-white">{movie.title}</h3>
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star size={16} />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
            {movie.download_count !== undefined && (
              <div className="flex items-center gap-1 text-blue-400">
                <Download size={16} />
                <span>{movie.download_count}</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-200 line-clamp-2 mt-2">
            {movie.overview}
          </p>
        </div>
      </div>
    </Link>
  );
}