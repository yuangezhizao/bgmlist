#!/usr/bin/env node

/**
 * 修复 COS 中文件名不匹配的问题
 * Wikipedia 下载脚本用下划线替换了空格/点号，需要重命名为 CSV 中的原始 name
 */

const fs = require('fs');
const path = require('path');
const csvtojson = require('csvtojson');
const { execSync } = require('child_process');

const CSV_PATH = path.join(__dirname, '..', 'public', 'bangumi', 'animations.csv');
const LOCAL_DIR = '/tmp/animation_logos';
const COS_BUCKET = process.env.COS_BUCKET || 'image-<your-appid>';
const COS_REGION = process.env.COS_REGION || 'ap-beijing';
const COS_PREFIX = 'anime/animation_studio';
const COS_SCRIPT = path.join(process.env.HOME, '.workbuddy/skills/腾讯云COS/scripts/cos_node.mjs');

function uploadToCos(filePath, key) {
  const cmd = `node "${COS_SCRIPT}" upload --file "${filePath}" --key "${key}" --bucket ${COS_BUCKET} --region ${COS_REGION}`;
  try {
    const result = execSync(cmd, { encoding: 'utf-8', timeout: 60000 });
    const json = JSON.parse(result);
    return json.success === true;
  } catch (err) {
    console.error(`  ❌ 上传失败: ${key}`, err.message);
    return false;
  }
}

function deleteFromCos(key) {
  const cmd = `node "${COS_SCRIPT}" delete --key "${key}" --bucket ${COS_BUCKET} --region ${COS_REGION}`;
  try {
    const result = execSync(cmd, { encoding: 'utf-8', timeout: 30000 });
    const json = JSON.parse(result);
    return json.success === true;
  } catch (err) {
    console.error(`  ❌ 删除失败: ${key}`, err.message);
    return false;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('=== 修复 COS 文件名 ===\n');

  // 1. 读取 CSV 获取正确的 name 列表
  const rows = await csvtojson().fromFile(CSV_PATH);
  const csvNames = rows.map(r => r.name.trim());
  console.log(`CSV 中 ${csvNames.length} 个名称\n`);

  // 2. 读取本地文件
  const localFiles = fs.readdirSync(LOCAL_DIR).filter(f => f.endsWith('.png'));
  console.log(`本地 ${localFiles.length} 个文件\n`);

  // 3. 建立映射：从本地文件名（可能含下划线）→ CSV 正确名称
  // 需要修复的文件名模式：
  // - 下划线替换空格：A-1_Pictures → A-1 Pictures
  // - 下划线替换点号：J_C_STAFF → J.C.STAFF
  // - 多个特殊替换：P_A__Works → P.A. Works

  // 尝试智能匹配
  const nameMapping = {};
  for (const csvName of csvNames) {
    const expectedFile = `${csvName}.png`;
    // 检查是否已有正确文件名
    if (localFiles.includes(expectedFile)) {
      nameMapping[csvName] = expectedFile;
      continue;
    }

    // 尝试匹配带下划线的文件
    // 将 CSV name 转为下划线版本看是否匹配
    const underscoreName = csvName
      .replace(/\./g, '_')
      .replace(/ /g, '_')
      .replace(/'/g, '_')
      .replace(/\.png$/, '') + '.png';

    if (localFiles.includes(underscoreName)) {
      nameMapping[csvName] = underscoreName;
      console.log(`  🔄 需重命名: ${underscoreName} → ${expectedFile}`);
    } else {
      // 尝试其他模式
      const altName = csvName
        .replace(/\./g, '_')
        .replace(/ /g, '_')
        .replace(/'/g, '%27')
        + '.png';

      if (localFiles.includes(altName)) {
        nameMapping[csvName] = altName;
        console.log(`  🔄 需重命名: ${altName} → ${expectedFile}`);
      } else {
        console.log(`  ⚠️ 未找到匹配: ${csvName} (tried ${underscoreName}, ${altName})`);
      }
    }
  }

  // 4. 对需要修复的文件：复制+重命名本地文件，上传新名称到 COS，删除 COS 旧名称
  console.log('\n📦 修复文件名...\n');
  let fixed = 0, failed = 0;

  for (const [csvName, localFile] of Object.entries(nameMapping)) {
    const expectedFile = `${csvName}.png`;
    if (localFile === expectedFile) continue; // 已经正确

    const srcPath = path.join(LOCAL_DIR, localFile);
    const dstPath = path.join(LOCAL_DIR, expectedFile);

    // 复制本地文件
    if (!fs.existsSync(dstPath)) {
      fs.copyFileSync(srcPath, dstPath);
      console.log(`  📋 本地复制: ${localFile} → ${expectedFile}`);
    }

    // 上传新名称到 COS
    const newKey = `${COS_PREFIX}/${expectedFile}`;
    console.log(`  📤 上传新名称: ${newKey}`);
    const ok = await uploadToCos(dstPath, newKey);
    if (ok) {
      fixed++;
      // 删除 COS 旧名称
      const oldKey = `${COS_PREFIX}/${localFile}`;
      console.log(`  🗑️ 删除旧名称: ${oldKey}`);
      await deleteFromCos(oldKey);
    } else {
      failed++;
    }
    await delay(300);
  }

  console.log(`\n📊 修复汇总：成功 ${fixed}，失败 ${failed}`);
}

main().catch(err => {
  console.error('脚本执行出错:', err);
  process.exit(1);
});
