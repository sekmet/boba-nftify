import { DAppProvider } from '@usedappify/core';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';

import BundlrProvider from '@/context/BundlrContext';
import '@/styles/global.css';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <SessionProvider
    // Provider options are not required but can be useful in situations where
    // you have a short session maxAge time. Shown here with default values.
    session={pageProps.session}
  >
    <DAppProvider config={{}}>
      <BundlrProvider>
        <Component {...pageProps} />
      </BundlrProvider>
    </DAppProvider>
  </SessionProvider>
);

export default MyApp;
