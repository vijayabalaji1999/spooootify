import { useState, useEffect, useContext, useRef } from 'react';
import {
  Play,
  Pause,
  ChevronDown,
  SkipBack,
  SkipForward,
  Download,
  Heart,
} from 'lucide-react';
import { GlobalContext } from '../context/GlobalContextProvider';
import { useRouter } from 'next/router';
import { getFavorites, handleFavorite } from '@/helper';

const SongBanner = () => {
  const { showSongBanner, songList, setBannerSong } = useContext(GlobalContext);
  const [audio] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
  const progressRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showMobilePlayer, setShowMobilePlayer] = useState(false);

  const [songData, setSongData] = useState({});

  useEffect(() => {
    if (songList) {
      setSongData(songList);
    }
  }, [songList]);

  useEffect(() => {
    if (Object.keys(songData).length) {
      const activeIndex = songData.songs.findIndex((song) => song.active);
      const result =
        activeIndex !== -1
          ? { ...songData.songs[activeIndex], index: activeIndex }
          : null;

      const favourites = getFavorites();

      //check this is a favorite song
      const isFavorite =
        favourites.some(
          (fav) =>
            fav.movie_name === result?.movie_name && fav.name === result?.name
        ) || false;

      audio.pause();
      audio.src = result?.link || '';
      setCurrentSong({ ...result, isFavorite });

      const handleCanPlay = () => {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => console.error('Playback error:', err));
      };

      audio.addEventListener('canplay', handleCanPlay);
      audio.load();

      return () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.pause();
      };
    }
  }, [songData, audio]);

  useEffect(() => {
    if (currentSong) {
      setBannerSong(currentSong);
    }
  }, [currentSong]);

  useEffect(() => {
    if (!currentSong) return;

    const updateProgress = () => {
      if (!audio.currentTime) {
        setLoading(true);
      } else {
        setLoading(false);
      }
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    };

    const nextSong = () => {
      const currentSongIndex = currentSong.index;
      const nextSongIndex = (currentSongIndex + 1) % songData.songs.length;
      const nextSongLink = songData.songs[nextSongIndex].link;
      audio.pause();
      audio.src = nextSongLink;
      setCurrentSong({
        ...songData.songs[nextSongIndex],
        index: nextSongIndex,
      });
      audio.src = nextSongLink;
      audio.load();
      audio.play();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('ended', nextSong);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
      audio.removeEventListener('ended', nextSong);
    };
  }, [currentSong]);

  const handleNext = () => {
    if (!currentSong || !songData?.songs) return;
    const nextSongIndex = (currentSong.index + 1) % songData.songs.length;
    audio.pause();
    audio.src = songData.songs[nextSongIndex].link;
    setCurrentSong({
      ...songData.songs[nextSongIndex],
      index: nextSongIndex,
    });
    audio.load();
    audio.play();
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (!currentSong || !songData?.songs) return;
    const prevSongIndex =
      (currentSong.index - 1 + songData.songs.length) % songData.songs.length;
    audio.pause();
    audio.src = songData.songs[prevSongIndex].link;
    setCurrentSong({
      ...songData.songs[prevSongIndex],
      index: prevSongIndex,
    });
    audio.load();
    audio.play();
    setIsPlaying(true);
  };

  const handleFavoriteClick = () => {
    handleFavorite(currentSong);
    setCurrentSong({ ...currentSong, isFavorite: !currentSong.isFavorite });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentSong.link;
    link.download = `${currentSong.name}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const togglePlay = () => {
    if (loading) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    if (!progressRef.current || loading) return;
    const progressBar = progressRef.current;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pos * audio.duration;
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const gotosongData = () => {
    setShowMobilePlayer(false);
    router.push(`/song/${songData?.movie_link}`);
  };

  const handleBannerClick = () => {
    if (window.innerWidth <= 768) {
      setShowMobilePlayer(true);
    } else {
      gotosongData();
    }
  };

  if (!showSongBanner || !currentSong) return null;

  return (
    <>
      <div className='song-banner' onClick={handleBannerClick}>
        <div className='song-info'>
          <img
            src={currentSong?.movie_image || 'default-album-art.jpg'}
            alt='Album art'
            className='song-image'
          />
          <span className='song-title'>
            {currentSong.name}
            {currentSong?.language && currentSong?.language !== 'Tamil'
              ? ` - ${currentSong.language}`
              : ''}
          </span>
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
          className='progress-container'
        >
          <span className='time-info'>{formatTime(currentTime)}</span>
          <div
            className='progress-bar'
            ref={progressRef}
            onClick={handleProgressClick}
          >
            <div
              className='progress-fill'
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            <div
              className='progress-handle'
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <span className='time-info'>{formatTime(duration)}</span>
        </div>

        <div className='banner-controls'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFavoriteClick();
            }}
            className='control-btn heart-btn'
          >
            <Heart
              size={20}
              fill={currentSong?.isFavorite ? 'red' : 'none'}
              color={currentSong?.isFavorite ? 'red' : '#b3b3b3'}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className='control-btn download-btn'
          >
            <Download size={20} color='#b3b3b3' />
          </button>
          <button
            disabled={loading}
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className='control-btn play-btn'
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </div>

      {showMobilePlayer && (
        <div className='mobile-player'>
          <div className='mobile-player-header'>
            <button
              className='close-btn'
              onClick={() => setShowMobilePlayer(false)}
            >
              <ChevronDown size={24} />
            </button>
          </div>

          {/* Replace the mobile player content section with this */}
          <div className='mobile-player-content'>
            <div className='mobile-album-art'>
              <img src={currentSong?.movie_image || ''} alt='Album art' />
            </div>

            <div onClick={gotosongData} className='mobile-song-info'>
              <h2 className='mobile-song-title'>
                {currentSong.name}
                {currentSong?.language && currentSong?.language !== 'Tamil'
                  ? ` - ${currentSong.language}`
                  : ''}
              </h2>
              <p className='mobile-song-artist'>{songData?.movie_name}</p>
            </div>

            <div className='mobile-progress-container'>
              <div
                className='mobile-progress-bar'
                ref={progressRef}
                onClick={handleProgressClick}
              >
                <div
                  className='mobile-progress-fill'
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <div className='mobile-time-info'>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className='mobile-controls'>
              <button onClick={handleDownload} className='mobile-control-btn'>
                <Download size={24} color='#fff' />
              </button>
              <button
                disabled={loading}
                onClick={handlePrevious}
                className='mobile-control-btn'
              >
                <SkipBack size={28} />
              </button>
              <button
                disabled={loading}
                onClick={togglePlay}
                className='mobile-play-btn'
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
              </button>
              <button
                disabled={loading}
                onClick={handleNext}
                className='mobile-control-btn'
              >
                <SkipForward size={28} />
              </button>
              <button
                onClick={handleFavoriteClick}
                className='mobile-control-btn'
              >
                <Heart
                  size={24}
                  fill={currentSong?.isFavorite ? 'red' : 'none'}
                  color={currentSong?.isFavorite ? 'red' : '#fff'}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SongBanner;
