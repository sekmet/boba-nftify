/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withBundleAnalyzerOptions = withBundleAnalyzer({
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  // The starter code load resources from `public` folder with `router.basePath` in React components.
  // So, the source code is "basePath-ready".
  // You can remove `basePath` if you don't need it.
  reactStrictMode: true,
  swcMinify: true,
  env: {
    HOST: process.env.HOST || 'localhost',
    PORT: process.env.PORT || 3000,
    API_URL: process.env.API_URL || 'http://localhost:3000',
    INFURA_API_KEY: process.env.INFURA_API_KEY || '',
    NFT_MARKET_CONTRACT_ADDRESS: '0xB3775c0ca32Be8A541445915EeC0063a98bB9440',
    NFT721_CONTRACT_ADDRESS: '0x929B283D2f0B86D9CBEb50f30DbA7585dD9733B8',//'0xA03dc0FAa9e3b76f92D5d340c62F9969e221bdbC',
  }
});

module.exports = {
withBundleAnalyzerOptions,  
/*webpack: (config, { isServer }) => {
  if (!isServer) config.resolve.fallback.fs = false;
  return config;
}*/
}
