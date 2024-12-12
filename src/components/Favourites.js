import { useContext, useEffect, useState } from 'react';
import { getFavorites } from '../helper';
import ShowSongs from './ShowSongs';
import { GlobalContext } from '../context/GlobalContextProvider';
import Loader from './Loader';

const Favourites = () => {
  const { setShowSongBanner, setSongList, setBannerSong } =
    useContext(GlobalContext);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSongs = async (favourites) => {
    try {
      setLoading(true);

      const uniqueMovieLink = [...new Set(favourites.map((s) => s.movie_link))];

      const result = await Promise.all(
        uniqueMovieLink.map(async (link) => {
          try {
            const response = await fetch(`/api/song/${link}`);
            const data = await response.json();
            return data?.songs || [];
          } catch (error) {
            console.error('Error fetching song:', error);
            return [];
          }
        })
      );

      const findOurSongs = result.flat().filter((song) => {
        return favourites.find(
          (s) => s.name === song.name && s.movie_name === song.movie_name
        );
      });

      setSongs(findOurSongs);

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    const favourites = getFavorites();
    if (favourites.length) {
      getSongs(favourites);
    } else {
      setLoading(false);
    }
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

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <ShowSongs
          songs={songs}
          handleSongClick={handleSongClick}
          favourites={true}
        />
      )}
    </div>
  );
};

export default Favourites;
