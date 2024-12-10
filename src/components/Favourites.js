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

  useEffect(() => {
    const favourites = getFavorites();
    if (favourites.length) {
      setSongs(favourites);
    }
    setLoading(false);
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
