const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');

// https://web.archive.org/web/20211113140226/https://medium.com/@boris.poehland.business/next-js-api-routes-how-to-read-files-from-directory-compatible-with-vercel-5fb5837694b9
const csvFilePath = path.resolve('./public', 'bangumi/animations.csv');

var readDir = fs.readdirSync('./public');
console.log(readDir);

export default async function handler(req, res) {
  const { animation } = req.query;
  const jsonArray = await csv().fromFile(csvFilePath);
  // console.log(animation);
  let result = jsonArray.filter(function (fp) {
    return fp.name === animation;
  });
  // console.log(result[0])
  if (result.length !== 0) {
    res.redirect(302, result[0].pic);
  }
  res.redirect(302, 'https://lab.yuangezhizao.cn/api/v0.0.1/bangumi?animation=' + animation);
}
