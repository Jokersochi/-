import React from 'react';
import Head from 'next/head';
import { config } from '../config';

export function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  noindex = false,
  article,
}) {
  const fullTitle = title 
    ? config.seo.titleTemplate.replace('%s', title)
    : config.seo.defaultTitle;
  
  const fullDescription = description || config.app.description;
  const fullUrl = url ? `${config.app.url}${url}` : config.app.url;
  const fullImage = image || `${config.app.url}/og-image.jpg`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <link rel="canonical" href={fullUrl} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:locale" content={config.seo.openGraph.locale} />
      <meta property="og:site_name" content={config.seo.openGraph.siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content={config.seo.twitter.cardType} />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content={config.seo.twitter.handle} />

      {/* Article specific */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.tags?.map((tag, i) => (
            <meta key={i} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />

      {/* PWA */}
      <meta name="application-name" content={config.app.name} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={config.app.name} />
      <meta name="mobile-web-app-capable" content="yes" />
    </Head>
  );
}

export default SEO;
