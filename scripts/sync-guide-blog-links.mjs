#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const guidesRoot = path.join(repoRoot, 'docs', 'guides');
const blogBase = 'https://botbrowser.io/en/blog';
const sectionDefaults = {
  'getting-started': 'botbrowser-launcher-guide',
  network: 'proxy-configuration',
  fingerprint: 'what-is-browser-fingerprinting',
  identity: 'profile-management',
  platform: 'cross-platform-browser-profiles',
  deployment: 'docker-deployment-guide',
  proof: 'browser-fingerprint-protection-web-scraping',
  policies: 'browser-privacy-basics-for-everyday-use',
};
const aliases = {
  AUTOMATION_CONSISTENCY: 'browser-interaction-validation',
  BROWSER_OVERVIEW: 'what-is-browser-fingerprinting',
  CANVAS: 'canvas-fingerprinting',
  CLI_RECIPES: 'cli-recipes',
  CROSS_PLATFORM_PROFILES: 'cross-platform-browser-profiles',
  DEVICE_PIXEL_RATIO: 'screen-window-fingerprinting',
  DRM: 'drm-fingerprinting',
  FONT: 'font-fingerprinting',
  MEDIA_DEVICES: 'media-devices-virtual-camera-privacy',
  NAVIGATOR_PROPERTIES: 'navigator-properties-fingerprinting',
  PERFORMANCE: 'performance-optimization',
  PERFORMANCE_TIMING: 'performance-timing-fingerprinting',
  PLAYWRIGHT: 'getting-started-playwright',
  PROXY_CONFIGURATION: 'proxy-configuration',
  WEBGL: 'webgl-fingerprinting',
  WEBGPU: 'webgpu-fingerprinting',
  WEBRTC_LEAK_PREVENTION: 'webrtc-network-identity-privacy',
};

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? files(full) : entry.name.endsWith('.md') ? [full] : [];
  });
}

function slugFor(file) {
  const section = path.relative(guidesRoot, path.dirname(file)).split(path.sep)[0];
  const stem = path.basename(file, '.md');
  return aliases[stem] || sectionDefaults[section];
}

function labelFor(slug) {
  return slug.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
}

function block(slug) {
  return `\n\n---\n\n**Related BotBrowser blog:** [${labelFor(slug)}](${blogBase}/${slug}/)\n`;
}

const guideFiles = files(guidesRoot).filter(file => path.dirname(file) !== guidesRoot);
const failures = [];
for (const file of guideFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const existing = source.match(/https:\/\/botbrowser\.io\/en\/blog\/([a-z0-9-]+)\/?/);
  const slug = existing?.[1] || slugFor(file);
  if (!slug) { failures.push(`${path.relative(repoRoot, file)}: no blog mapping`); continue; }
  if (process.argv.includes('--check')) {
    if (!existing) failures.push(`${path.relative(repoRoot, file)}: missing official blog link`);
  } else if (!existing) {
    fs.writeFileSync(file, `${source.trimEnd()}${block(slug)}`, 'utf8');
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`guide-blog links: ${guideFiles.length} source guides checked`);
