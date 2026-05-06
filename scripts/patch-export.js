/**
 * Patch .next/required-server-files.json to set config.output to "export".
 *
 * Why: EdgeOne Pages auto-loads the @edgeone/opennextjs-pages plugin,
 * which checks buildConfig.output === "export" to decide whether to use
 * the static export path (copyStaticExport) or the full SSR adaptation path.
 *
 * Next.js 12 does not support output: "export" (introduced in 13.3.0),
 * so the plugin falls into the SSR path and fails because Next.js 12's
 * node_modules lack the modules that Next.js 15 provides.
 *
 * By patching this file, we trick the plugin into taking the static export
 * path, which simply copies the out/ directory to the deployment directory.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', '.next', 'required-server-files.json');

if (!fs.existsSync(filePath)) {
  console.error('required-server-files.json not found at', filePath);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

if (!data.config) {
  console.error('config field not found in required-server-files.json');
  process.exit(1);
}

data.config.output = 'export';

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

console.log('Patched required-server-files.json: config.output set to "export"');
