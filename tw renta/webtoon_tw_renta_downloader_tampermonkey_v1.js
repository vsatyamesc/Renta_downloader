// ==UserScript==
// @name         Tw Renta Downloader - Binary Stream Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Downloads responses with MIME type `binary/octet-stream` from Renta CDN streams (these CDN streams keep changing).
// @author       vsatyamesc
// @license      MIT
// @match        https://sample.myrenta.com/*
// @source       https://github.com/vsatyamesc/Renta_downloader
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

(function () {
  "use strict";

  // Set to track already downloaded URLs
  const downloadedUrls = new Set();

  // Intercept network requests and responses using GM_xmlhttpRequest
  const originalOpen = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    if (method === "GET") {
      // Monitor response
      const xhr = this;
      xhr.addEventListener("readystatechange", function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const contentType = xhr.getResponseHeader("Content-Type");
          if (contentType && contentType.includes("binary/octet-stream")) {
            console.log(`Matched binary/octet-stream response: ${url}`);

            // Skip if already downloaded
            if (downloadedUrls.has(url)) {
              console.log(`Skipping already downloaded URL: ${url}`);
              return;
            }

            // Add to downloaded set
            downloadedUrls.add(url);

            // Extract filename
            let filename =
              url.split("/").pop().split("?")[0] || "downloaded_file";

            // Download the response
            GM_download({
              url: url,
              name: filename,
              onload: () => console.log(`Downloaded: ${filename}`),
              onerror: (err) =>
                console.error(`Failed to download ${url}:`, err),
            });
          }
        }
      });
    }

    return originalOpen.apply(this, arguments);
  };

  console.log("Binary Stream Downloader is active.");
})();
