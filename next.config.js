const DEPLOYED_ON = process.env.VERCEL === '1' ? 'Vercel' : 'EdgeOne Pages';
module.exports = {
  basePath: '',
  output: 'export',
  images: {
    unoptimized: true
  },
  env: {
    DEPLOYED_ON
  },
  experimental: {
    forceSwcTransforms: true
  }
};
