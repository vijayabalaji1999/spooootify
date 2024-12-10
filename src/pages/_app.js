import RootLayout from '@/components/Layout';
import { GlobalContextProvider } from '../context/GlobalContextProvider';
import '@/styles/navbar.css';
import '@/styles/songbanner.css';
import '@/styles/songlist.css';
import '@/styles/songlist.css';
import '@/styles/search.css';
import '@/styles/mobileplayer.css';
import '@/styles/movielist.css';
import '@/styles/dashboard.css';
import '@/styles/globals.css';
import '@/styles/loader.css';

function MyApp({ Component, pageProps }) {
  return (
    <GlobalContextProvider>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </GlobalContextProvider>
  );
}

export default MyApp;
