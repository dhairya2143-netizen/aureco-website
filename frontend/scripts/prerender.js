/**
 * Postbuild prerender: serves build/, renders the page in headless Chrome,
 * and writes the fully rendered HTML back to build/index.html so non-JS
 * crawlers (GPTBot, PerplexityBot, etc.) see real content instead of an
 * empty #root. Fails soft: any error leaves the normal CRA build untouched.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const BUILD = path.join(__dirname, '..', 'build');
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.map': 'application/json',
};

// Outcome is also written into the deployed build so it can be read from
// production at /prerender-log.txt (Vercel build logs need dashboard access).
const logLines = [`node ${process.version} ${process.platform}/${process.arch} ${new Date().toISOString()}`];
const log = (line) => { logLines.push(line); console.warn(`[prerender] ${line}`); };
const flushLog = () => {
  try { fs.writeFileSync(path.join(BUILD, 'prerender-log.txt'), logLines.join('\n') + '\n'); } catch {}
};
const bail = (msg, err) => {
  log(`skipped: ${msg}${err ? ` (${err.stack ? err.stack.split('\n').slice(0, 3).join(' | ') : err.message})` : ''}`);
  flushLog();
  process.exit(0);
};

// CI (Vercel/Linux) uses @sparticuz/chromium: its binary ships inside
// node_modules so it survives Vercel's dependency cache, unlike puppeteer's
// postinstall download. Local dev falls back to full puppeteer.
async function launchBrowser() {
  if (process.platform === 'linux') {
    try {
      const mod = require('@sparticuz/chromium');
      const chromium = mod.default || mod; // v122+ ships an ESM default export
      const core = require('puppeteer-core');
      return await core.launch({
        args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } catch (e) { log(`sparticuz launch failed (${e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e.message}), trying puppeteer`); }
  }
  const puppeteer = require('puppeteer');
  return puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
}

(async () => {

  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    let file = path.join(BUILD, urlPath);
    if (!file.startsWith(BUILD) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      file = path.join(BUILD, 'index.html');
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  }).listen(0);
  const port = server.address().port;

  let browser;
  try {
    browser = await launchBrowser();
  } catch (e) { server.close(); bail('could not launch Chrome', e); }

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise(r => setTimeout(r, 800)); // let the loader cap and reveals settle

    await page.evaluate(() => {
      // Capture the final visual state: reveals settled, loader gone.
      document.querySelectorAll('[data-paper]').forEach(el => el.classList.add('paper-settled'));
      const loader = document.querySelector('.loading-animation');
      if (loader) loader.remove();
    });

    const html = await page.content();
    if (!html.includes('id="root"') || html.length < 20000) {
      throw new Error(`output looks wrong (${html.length} bytes)`);
    }
    fs.writeFileSync(path.join(BUILD, 'index.html'), '<!DOCTYPE html>\n' + html.replace(/^<!DOCTYPE html>/i, ''));
    log(`ok: wrote build/index.html (${(html.length / 1024).toFixed(0)} kB rendered)`);
    flushLog();
  } catch (e) {
    bail('render failed, keeping original index.html', e);
  } finally {
    await browser.close();
    server.close();
  }
})();
