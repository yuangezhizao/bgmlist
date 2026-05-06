#!/usr/bin/env node

/**
 * 动画公司 Logo 迁移脚本
 * 1. 解析 animations.csv
 * 2. 下载所有 Logo 图片
 * 3. 统一转 PNG 格式
 * 4. 上传到腾讯云 COS
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const csvtojson = require('csvtojson');
const sharp = require('sharp');

const CSV_PATH = path.join(__dirname, '..', 'public', 'bangumi', 'animations.csv');
const OUTPUT_DIR = '/tmp/animation_logos';
const COS_BUCKET = process.env.COS_BUCKET || 'image-<your-appid>';
const COS_REGION = process.env.COS_REGION || 'ap-beijing';
const COS_PREFIX = 'anime/animation_studio';
const COS_CDN_BASE = 'https://i1.yuangezhizao.cn';

// 创建输出目录
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 下载单个图片（带 User-Agent 和自动 HTTPS 升级）
function downloadImage(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 10) {
      return reject(new Error(`Too many redirects for ${url}`));
    }

    // HTTP → HTTPS 升级
    if (url.startsWith('http://')) {
      url = url.replace('http://', 'https://');
    }

    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    };

    const request = https.get(options, (response) => {
      // 处理重定向
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        let redirectUrl = response.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = `${parsedUrl.protocol}//${parsedUrl.host}${redirectUrl}`;
        }
        return downloadImage(redirectUrl, redirects + 1).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        // 消耗响应体避免内存泄漏
        response.resume();
        return reject(new Error(`HTTP ${response.statusCode} for ${url}`));
      }
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    });
    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error(`Timeout for ${url}`));
    });
  });
}

// 转换为 PNG
async function convertToPng(buffer) {
  return await sharp(buffer, { density: 300 })
    .png()
    .toBuffer();
}

// 延迟
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 上传到 COS（使用 cos_node.mjs）
async function uploadToCos(filePath, key) {
  const { execSync } = require('child_process');
  const cosScript = path.join(
    process.env.HOME,
    '.workbuddy/skills/腾讯云COS/scripts/cos_node.mjs'
  );
  const cmd = `node "${cosScript}" upload --file "${filePath}" --key "${key}" --bucket ${COS_BUCKET} --region ${COS_REGION}`;
  try {
    const result = execSync(cmd, { encoding: 'utf-8', timeout: 60000 });
    const json = JSON.parse(result);
    return json.success === true;
  } catch (err) {
    console.error(`  ❌ 上传失败: ${key}`, err.message);
    return false;
  }
}

async function main() {
  console.log('=== 动画公司 Logo 迁移脚本 ===\n');

  // 1. 解析 CSV
  console.log('📖 解析 CSV...');
  const rows = await csvtojson().fromFile(CSV_PATH);
  console.log(`   共 ${rows.length} 条记录\n`);

  // 2. 下载 + 转 PNG
  console.log('📥 下载并转换 Logo...\n');
  const results = { success: [], failed: [] };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const name = row.name.trim();
    const pic = row.pic;
    const pngPath = path.join(OUTPUT_DIR, `${name}.png`);

    try {
      console.log(`  [${i + 1}/${rows.length}] ${name}`);

      // 如果已下载则跳过
      if (fs.existsSync(pngPath)) {
        console.log(`    ⏩ 已存在，跳过下载`);
        results.success.push({ name, pngPath });
        continue;
      }

      // 下载
      const buffer = await downloadImage(pic);

      // 转 PNG
      const pngBuffer = await convertToPng(buffer);

      // 保存
      fs.writeFileSync(pngPath, pngBuffer);
      console.log(`    ✅ 保存成功 (${(pngBuffer.length / 1024).toFixed(1)} KB)`);
      results.success.push({ name, pngPath });
    } catch (err) {
      console.error(`    ❌ 失败: ${err.message}`);
      results.failed.push({ name, pic, error: err.message });
    }

    // 间隔 500ms 避免请求过快
    if (i < rows.length - 1) {
      await delay(500);
    }
  }

  console.log(`\n📊 下载汇总：成功 ${results.success.length}，失败 ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\n❌ 失败列表：');
    results.failed.forEach(f => console.log(`  - ${f.name}: ${f.error}`));

    // 重试一次
    console.log('\n🔄 重试失败的项...');
    const retryFailed = [];
    for (const f of results.failed) {
      try {
        console.log(`  重试: ${f.name}`);
        const buffer = await downloadImage(f.pic);
        const pngBuffer = await convertToPng(buffer);
        const pngPath = path.join(OUTPUT_DIR, `${f.name}.png`);
        fs.writeFileSync(pngPath, pngBuffer);
        console.log(`    ✅ 重试成功`);
        results.success.push({ name: f.name, pngPath });
      } catch (err) {
        console.error(`    ❌ 重试仍失败: ${err.message}`);
        retryFailed.push(f);
      }
      await delay(1000);
    }
    results.failed = retryFailed;
    console.log(`\n📊 重试后：成功 ${results.success.length}，最终失败 ${results.failed.length}`);
  }

  if (results.success.length === 0) {
    console.log('\n⚠️ 没有成功下载的图片，跳过上传步骤');
    return;
  }

  // 3. 上传到 COS
  console.log('\n📤 上传到 COS...\n');
  const uploadResults = { success: [], failed: [] };

  for (let i = 0; i < results.success.length; i++) {
    const { name, pngPath } = results.success[i];
    const key = `${COS_PREFIX}/${name}.png`;

    console.log(`  [${i + 1}/${results.success.length}] ${name} → ${key}`);

    const ok = await uploadToCos(pngPath, key);
    if (ok) {
      console.log(`    ✅ 上传成功`);
      uploadResults.success.push({
        name,
        url: `${COS_CDN_BASE}/${key}`
      });
    } else {
      uploadResults.failed.push({ name, pngPath });
    }

    await delay(300);
  }

  // 重试上传失败的
  if (uploadResults.failed.length > 0) {
    console.log('\n🔄 重试上传失败的项...');
    const retryFailed = [];
    for (const f of uploadResults.failed) {
      const key = `${COS_PREFIX}/${f.name}.png`;
      console.log(`  重试上传: ${f.name}`);
      const ok = await uploadToCos(f.pngPath, key);
      if (ok) {
        console.log(`    ✅ 重试成功`);
        uploadResults.success.push({
          name: f.name,
          url: `${COS_CDN_BASE}/${key}`
        });
      } else {
        console.error(`    ❌ 重试仍失败`);
        retryFailed.push(f);
      }
      await delay(1000);
    }
    uploadResults.failed = retryFailed;
  }

  console.log(`\n📊 上传汇总：成功 ${uploadResults.success.length}，失败 ${uploadResults.failed.length}`);

  if (uploadResults.failed.length > 0) {
    console.log('\n❌ 上传失败列表：');
    uploadResults.failed.forEach(f => console.log(`  - ${f.name}`));
  }

  // 4. 输出 URL 映射（供参考）
  console.log('\n📋 CDN URL 映射：');
  uploadResults.success.forEach(item => {
    console.log(`  ${item.name} → ${item.url}`);
  });

  console.log('\n✅ 迁移脚本执行完毕！');
}

main().catch(err => {
  console.error('脚本执行出错:', err);
  process.exit(1);
});
