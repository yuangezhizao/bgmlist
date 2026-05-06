const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');

const OUTPUT_DIR = '/tmp/animation_logos';
const COS_SCRIPT = path.join(process.env.HOME, '.workbuddy/skills/腾讯云COS/scripts/cos_node.mjs');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Wikipedia entries with thumbnail URLs that need conversion
const wikipediaEntries = [
  { name: 'A-1_Pictures', thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/A-1_Pictures_Logo.svg/400px-A-1_Pictures_Logo.svg.png' },
  { name: '动画工房', thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Doga_Kobo_Logo.svg/560px-Doga_Kobo_Logo.svg.png' },
  { name: 'SILVER_LINK.', thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Silver_Link_Logo.svg/440px-Silver_Link_Logo.svg.png' },
  { name: 'J.C.STAFF', thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/J.C.Staff_Logo.svg/480px-J.C.Staff_Logo.svg.png' },
  { name: 'BONES', thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Bones_logo.svg/440px-Bones_logo.svg.png' },
  { name: 'Arvo_Animation', thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Arvo_Animation_logo.svg/440px-Arvo_Animation_logo.svg.png' },
  { name: 'CloverWorks', thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/CloverWorks_Logo.svg/440px-CloverWorks_Logo.svg.png' },
  { name: 'Science_Saru', thumbUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/Science_SARU_logo.png/440px-Science_SARU_logo.png' },
  { name: 'MAPPA', thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/MAPPA_Logo.svg/400px-MAPPA_Logo.svg.png' },
  { name: 'GONZO', thumbUrl: 'https://upload.wikimedia.org/wikipedia/zh/thumb/4/44/Gonzo_prilogo.png/300px-Gonzo_prilogo.png' },
  { name: 'TRIGGER', thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Trigger_Logo.svg/440px-Trigger_Logo.svg.png' },
  { name: 'STUDIO_DEEN', thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Studio_Deen_logo.svg/400px-Studio_Deen_logo.svg.png' },
  { name: "Brain's_Base", thumbUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Brain%27s_Base_logo.svg/440px-Brain%27s_Base_logo.svg.png" },
  { name: 'P.A._Works', thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/P.A._Works_logo_%28square%29.svg/300px-P.A._Works_logo_%28square%29.svg.png' },
  { name: 'TNK', thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/TNK_logo.png/440px-TNK_logo.png' },
  { name: 'Production_I.G', thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Production_I.G_Logo.svg/400px-Production_I.G_Logo.svg.png' },
];

// Non-Wikipedia entries - updated URLs discovered from actual websites
const nonWikipediaEntries = [
  { name: '8bit', url: 'https://8bit-studio.co.jp/logo/8bit_logo.svg' },
  { name: 'ENGI', url: 'https://engi-st.net/wp-content/themes/engi/img/logo.svg' },
  { name: 'CygamesPictures', url: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Cypic_Logo.png' },
  { name: 'PINE_JAM', url: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Pine_Jam_logo.svg' },
  { name: 'MAHO_FILM', url: 'https://mahofilm.com/assets/images/logo.png' },
  { name: 'Seven_Arcs_Pictures', url: 'https://7arcs.co.jp/wp/wp-content/themes/seven-arcs/images/common/logo.svg' },
  { name: 'project_No.9', url: 'https://project-no9.co.jp/gwp/wp-content/uploads/2020/03/post_19.png' },
  { name: 'LIDENFILMS', url: 'https://lidenfilms.jp/wp-content/themes/raidenwp/assets/img/common/logo.png' },
  { name: 'David_Production', url: 'https://davidproduction.jp/assets/img/common/logo.svg' },
  { name: 'Millepensee', url: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Millepensee_Logo.png' },
  { name: 'SIGNAL.MD', url: 'https://storage.moegirl.org.cn/moegirl/commons/7/78/Signal_MD_Logo.svg' },
  { name: 'NAZ', url: 'https://cdn.prod.website-files.com/6565cefb18efd42c6f89d756/6566aaecd98799b82898511f_logo.svg' },
];

/**
 * Convert a Wikipedia thumbnail URL to the original file URL.
 */
function convertToOriginalUrl(thumbUrl) {
  if (!thumbUrl.includes('/thumb/')) {
    return thumbUrl;
  }

  const url = new URL(thumbUrl);
  let pathname = url.pathname;

  // Remove /thumb/ from the path
  pathname = pathname.replace('/thumb/', '/');

  // Remove the size-prefixed last segment, keep original filename from second-to-last
  const parts = pathname.split('/');
  parts.pop(); // Remove "400px-filename.svg.png"
  // The remaining path ends with the original filename

  url.pathname = parts.join('/');
  return url.toString();
}

function downloadBuffer(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const options = {
      headers: {
        'User-Agent': 'LogoDownloader/1.0 (https://github.com/example; educational use)',
        'Accept': 'image/*,*/*;q=0.1',
        'Accept-Encoding': 'identity',
      },
      timeout: 30000,
    };

    const req = protocol.get(url, options, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        if (maxRedirects <= 0) {
          reject(new Error('Too many redirects'));
          return;
        }
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
          const parsedUrl = new URL(url);
          redirectUrl = `${parsedUrl.protocol}//${parsedUrl.host}${redirectUrl}`;
        }
        downloadBuffer(redirectUrl, maxRedirects - 1).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        // Consume response body to free connection
        res.resume();
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Download using curl as fallback - handles more edge cases
 */
function downloadWithCurl(url) {
  const tmpFile = `/tmp/curl_download_${Date.now()}.tmp`;
  try {
    execSync(
      `curl -sL -o "${tmpFile}" ` +
      `-H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" ` +
      `-H "Accept: image/*,*/*" ` +
      `--max-time 30 --retry 2 --retry-delay 3 ` +
      `"${url}"`,
      { stdio: 'pipe', timeout: 60000 }
    );
    const buffer = fs.readFileSync(tmpFile);
    fs.unlinkSync(tmpFile);
    if (buffer.length < 100) {
      throw new Error(`Downloaded file too small (${buffer.length} bytes) - likely error page`);
    }
    return buffer;
  } catch (err) {
    try { fs.unlinkSync(tmpFile); } catch (_) {}
    throw err;
  }
}

async function convertToPng(buffer, isSvg) {
  if (isSvg) {
    return sharp(buffer, { density: 300 })
      .png()
      .toBuffer();
  }
  return sharp(buffer)
    .png()
    .toBuffer();
}

async function downloadAndProcess(entry, originalUrl, retries = 3) {
  const isSvg = originalUrl.toLowerCase().endsWith('.svg');
  const safeName = entry.name.replace(/[/.]/g, '_');
  const outputPath = path.join(OUTPUT_DIR, `${safeName}.png`);

  // Skip if already downloaded
  if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 1000) {
    console.log(`[SKIP] ${entry.name} - already exists (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);
    return { name: entry.name, path: outputPath, success: true };
  }

  console.log(`[DOWNLOAD] ${entry.name}`);
  console.log(`  URL: ${originalUrl}`);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      let buffer;
      try {
        buffer = await downloadBuffer(originalUrl);
      } catch (nodeErr) {
        // Fallback to curl on Node.js failures
        console.log(`  Node download failed (${nodeErr.message}), trying curl...`);
        buffer = downloadWithCurl(originalUrl);
      }

      console.log(`  Downloaded ${(buffer.length / 1024).toFixed(1)} KB`);

      const pngBuffer = await convertToPng(buffer, isSvg);
      fs.writeFileSync(outputPath, pngBuffer);
      console.log(`  Saved: ${outputPath} (${(pngBuffer.length / 1024).toFixed(1)} KB)`);

      return { name: entry.name, path: outputPath, success: true };
    } catch (err) {
      console.error(`  Attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt < retries) {
        const delay = attempt * 3000; // 3s, 6s, 9s
        console.log(`  Waiting ${delay / 1000}s before retry...`);
        await sleep(delay);
      }
    }
  }

  console.error(`  ALL RETRIES FAILED for ${entry.name}`);
  return { name: entry.name, path: null, success: false, error: 'All retries exhausted' };
}

function uploadToCos(localPath, name) {
  const safeName = name.replace(/[/.]/g, '_');
  const key = `anime/animation_studio/${safeName}.png`;
  const bucket = process.env.COS_BUCKET || 'image-<your-appid>';
  const cmd = `node "${COS_SCRIPT}" upload --file "${localPath}" --key "${key}" --bucket ${bucket} --region ap-beijing`;

  try {
    execSync(cmd, { stdio: 'pipe', timeout: 30000 });
    console.log(`  [COS] Uploaded: ${key}`);
    return true;
  } catch (err) {
    console.error(`  [COS] FAILED: ${err.stderr?.toString() || err.message}`);
    return false;
  }
}

async function main() {
  const results = [];

  // Process Wikipedia entries with delay between requests to avoid rate limiting
  console.log('=== Processing Wikipedia entries ===\n');
  for (const entry of wikipediaEntries) {
    const originalUrl = convertToOriginalUrl(entry.thumbUrl);
    const result = await downloadAndProcess(entry, originalUrl);
    results.push(result);
    // Delay between Wikipedia requests to avoid 429
    await sleep(2000);
  }

  // Process non-Wikipedia entries (these use curl fallback automatically)
  console.log('\n=== Processing non-Wikipedia entries ===\n');
  for (const entry of nonWikipediaEntries) {
    const result = await downloadAndProcess(entry, entry.url);
    results.push(result);
    await sleep(1000);
  }

  // Summary
  console.log('\n=== Download Summary ===');
  const succeeded = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`Succeeded: ${succeeded.length}`);
  console.log(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nFailed entries:');
    failed.forEach(r => console.log(`  - ${r.name}: ${r.error}`));
  }

  // Upload successful downloads to COS
  console.log('\n=== Uploading to COS ===\n');
  let uploadOk = 0;
  let uploadFail = 0;

  for (const result of succeeded) {
    const ok = uploadToCos(result.path, result.name);
    if (ok) uploadOk++;
    else uploadFail++;
  }

  console.log(`\n=== Final Summary ===`);
  console.log(`Downloaded: ${succeeded.length}, Failed: ${failed.length}`);
  console.log(`COS Uploaded: ${uploadOk}, COS Failed: ${uploadFail}`);

  if (failed.length > 0) {
    console.log(`\nRemaining failures need manual URL discovery from websites.`);
  }
}

main().catch(console.error);
