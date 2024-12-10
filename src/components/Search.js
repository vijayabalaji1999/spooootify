import React from 'react';
import { Search as SearchIcon } from 'lucide-react';

const Search = ({ searchSong }) => {
  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      try {
        const searchQuery = e.target.value;
        const query = searchQuery.toLowerCase().trim().split(' ').join('+');
        searchSong(query);
      } catch (error) {
        console.error('Search error:', error);
      }
    }
  };

  return (
    <div className='search-container'>
      <div className='search-wrapper'>
        <span className='search-icon'>
          <SearchIcon size={16} />
        </span>
        <input
          type='text'
          placeholder='What do you want to listen to?'
          className='search-input'
          onKeyDown={handleSearch}
        />
      </div>
    </div>
  );
};

export default Search;
