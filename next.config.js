const DEPLOYED_ON = process.env.VERCEL === '1' ? 'Vercel' : 'Tencent Cloud Serverless';
module.exports = {
  basePath: '',
  env: {
    DEPLOYED_ON
  }
};
