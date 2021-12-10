// import path from 'path';

const csv = require('csvtojson');

// let csvFilePath = '';
// if (process.env.NODE_ENV === 'production') {
//   csvFilePath = path.join(process.cwd(), './bangumi/animations.csv');
// } else {
//   csvFilePath = path.join(process.cwd(), './public/bangumi/animations.csv');
// }

const csvString =
  '"id","name","pic","background_color"\n' +
  '"1","WIT STUDIO","http://www.witstudio.co.jp/assets/img/logo.png",""\n' +
  '"2","A-1 Pictures","https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/A-1_Pictures_Logo.svg/400px-A-1_Pictures_Logo.svg.png","#5185c5"\n' +
  '"3","动画工房","https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Doga_Kobo_Logo.svg/560px-Doga_Kobo_Logo.svg.png",""\n' +
  '"4","SILVER LINK.","https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Silver_Link_Logo.svg/440px-Silver_Link_Logo.svg.png",""\n' +
  '"5","8bit","http://8bit-studio.co.jp/wp/wp-content/themes/8bit-studio/img/common/logo.png",""\n' +
  '"6","J.C.STAFF","https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/J.C.Staff_Logo.svg/480px-J.C.Staff_Logo.svg.png",""\n' +
  '"7","BONES","https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Bones_logo.svg/440px-Bones_logo.svg.png",""\n' +
  '"8","Arvo Animation","https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Arvo_Animation_logo.svg/440px-Arvo_Animation_logo.svg.png",""\n' +
  '"9","TMS Entertainment","https://www.tms-e.co.jp/themes/tms/images/global/logo-pc.png",""\n' +
  '"10","Telecom Animation Film","https://www.tms-e.co.jp/themes/tms/images/global/logo-pc.png",""\n' +
  '"11","ENGI","https://engi-st.jp/wp-content/uploads/2018/05/logo_top.png",""\n' +
  '"12","CloverWorks","https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/CloverWorks_Logo.svg/440px-CloverWorks_Logo.svg.png",""\n' +
  '"13","Science Saru","https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/Science_SARU_logo.png/440px-Science_SARU_logo.png",""\n' +
  '"14","NUT","http://nutinc.jp/img/img_logo.png",""\n' +
  '"15","SUNRISE","https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Sunrise-Logo.svg/500px-Sunrise-Logo.svg.png",""\n' +
  '"16","MAPPA","https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/MAPPA_Logo.svg/400px-MAPPA_Logo.svg.png",""\n' +
  '"17","亚细亚堂","https://upload.wikimedia.org/wikipedia/commons/3/32/Ajiado_Animation_Works.png",""\n' +
  '"18","Netflix","https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/500px-Netflix_2015_logo.svg.png",""\n' +
  '"19","CygamesPictures","https://cygamespictures.co.jp/assets/images/logo.png",""\n' +
  '"20","PINE JAM","http://pinejam.jp/images/menu-img-contact.png",""\n' +
  '"21","GENO Studio","https://upload.wikimedia.org/wikipedia/en/f/f4/Genostudio.jpg",""\n' +
  '"22","Passione","https://passione-anime.com/wp-content/themes/passionev3/images/logo.svg",""\n' +
  '"23","SATELIGHT","https://www.satelight.co.jp/wp-content/themes/satelight_wp/images/common/logo_01.png",""\n' +
  '"24","ZERO-G","https://zerog2.jp/images/logo.png",""\n' +
  '"25","NAZ","https://upload.wikimedia.org/wikipedia/en/1/1b/NAZ_Studio_logo.png",""\n' +
  '"26","Studio Colorido","https://colorido.co.jp/wp-content/themes/colorido/common/images/logo.png",""\n' +
  '"27","SHAFT","https://www.shaft-web.co.jp/_next/static/assets/0b0ec96374a63516d0ef0e56069d38cd.png",""\n' +
  '"28","C2C","http://www.c2c2009.com/wp-content/themes/c2c/assets/images/common/logo.png",""\n' +
  '"29","MAHO FILM","https://mahofilm.com/wp/wp-content/themes/maho/images/svg/logo.svg",""\n' +
  '"30","手冢animation","https://tezuka.co.jp/images/header_logo.png",""\n' +
  '"31","Seven Arcs Pictures ","http://www.7arcs.co.jp/img/common/hd_logotype2.png",""\n' +
  '"32","GONZO","https://upload.wikimedia.org/wikipedia/zh/thumb/4/44/Gonzo_prilogo.png/300px-Gonzo_prilogo.png",""\n' +
  '"33","EMT SQUARED","https://emt2.co.jp/wordpress/wp-content/themes/emt2/assets/images/common/logo-emt2.png",""\n' +
  '"34","Kinema Citrus","https://upload.wikimedia.org/wikipedia/commons/c/c0/Kinema_Citrus_logo.png",""\n' +
  '"35","project No.9","http://www.project-no9.com/images/share/menu01_rollout.png",""\n' +
  '"36","京都动画","https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Kyoto_Animation_logo.svg/500px-Kyoto_Animation_logo.svg.png",""\n' +
  '"37","tear-studio","https://upload.wikimedia.org/wikipedia/commons/9/99/Tear_studio_logo.png",""\n' +
  '"38","Graphinica","https://www.graphinica.com/Portals/0/graphinica_new-logo9_幅寄せ(横カラー／RGB).png",""\n' +
  '"39","STUDIO 4℃","http://www.studio4c.co.jp/pages/top/logo.png",""\n' +
  '"40","TRIGGER","https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Trigger_Logo.svg/440px-Trigger_Logo.svg.png",""\n' +
  '"41","CRAFTAR STUDIOS","https://static.wixstatic.com/media/082ce6_51c143a722fb4f3fb132f2d0bea1dd75~mv2.png/v1/fill/w_800,h_535,al_c,q_90/CRS_silver.webp",""\n' +
  '"42","SCIENCE SARU","https://static.wixstatic.com/media/d59d46_b3abb9beec84461890e5af7ef4146661~mv2.png/v1/fill/w_366,h_120,al_c,q_85,usm_0.66_1.00_0.01/d59d46_b3abb9beec84461890e5af7ef4146661~mv2.webp",""\n' +
  '"43","STUDIO DEEN","https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Studio_Deen_logo.svg/400px-Studio_Deen_logo.svg.png",""\n' +
  '"44","Orange","https://www.orange-cg.com/wp_core/wp-content/uploads/2021/04/logo_test4.png",""\n' +
  '"45","Bibury Animation Studios","http://bibury-st.com/images/common/logo.png",""\n' +
  '"46","LIDENFILMS","https://lidenfilms.jp/img/logo_header.png",""\n' +
  '"47","David Production","https://davidproduction.jp/wp/wp-content/themes/davidproduction/common/images/logo.gif",""\n' +
  '"48","Millepensee","http://millepensee.com/img/logo_b.png",""\n' +
  '"49","Okuruto Noboru","https://okurutonoboru.co.jp/images/logo.png",""\n' +
  '"50","Studio.Bind","https://st-bind.jp/img/logo.png",""\n' +
  '"51","SIGNAL.MD","http://www.signal-md.co.jp/wp-content/themes/signal-production/images/logo_194x20.png",""\n' +
  '"52","Brain\'s Base","https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Brain%27s_Base_logo.svg/440px-Brain%27s_Base_logo.svg.png",""\n' +
  '"53","P.A. Works","https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/P.A._Works_logo_%28square%29.svg/300px-P.A._Works_logo_%28square%29.svg.png",""\n' +
  '"54","feel.","https://www.feel-ing.com/wp-content/themes/feel/images/logo.png",""\n' +
  '"55","手冢Production","https://tezuka.co.jp/images/header_logo.png",""\n' +
  '"56","手冢制作公司","https://tezuka.co.jp/images/header_logo.png",""\n' +
  '"57","彗星社","https://suiseisha.jp/wp-content/themes/suisei_2018/images/logo_suiseisha.png",""\n' +
  '"58","TNK","https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/TNK_logo.png/440px-TNK_logo.png",""\n' +
  '"59","Twilight Studio","https://twilight-anime.jp/images/logo.png","#000000"\n' +
  '"60","Production I.G","https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Production_I.G_Logo.svg/400px-Production_I.G_Logo.svg.png",""\n' +
  '"61","REVOROOT","https://upload.wikimedia.org/wikipedia/commons/2/27/Logo_of_Revoroot.png",""\n' +
  '"62","TMS","https://www.tms-e.co.jp/themes/tms/images/global/logo-pc.png",""\n' +
  '"63","新锐动画","https://shin-ei-animation.jp/wp/wp-content/themes/shinei/images/logo.png",""\n' +
  '"64","Nomad","http://www.nomad-inc.co.jp/img/common/h1-ttl.png",""\n' +
  '"65","日本动画公司","https://www.nippon-animation.co.jp/images/common/logo.png",""\n' +
  '"66","Studio Blanc","https://www.s-blanc.net/img/logo.png",""';

export default async function handler(req, res) {
  const { animation } = req.query;
  // const jsonArray = await csv().fromFile(csvFilePath);
  const jsonArray = await csv().fromString(csvString);
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
