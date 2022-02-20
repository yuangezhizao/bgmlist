import fs from 'fs';
import path from 'path';

const csv = require('csvtojson');

// Refer: https://github.com/vercel/next.js/discussions/32236?sort=top#discussioncomment-1959180
const mainFolder = fs.readdirSync(process.cwd());
console.log(mainFolder);
const files = fs.readdirSync(path.join(process.cwd(), `public`));
console.log(files);

let csvFilePath = '';
if (process.env.NODE_ENV === 'production') {
  csvFilePath = path.join(process.cwd(), './bangumi/animations.csv');
} else {
  csvFilePath = path.join(process.cwd(), './public/bangumi/animations.csv');
}

export const config = {
  unstable_includeFiles: ['public']
};

export default async function handler(req, res) {
  const { animation } = req.query;
  const jsonArray = await csv().fromFile(csvFilePath);
  // const jsonArray = await csv().fromString(csvString);
  // console.log(animation);
  let result = jsonArray.filter(function (fp) {
    return fp.name === animation;
  });
  // console.log(result[0])
  if (result.length !== 0) {
    res.redirect(302, result[0].pic);
  } else {
    res.redirect(
      302,
      'https://lab.yuangezhizao.cn/api/v0.0.1/bangumi?animation=' + encodeURIComponent(animation)
    );
  }
}
