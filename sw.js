/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "android-chrome-192x192.28350fad.png",
    "revision": "4254fcac3242fea7bb1fe03c43aa6c59"
  },
  {
    "url": "android-chrome-512x512.5e391b4f.png",
    "revision": "25ebeff8c8d2c2fd1d658bb625a23746"
  },
  {
    "url": "apple-touch-icon.fbb0e943.png",
    "revision": "26458c97c00a4ba7a866bb8d9906e827"
  },
  {
    "url": "favicon-32x32.826bc237.png",
    "revision": "47140b32a8ce141bd45cc863ed201aaa"
  },
  {
    "url": "index.html",
    "revision": "7f5d729e8bf3741dc9d6b731152af2b6"
  },
  {
    "url": "report.html",
    "revision": "63b9bde135cde10ffa9f33be751bea2f"
  },
  {
    "url": "src.718e1654.js",
    "revision": "7ea0e9616a4f291d12a71d2c55db934a"
  },
  {
    "url": "src.88fb6af1.css",
    "revision": "a3f6fb79026bd432873fc4a81a8d9eb4"
  },
  {
    "url": "/",
    "revision": "3bed0a374370efab795a41593c72c909"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/index.html"));
