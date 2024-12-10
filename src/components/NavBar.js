import Link from 'next/link';
import { Home, Music, Heart } from 'lucide-react';

const NavBar = () => {
  return (
    <>
      {/* Desktop Sidebar */}
      <nav className='desktop-nav'>
        <div className='nav-header'>
          <Link href='/' className='logo-link'>
            <svg viewBox='0 0 24 24' className='logo-icon'>
              <path
                fill='currentColor'
                d='M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z'
              />
            </svg>
            <span className='logo-text'>Spooootify</span>
          </Link>
        </div>

        <div className='nav-content'>
          <div className='nav-section main-nav'>
            <Link href='/' className={`nav-item`}>
              <Home className='nav-icon' />
              <span>Home</span>
            </Link>
            <Link href='/songs' className={`nav-item`}>
              <Music className='nav-icon' />
              <span>Songs</span>
            </Link>
            <Link href='/favourites' className={`nav-item`}>
              <div className='icon-container liked'>
                <Heart className='nav-icon' />
              </div>
              <span>Liked Songs</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className='mobile-nav'>
        <Link href='/' className='mobile-nav-item'>
          <Home className='nav-icon' />
          <span>Home</span>
        </Link>
        <Link href='/songs' className='mobile-nav-item'>
          <Music className='nav-icon' />
          <span>Songs</span>
        </Link>
        <Link href='/favourites' className='mobile-nav-item'>
          <Heart className='nav-icon' />
          <span>Liked Songs</span>
        </Link>
      </nav>
    </>
  );
};

export default NavBar;
