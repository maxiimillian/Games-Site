function Sitemap() {
  return null;
}

export function getServerSideProps({ res }) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>https://playholdr.com/</loc>
            <lastmod>2022-05-30</lastmod>
            <changefreq>daily</changefreq>
            <priority>1.0</priority>
        </url>

    </urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default Sitemap;
