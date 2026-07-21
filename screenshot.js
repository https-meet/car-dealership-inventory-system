const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, 'docs', 'screenshots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const CHROME  = 'C:\\Users\\chauh\\.cache\\puppeteer\\chrome\\win64-150.0.7871.24\\chrome-win64\\chrome.exe';
const ADMIN   = { email: 'admin@dealership.com',    password: 'password123' };
const CUSTOMER= { email: 'customer@dealership.com', password: 'password123' };
const BASE    = 'http://localhost:5173';

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function shot(page, filename, label) {
  await wait(900);
  const file = path.join(OUT, filename);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`✓  ${label}`);
  return file;
}

async function login(page, creds) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2', timeout: 20000 });
  await wait(700);
  // Type email & password
  await page.focus('input[type="email"]');
  await page.keyboard.down('Control');
  await page.keyboard.press('a');
  await page.keyboard.up('Control');
  await page.type('input[type="email"]', creds.email, { delay: 40 });
  await page.focus('input[type="password"]');
  await page.type('input[type="password"]', creds.password, { delay: 40 });
  await wait(200);
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
  await wait(1000);
}

async function logout(page) {
  await page.evaluate(() => localStorage.clear());
  await wait(300);
}

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    defaultViewport: { width: 1440, height: 860 },
  });

  const page = await browser.newPage();

  try {
    // 1. Login page
    console.log('\nCapturing screenshots...\n');
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2', timeout: 20000 });
    await wait(1000);
    await shot(page, '01-login.png', '01 – Login page');

    // 2. Register tab
    await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const b of btns) { if (b.textContent.trim() === 'Register') { b.click(); break; } }
    });
    await wait(600);
    await shot(page, '02-register.png', '02 – Register tab');

    // 3. Admin dashboard
    await login(page, ADMIN);
    await shot(page, '03-dashboard-admin.png', '03 – Admin dashboard');

    // 4. Admin inventory
    await page.goto(`${BASE}/vehicles`, { waitUntil: 'networkidle2', timeout: 15000 });
    await wait(1200);
    await shot(page, '04-inventory-admin.png', '04 – Admin inventory (table)');

    // 5. Admin transactions
    await page.goto(`${BASE}/purchases`, { waitUntil: 'networkidle2', timeout: 15000 });
    await wait(1000);
    await shot(page, '05-transactions-admin.png', '05 – Admin transactions');

    // 6. Analytics
    await page.goto(`${BASE}/reports`, { waitUntil: 'networkidle2', timeout: 15000 });
    await wait(1500);
    await shot(page, '06-analytics.png', '06 – Analytics & reports');

    // 7. Customer dashboard
    await logout(page);
    await login(page, CUSTOMER);
    await shot(page, '07-dashboard-customer.png', '07 – Customer dashboard');

    // 8. Customer inventory – grid view
    await page.goto(`${BASE}/vehicles`, { waitUntil: 'networkidle2', timeout: 15000 });
    await wait(1200);
    await shot(page, '08-inventory-grid.png', '08 – Inventory grid (Customer)');

    // 9. Purchase modal
    try {
      const buyBtns = await page.$$('button.btn-primary');
      if (buyBtns.length > 0) {
        await buyBtns[0].click();
        await wait(1000);
        await shot(page, '09-purchase-modal.png', '09 – Purchase modal');
        await page.keyboard.press('Escape');
        await wait(300);
      }
    } catch (e) { console.log('   (purchase modal skipped)'); }

    // 10. Customer transactions
    await page.goto(`${BASE}/purchases`, { waitUntil: 'networkidle2', timeout: 15000 });
    await wait(1000);
    await shot(page, '10-transactions-customer.png', '10 – Customer transactions');

    console.log('\n✅  All screenshots saved to docs/screenshots/\n');
  } catch (err) {
    console.error('\n❌  Error:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
