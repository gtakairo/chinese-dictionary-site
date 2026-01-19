/**
 * Scraping Script for chineself.com
 * 
 * Usage: node scripts/scrape.mjs [--limit N] [--offset N]
 */

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data', 'ja');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Parse command line arguments
const args = process.argv.slice(2);
const limitIndex = args.indexOf('--limit');
const offsetIndex = args.indexOf('--offset');
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : Infinity;
const offset = offsetIndex !== -1 ? parseInt(args[offsetIndex + 1]) : 0;

// JavaScript to extract word data from page
const extractionScript = `(() => {
  const article = document.querySelector('article');
  if (!article) return null;
  
  const paragraphs = article.querySelectorAll('p');
  
  // p[1] = pinyin, p[2] = meaning, p[3] = description, p[4] = examples
  const pinyinText = paragraphs[1]?.textContent || '';
  const pinyinMatch = pinyinText.match(/（([^）]+)）/);
  const pinyin = pinyinMatch ? pinyinMatch[1] : '';
  
  const meaning = (paragraphs[2]?.textContent || '').replace('意味：', '').trim();
  const description = (paragraphs[3]?.textContent || '').trim();
  
  // Parse examples from p[4]
  const exampleText = paragraphs[4]?.textContent || '';
  const exampleMatches = exampleText.matchAll(/例：([^「]+)「([^」]+)」/g);
  const examples = [];
  for (const m of exampleMatches) {
    examples.push({ chinese: m[1].trim(), translation: m[2].trim() });
  }
  
  // Category
  const categoryLink = document.querySelector('a[href*="/category/"]');
  const category = categoryLink ? categoryLink.getAttribute('href').match(/category\\/([^\\/]+)/)?.[1] || '' : '';
  const categoryName = categoryLink ? categoryLink.textContent.trim() : '';
  
  // Related words
  const relatedLinks = article.querySelectorAll('a[href*="chineself.com/"]');
  const relatedWords = [];
  const currentSlug = location.pathname.replace(/\\//g, '');
  relatedLinks.forEach(link => {
    const href = link.getAttribute('href');
    const match = href.match(/chineself\\.com\\/([a-z0-9%-]+)\\//);
    if (match && match[1] !== 'category' && match[1] !== currentSlug) {
      relatedWords.push(match[1]);
    }
  });
  
  // Slug from URL
  const slug = location.pathname.replace(/\\//g, '');
  
  // Chinese word from h1
  const chinese = document.querySelector('h1')?.textContent?.trim() || '';
  
  return {
    slug: slug,
    chinese: chinese,
    pinyin: pinyin,
    meaning: meaning,
    description: description,
    examples: examples.slice(0, 5),
    category: category,
    categoryName: categoryName,
    relatedWords: [...new Set(relatedWords)],
    sourceUrl: location.href
  };
})()`;

async function getUrlsFromSitemap(page, sitemapUrl) {
  console.log(`Fetching sitemap: ${sitemapUrl}`);
  await page.goto(sitemapUrl, { waitUntil: 'networkidle' });
  
  const urls = await page.evaluate(() => {
    const locs = document.querySelectorAll('loc');
    return Array.from(locs).map(loc => loc.textContent);
  });
  
  return urls.filter(url => !url.includes('/category/'));
}

async function scrapeWord(page, url, retries = 2) {
  const slug = url.replace('https://chineself.com/', '').replace('/', '');
  const filePath = path.join(DATA_DIR, `${slug}.json`);
  
  // Skip if already exists
  if (fs.existsSync(filePath)) {
    console.log(`Skip (exists): ${slug}`);
    return { status: 'skipped', slug };
  }
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('article', { timeout: 10000 });
    
    const data = await page.evaluate(extractionScript);
    
    if (!data || !data.chinese) {
      console.log(`Skip (no data): ${slug}`);
      return { status: 'no-data', slug };
    }
    
    // Sanitize description to avoid JSON issues
    if (data.description) {
      data.description = data.description.replace(/"/g, '「').replace(/"/g, '」');
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Saved: ${slug} (${data.chinese})`);
    return { status: 'success', slug, chinese: data.chinese };
  } catch (error) {
    if (retries > 0) {
      console.log(`Retry ${slug}: ${error.message}`);
      await new Promise(r => setTimeout(r, 2000));
      return scrapeWord(page, url, retries - 1);
    }
    console.log(`Error ${slug}: ${error.message}`);
    return { status: 'error', slug, error: error.message };
  }
}

async function main() {
  console.log('Starting scraper...');
  console.log(`Limit: ${limit === Infinity ? 'none' : limit}, Offset: ${offset}`);
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Collect all URLs from sitemaps
  const sitemapUrls = [
    'https://chineself.com/wp-sitemap-posts-post-1.xml',
    'https://chineself.com/wp-sitemap-posts-post-2.xml',
    'https://chineself.com/wp-sitemap-posts-post-3.xml',
    'https://chineself.com/wp-sitemap-posts-post-4.xml',
    'https://chineself.com/wp-sitemap-posts-post-5.xml',
  ];
  
  let allUrls = [];
  for (const sitemapUrl of sitemapUrls) {
    const urls = await getUrlsFromSitemap(page, sitemapUrl);
    allUrls = allUrls.concat(urls);
    console.log(`Found ${urls.length} URLs in ${sitemapUrl}`);
  }
  
  console.log(`Total URLs: ${allUrls.length}`);
  
  // Apply offset and limit
  const urlsToProcess = allUrls.slice(offset, offset + limit);
  console.log(`Processing ${urlsToProcess.length} URLs (offset: ${offset})`);
  
  const results = {
    success: 0,
    skipped: 0,
    error: 0,
    noData: 0
  };
  
  for (let i = 0; i < urlsToProcess.length; i++) {
    const url = urlsToProcess[i];
    const result = await scrapeWord(page, url);
    
    switch (result.status) {
      case 'success': results.success++; break;
      case 'skipped': results.skipped++; break;
      case 'error': results.error++; break;
      case 'no-data': results.noData++; break;
    }
    
    // Progress
    if ((i + 1) % 50 === 0) {
      console.log(`Progress: ${i + 1}/${urlsToProcess.length} (success: ${results.success}, skip: ${results.skipped}, error: ${results.error})`);
    }
    
    // Rate limiting
    await new Promise(r => setTimeout(r, 500));
  }
  
  await browser.close();
  
  console.log('\n=== Summary ===');
  console.log(`Success: ${results.success}`);
  console.log(`Skipped: ${results.skipped}`);
  console.log(`Errors: ${results.error}`);
  console.log(`No Data: ${results.noData}`);
}

main().catch(console.error);
