// ==UserScript==
// @name         Tw Renta Downloader - CDN Stream Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Downloads responses with MIME type `binary/octet-stream` from Renta CDN streams (these CDN streams keep changing).
// @author       vsatyamesc
// @license      MIT
// @match        https://sample.myrenta.com/*
// @source       https://github.com/vsatyamesc/Renta_downloader
// @grant        GM_download
// @grant        GM_log
// ==/UserScript==
const CDN_URL_PATTERN = "myrenta-books.s3.ap-northeast-1.amazonaws.com";
(function () {
  "use strict";

  // Set to track already downloaded URLs
  const downloadedUrls = new Set();

  // Listen to all XMLHttpRequests
  const originalOpen = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    if (method === "GET" && url.includes(CDN_URL_PATTERN)) {
      console.log(`Matched CDN URL: ${url}`);

      // Skip if already downloaded
      if (downloadedUrls.has(url)) {
        console.log(`Skipping already downloaded URL: ${url}`);
        return originalOpen.apply(this, arguments);
      }

      // Add to downloaded set
      downloadedUrls.add(url);

      // Extract filename from URL
      const filename = url.split("/").pop().split("?")[0] || "downloaded_file";

      // Download using GM_download
      GM_download({
        url: url,
        name: filename,
        onload: () => console.log(`Downloaded: ${filename}`),
        onerror: (err) => console.error(`Failed to download ${url}:`, err),
      });
    }

    return originalOpen.apply(this, arguments);
  };

  console.log("MyRenta Image Downloader script is active.");
})();
