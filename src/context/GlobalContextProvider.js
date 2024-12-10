'use client'; // Use this if you're in a Next.js app with app directory structure

import React, { createContext, useState } from 'react';

// Create the context
export const GlobalContext = createContext(null);

export const GlobalContextProvider = ({ children }) => {
  const [bannerSong, setBannerSong] = useState(null);
  const [songList, setSongList] = useState(null);
  const [showSongBanner, setShowSongBanner] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        bannerSong,
        setBannerSong,
        showSongBanner,
        setShowSongBanner,
        setSongList,
        songList,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
