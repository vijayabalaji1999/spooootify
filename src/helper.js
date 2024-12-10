export const handleFavorite = (song) => {
  if (!song) return;

  const movieLink = `${song.name}-${song.movie_link}`;

  // Retrieve existing favorites from local storage
  const item = localStorage.getItem('fav-songs');
  let favorites = [];

  // Parse the existing data if it exists
  if (item) {
    try {
      favorites = JSON.parse(item);
    } catch (err) {
      console.error('Error parsing local storage data', err);
    }
  }

  // Check if the song already exists in the favorites
  const alreadyExists = favorites.some(
    (fav) => `${fav.name}-${fav.movie_link}` === movieLink
  );

  if (alreadyExists) {
    // Remove the song if it exists
    favorites = favorites.filter(
      (fav) => `${fav.name}-${fav.movie_link}` !== movieLink
    );
    console.log('Song removed from favorites.');
  } else {
    // Add the song if it doesn't exist
    favorites.push(song);
    console.log('Song added to favorites.');
  }

  // Save the updated array back to local storage
  localStorage.setItem('fav-songs', JSON.stringify(favorites));

  return true;
};

export const getFavorites = () => {
  const item = localStorage.getItem('fav-songs');
  let favorites = [];

  if (item) {
    try {
      favorites = JSON.parse(item);
    } catch (err) {
      console.error('Error parsing local storage data', err);
    }
  }

  return favorites;
};
