import path from 'path';
import getConfig from 'next/config';

const csv = require('csvtojson');
const csvFilePath = './public/bangumi/animations.csv';
const { serverRuntimeConfig } = getConfig();

export default async function handler(req, res) {
  const { animation } = req.query;
  const jsonArray = await csv().fromFile(path.join(serverRuntimeConfig.PROJECT_ROOT, csvFilePath));
  // console.log(animation);
  let result = jsonArray.filter(function (fp) {
    return fp.name === animation;
  });
  // console.log(result[0])
  if (result.length !== 0) {
    res.redirect(302, result[0].pic);
  }
  res.redirect(302, 'https://lab.yuangezhizao.cn/api/v0.0.1/bangumi?animation=' + encodeURIComponent(animation));
}
