import React from 'react';
import { Play } from 'lucide-react';
import Link from 'next/link';

const MovieList = ({ movies }) => {
  return (
    <div className='movie-grid'>
      {movies?.map((movie, index) => (
        <div key={index} className='movie-card'>
          <Link href={`/song${movie.link}`} className='movie-link'>
            <div className='image-container'>
              <img
                src={movie.image}
                alt={movie.name}
                className='movie-image'
                loading='lazy'
              />
              <div className='overlay'>
                <div className='play-button'>
                  <Play className='play-icon' />
                </div>
              </div>
            </div>
            <div className='movie-info'>
              <h2 className='movie-title'>{movie.name}</h2>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MovieList;
