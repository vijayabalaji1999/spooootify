import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { GlobalContext } from '../context/GlobalContextProvider';
import Loader from './Loader';
import ShowSongs from './ShowSongs';

const SongList = () => {
  const router = useRouter();
  const { movie_link } = router.query;

  const [loading, setLoading] = useState(true);
  const [songData, setSongData] = useState(null);
  const { setShowSongBanner, setSongList, setBannerSong } =
    useContext(GlobalContext);

  const fetchSongs = async (movie_link) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/song/${movie_link}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setSongData(data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!movie_link) return;
    fetchSongs(movie_link);
  }, [movie_link]);

  const handleSongClick = (song) => {
    let tempSongs = { ...songData };
    tempSongs.songs.forEach((e) => {
      if (e.link === song.link) {
        e.active = true;
      } else {
        e.active = false;
      }
    });
    tempSongs.movie_link = movie_link ? movie_link : '#';
    setSongList(tempSongs);
    setBannerSong(song);
    setShowSongBanner(true);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {songData?.image_url && (
            <div className='now-playing-header'>
              <div className='album-cover'>
                <img
                  src={songData?.image_url}
                  alt='Album Cover'
                  className='cover-image'
                />
              </div>
              <div className='track-info'>
                <h1 className='album-title'>{songData?.movie_name || '-'}</h1>
              </div>
            </div>
          )}

          <ShowSongs
            songs={songData?.songs || []}
            handleSongClick={handleSongClick}
          />
        </>
      )}
    </>
  );
};

export default SongList;
