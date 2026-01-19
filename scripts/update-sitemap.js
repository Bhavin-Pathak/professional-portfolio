/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');

// Paths - Use process.cwd() to ensure it works from the project root
const rootDir = process.cwd();
const blogDataPath = path.join(rootDir, 'src', 'static', 'blog-posts.json');
const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
const baseUrl = 'https://bhaviinpathak.online';

// Read blog data
const blogData = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));

// Static pages
const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/about', priority: '0.8', changefreq: 'monthly' },
  { loc: '/projects', priority: '0.9', changefreq: 'monthly' },
  { loc: '/skills', priority: '0.7', changefreq: 'monthly' },
  { loc: '/experience', priority: '0.7', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.8', changefreq: 'monthly' },
  { loc: '/blog', priority: '0.9', changefreq: 'daily' },
];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

// Add static pages
staticPages.forEach(page => {
  sitemap += `
  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>${page.priority}</priority>
  </url>`;
});

// Add blog posts
blogData.posts.forEach(post => {
  // Basic date parsing (e.g., "Jan 18, 2026")
  const dateStr = post.date;
  let isoDate;
  try {
    isoDate = new Date(dateStr).toISOString().split('T')[0];
  } catch (e) {
    isoDate = new Date().toISOString().split('T')[0];
  }

  sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.id}</loc>
    <lastmod>${isoDate}</lastmod>
    <priority>0.6</priority>
  </url>`;
});

sitemap += `
</urlset>`;

// Write sitemap
fs.writeFileSync(sitemapPath, sitemap);
console.log('✅ Sitemap updated successfully at:', sitemapPath);
