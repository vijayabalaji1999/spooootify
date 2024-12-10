import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import Loader from './Loader';
import Search from './Search';
import MovieList from './MovieList';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSongs = async (page) => {
    const tempSongs = [...songs];
    setSongs([]);

    try {
      setLoading(true);

      const response = await fetch(`/api/songs?page=${page}`);

      console.log(response, '==response');

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      if (!data.length) {
        setSongs(tempSongs);
        setLoading(false);
        return;
      }
      setSongs(data);
      setLoading(false);
    } catch (err) {
      setSongs(tempSongs);

      setLoading(false);
    }
  };

  const fetchPageSongs = async (action) => {
    try {
      setLoading(true);
      const pageNo = action === 'next' ? currentPage + 1 : currentPage - 1;
      const response = await fetch(
        `/api/songs?action=${action}&page=${pageNo}`
      );
      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log(data, '=data');
      if (data.length === 0) {
        return;
      }

      setCurrentPage(pageNo);

      setSongs(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const searchSong = async (query) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/search/${query}`);
      const data = await response.json();
      setSongs(data);
      setSearchQuery(query);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    const randomPage = Math.floor(Math.random() * 5) + 1;
    fetchSongs(randomPage);
    setCurrentPage(currentPage === 1 ? 1 : randomPage);
    setSearchQuery('');
  }, []);

  return (
    <div className='dashboard'>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <>
          <Search searchSong={searchSong} />
          <MovieList movies={songs} />
          {!searchQuery ? (
            <div className='navigation-buttons'>
              {currentPage > 1 && (
                <button
                  onClick={() => fetchPageSongs('prev')}
                  className='nav-btn prev-btn'
                >
                  <ArrowLeft size={16} />
                  Previous
                </button>
              )}
              {currentPage < 390 && (
                <button
                  onClick={() => fetchPageSongs('next')}
                  className='nav-btn next-btn'
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          ) : (
            <div className='navigation-buttons'>
              <button
                onClick={() => {
                  setSearchQuery('');
                  fetchSongs(Math.floor(Math.random() * 5) + 1);
                }}
                className='nav-btn next-btn'
              >
                Home
                <Home size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
