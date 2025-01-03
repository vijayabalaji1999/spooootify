import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import Loader from './Loader';
import ShowSongs from './ShowSongs';
import { LoaderCircle } from 'lucide-react';
import { GlobalContext } from '../context/GlobalContextProvider';
import Search from './Search';

const Songs = () => {
  const [loading, setLoading] = useState(false);
  const [songs, setSongs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { setShowSongBanner, setSongList, setBannerSong } =
    useContext(GlobalContext);
  const [moreLoading, setMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const observer = useRef();

  const fetchBySongs = async () => {
    try {
      setLoading(true);
      const randomPage = Math.floor(Math.random() * 5) + 1;
      const response = await fetch(`/api/song-list?random_page=${randomPage}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      haveUnique(data);
      setCurrentPage(randomPage);
      setHasMore(true);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const haveUnique = (data) => {
    const currentSongs = [...songs];
    const uniqueSongs = data.filter((song) => {
      return !currentSongs.some(
        (e) => `${e.movie_name}-${e.name}` === `${song.movie_name}-${song.name}`
      );
    });
    setSongs((prevSongs) => [...prevSongs, ...uniqueSongs]);
  };

  const fetchMoreSongs = async () => {
    if (moreLoading || !hasMore) return;

    try {
      setMoreLoading(true);
      const response = await fetch(`/api/song-list?page=${currentPage + 1}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        haveUnique(data);
        setCurrentPage((prev) => prev + 1);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setMoreLoading(false);
    }
  };

  // Last element ref callback for intersection observer
  const lastSongRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            if (searchQuery) {
              searchMoreSong();
            } else {
              fetchMoreSongs();
            }
          }
        },
        {
          threshold: 0.8, // Trigger when element is 80% visible
        }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchBySongs();
  }, []);

  const handleSongClick = (song) => {
    let tempSongs = { songs: songs };
    tempSongs.songs.forEach((e) => {
      if (e.link === song.link) {
        e.active = true;
      } else {
        e.active = false;
      }
    });
    tempSongs.movie_link = song.movie_link;
    tempSongs.image_url = song.movie_image;
    tempSongs.movie_name = song.movie_name;
    setSongList(tempSongs);
    setBannerSong(song);
    setShowSongBanner(true);
  };

  const searchMoreSong = async () => {
    try {
      setMoreLoading(true);
      const response = await fetch(
        `/api/search-songs/${searchQuery}?page=${
          searchQuery ? currentPage + 1 : 1
        }`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      if (data.length !== 0) {
        setSongs((prevSongs) => [...prevSongs, ...data]);
        setCurrentPage((prev) => prev + 1);
        setHasMore(true);
      }
      if (songs.length && data.length === 0) {
        setHasMore(false);
      }
      setMoreLoading(false);
    } catch (err) {
      console.log(err);
      setMoreLoading(false);
    }
  };

  const searchSong = async (query) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/search-songs/${query}?page=${1}`);
      const data = await response.json();

      if (data.length !== 0) {
        setSongs(data);
        setCurrentPage(1);
        setSearchQuery(query);
        setHasMore(true);
      }

      setLoading(false);
    } catch (err) {
      console.log(err, '==');
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Search searchSong={searchSong} />
          <ShowSongs
            songs={songs}
            handleSongClick={handleSongClick}
            lastSongRef={lastSongRef}
          />

          {moreLoading && (
            <div className='loading-more'>
              <LoaderCircle className='loader-icon animate-spin' size={24} />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Songs;
