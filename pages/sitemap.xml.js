import { config } from '../config';

function generateSiteMap(designs = []) {
  const baseUrl = config.app.url;
  
  // Static pages
  const staticPages = [
    '',
    '/pricing',
    '/gallery',
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${staticPages
    .map((path) => {
      return `
  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${path === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    })
    .join('')}
  ${designs
    .map((design) => {
      return `
  <url>
    <loc>${baseUrl}/gallery/${design.id}</loc>
    <lastmod>${design.updated_at || design.created_at}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <image:image>
      <image:loc>${design.image_url}</image:loc>
      <image:title>${design.style} interior design</image:title>
    </image:image>
  </url>`;
    })
    .join('')}
</urlset>`;
}

function SiteMap() {
  // getServerSideProps will handle the response
}

export async function getServerSideProps({ res }) {
  // In production, fetch actual designs from database
  const designs = [];

  const sitemap = generateSiteMap(designs);

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
