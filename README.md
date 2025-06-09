# Renta Downloader

You can use this code to download Images from Renta papy, I had to make it as other codes had stopped working. This code should be relatively easy to manage. This works directly on your browser and downloads the files from your browser. So make sure you set your ***Download Path*** to folder where you want to download.
## There's <code style="color : #7deb34">tw.myrenta.com</code> and <code style="color : #7deb34">renta.papy.co.jp</code> code separetely, use the code wisely. Follow same instructions for both.
## There are two Versions, Tampermonkey Script and Browser Console, I suggest using browser console for Horizontal Reader Downloader, Webtoon is only supported for Tw.renta.com for now, use Tampermonkey to use the script, there are 2 scripts use wisely.

![Tampermonkey Script]( https://greasyfork.org/en/scripts/534997-renta-papy-image-downloader )

## This is memory consuming as it's storing the images into RAM then downloading, so make sure you close any other applications unless you have huge RAM.

## Usage
  1. Open the Manga reader page after buying the manga or whatever, and then open "Web Developer Settings" browser name may change but the shortcut is "Ctrl + Shift + I" for windows.
  2. Set the Page Slider to 1 and use Horizontal Reader.
  3. Extend or contract the Web Developer settings so that only 1 manga page is visible on the browser and then Reload the page. (Very important)
  4. Copy paste the code from the only javascript file present and then run (by pressing enter).

## Usage for tw webtoon/vertical reader downloader for tw.renta.com
  1. v1, is a simple Binary Search Downloader, no need to do anything just run.
  2. v2 relies on the image url pattern, just find the image url from network requests and replace it in the script and run, you can see the similar pattern in the script itself.


## To Download other mangas or chapters, restart the browser.
Adding images for help

![Image 1](image/img1.png)
![Image 2](image/img2.png)
