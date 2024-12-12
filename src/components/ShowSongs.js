import { ChevronLeft, Heart, GripVertical } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GlobalContext } from '../context/GlobalContextProvider';
import { dragFavorites, getFavorites, handleFavorite } from '../helper';
import { useRouter } from 'next/router';

// SortableItem component
const SortableItem = ({
  song,
  index,
  onSongClick,
  onFavoriteClick,
  isActive,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: `${song.movie_name}-${song.name}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      onClick={() => onSongClick(song)}
      ref={setNodeRef}
      style={style}
      className={`playlist-item ${isActive ? 'active' : ''}`}
    >
      <div className='drag-handle' {...attributes} {...listeners}>
        <GripVertical size={16} />
      </div>
      <span className='song-number'>{index + 1}</span>
      <div className='song-details'>
        <img
          src={song.movie_image}
          alt='Album art'
          className='song-image'
          loading='lazy'
        />
        <span className='song-title'>
          {song.name}
          {song?.language && song?.language !== 'Tamil'
            ? ` - ${song.language}`
            : ''}
        </span>
        <span className='song-duration'>{song.duration}</span>
        <span
          className='heart-icon'
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteClick(song);
          }}
        >
          {song.isFavorite ? <Heart fill='red' stroke='red' /> : <Heart />}
        </span>
      </div>
    </div>
  );
};

// Regular Item component
const RegularItem = ({
  song,
  index,
  onSongClick,
  onFavoriteClick,
  isActive,
  lastSongRef,
}) => (
  <div
    ref={lastSongRef ? lastSongRef : null}
    className={`playlist-item ${isActive ? 'active' : ''}`}
    onClick={() => onSongClick(song)}
  >
    <span className='song-number'>{index + 1}</span>
    <div className='song-details'>
      <img
        src={song.movie_image}
        alt='Album art'
        className='song-image'
        loading='lazy'
      />
      <span className='song-title'>
        {song.name}
        {song?.language && song?.language !== 'Tamil'
          ? ` - ${song.language}`
          : ''}
      </span>
      <span className='song-duration'>{song.duration}</span>
      <span
        className='heart-icon'
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteClick(song);
        }}
      >
        {song.isFavorite ? <Heart fill='red' stroke='red' /> : <Heart />}
      </span>
    </div>
  </div>
);

// Main component
const ShowSongs = ({ songs, handleSongClick, lastSongRef, favourites }) => {
  const { bannerSong } = useContext(GlobalContext);
  const router = useRouter();
  const [songData, setSongData] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const favourites = getFavorites();
    setSongData([]);
    const tempSongs = [...songs];
    if (favourites.length) {
      tempSongs.forEach((song) => {
        const index = favourites.findIndex(
          (fav) => fav.movie_name === song.movie_name && fav.name === song.name
        );
        if (index !== -1) {
          song.isFavorite = true;
        }
      });
    }
    setSongData(tempSongs);
  }, [songs]);

  const addFavourite = (song) => {
    handleFavorite(song);
    const songs = songData;
    const finalSongs = [];
    songs.forEach((s) => {
      if (s.movie_name === song.movie_name && s.name === song.name) {
        if (!favourites) {
          finalSongs.push({ ...s, isFavorite: !s.isFavorite });
        }
      } else {
        finalSongs.push(s);
      }
    });
    setSongData(finalSongs);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      let data = [];
      setSongData((items) => {
        const oldIndex = items.findIndex(
          (item) => `${item.movie_name}-${item.name}` === active.id
        );
        const newIndex = items.findIndex(
          (item) => `${item.movie_name}-${item.name}` === over.id
        );
        const movedItems = arrayMove(items, oldIndex, newIndex);
        data = movedItems;
        return movedItems;
      });
      dragFavorites(data);
    }
  };

  const renderPlaylist = () => {
    if (favourites) {
      return (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={songData.map((song) => `${song.movie_name}-${song.name}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className='playlist-favourites'>
              {songData.map((song, index) => (
                <SortableItem
                  key={`${song.movie_name}-${song.name}`}
                  song={song}
                  index={index}
                  onSongClick={handleSongClick}
                  onFavoriteClick={addFavourite}
                  isActive={
                    `${song.movie_name}-${song.name}` ===
                    `${bannerSong?.movie_name}-${bannerSong?.name}`
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      );
    }

    return (
      <div className='playlist'>
        {songData.map((song, index) => (
          <RegularItem
            key={`${song.movie_name}-${song.name}`}
            song={song}
            index={index}
            onSongClick={handleSongClick}
            onFavoriteClick={addFavourite}
            isActive={
              `${song.movie_name}-${song.name}` ===
              `${bannerSong?.movie_name}-${bannerSong?.name}`
            }
            lastSongRef={
              lastSongRef && index === songData.length - 1 ? lastSongRef : null
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className='song-page'>
      <div className='header'>
        <button onClick={() => router.back()} className='back-btn'>
          <ChevronLeft size={24} />
        </button>
      </div>

      {songData?.length === 0 ? (
        <div className='empty-state'>No songs available</div>
      ) : (
        <div className='playlist-section'>{renderPlaylist()}</div>
      )}
    </div>
  );
};

export default ShowSongs;
