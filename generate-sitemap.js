const fs = require("fs");
const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");

// List your routes here
const links = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/sign-in", changefreq: "monthly", priority: 0.8 },
  { url: "/dashboard", changefreq: "daily", priority: 0.9 },
  { url: "/crear-quinipolo", changefreq: "monthly", priority: 0.7 },
  { url: "/quinipolo-success", changefreq: "monthly", priority: 0.7 },
  { url: "/correction-success", changefreq: "monthly", priority: 0.7 },
  { url: "/quinipolo/correct", changefreq: "monthly", priority: 0.7 },
  { url: "/league-dashboard", changefreq: "monthly", priority: 0.7 },
  { url: "/join-league", changefreq: "monthly", priority: 0.7 },
  // Add more routes as needed
];

// Create a stream to write to
const stream = new SitemapStream({ hostname: "https://quinipolo.com" });

// Create the sitemap
streamToPromise(Readable.from(links).pipe(stream))
  .then((data) => {
    fs.writeFileSync("./public/sitemap.xml", data.toString());
    console.log("Sitemap generated!");
  })
  .catch((err) => {
    console.error("Error generating sitemap:", err);
  });
