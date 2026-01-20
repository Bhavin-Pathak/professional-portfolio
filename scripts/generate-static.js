/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');

const buildDir = path.join(process.cwd(), 'build');
const blogDataPath = path.join(process.cwd(), 'src', 'static', 'blog-posts.json');

// Define your routes (same as in your App.js/Sitemap)
const routes = [
    'about',
    'projects',
    'skills',
    'experience',
    'contact',
    'blog'
];

// Add blog posts to routes
try {
    const blogData = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));
    blogData.posts.forEach(post => {
        routes.push(`blog/${post.id}`);
    });
} catch (e) {
    console.error('Error reading blog posts for static generation:', e);
}

console.log('🚀 Starting static route generation for SEO...');

routes.forEach(route => {
    const routeDir = path.join(buildDir, route);

    // Create directory
    if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
    }

    // Copy index.html to the directory as index.html
    // This trick makes GitHub Pages serve the app at /route/ with Status 200 OK
    try {
        fs.copyFileSync(
            path.join(buildDir, 'index.html'),
            path.join(routeDir, 'index.html')
        );
        console.log(`✅ Generated: ${route}/index.html`);
    } catch (err) {
        console.error(`❌ Failed to generate ${route}:`, err);
    }
});

console.log('✨ Static route generation complete!');
