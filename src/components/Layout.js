// app/layout.js
import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContextProvider';
import NavBar from '../components/NavBar';
import SongBanner from './SongBanner';
// import SongBanner from '../components/SongBanner';

export default function RootLayout({ children }) {
  const { showSongBanner, songList } = useContext(GlobalContext);

  return (
    <div className='app-container'>
      <NavBar />
      <main className='main-content'>{children}</main>
      {showSongBanner && <SongBanner songList={songList} />}
    </div>
  );
}
