import React from 'react';
import { MovieCard } from './MovieCard';
import { MovieSection as MovieSectionType } from '../types';

interface MovieSectionProps {
  section: MovieSectionType;
}

export function MovieSection({ section }: MovieSectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">{section.title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {section.movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}