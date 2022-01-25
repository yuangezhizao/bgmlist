import Head from 'next/head';

function BaseHeader() {
  return (
    <Head>
      <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
      <link rel="canonical" href="https://bgmlist.yuangezhizao.cn/" />
      <title>远哥制造的总日漫表</title>
      <meta
        name="keywords"
        content="远哥制造的总日漫表,远哥制造的追番表,总日漫表,追番表,日漫,追番,yuangezhizao,animation"
      />
      <meta name="description" content="这里是远哥制造的总日漫表" />
      <meta name="author" content="yuangezhizao" />
      <meta name="Copyright" content="Copyright yuangezhizao All Rights Reserved." />
      <meta name="format-detection" content="telephone=no" />
      <link rel="dns-prefetch" href="//bangumi.yuangezhizao.cn" />
      <link rel="dns-prefetch" href="//lab.yuangezhizao.cn" />
      <link rel="dns-prefetch" href="//www.yuangezhizao.cn" />
      <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=yes" />
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-TQWLZTTVSN"></script>
      <script defer src="https://hm.baidu.com/hm.js?f78f90c034ccd566d0d778ad3ef4065e"></script>
      <script src="https://cdn-go.cn/aegis/aegis-sdk/latest/aegis.min.js"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-TQWLZTTVSN');
        var _hmt = _hmt || [];
        const aegis = new Aegis({
            id: 'Gl3vyhE8zoaPXnglXJ', // 上报 id
            uin: 'Anonymous', // 用户唯一 ID（可选）
            reportApiSpeed: true, // 接口测速
            reportAssetSpeed: true, // 静态资源测速
            spa: true // spa 应用页面跳转的时候开启 pv 计算
        });
      `
        }}
      />
    </Head>
  );
}

export default BaseHeader;
