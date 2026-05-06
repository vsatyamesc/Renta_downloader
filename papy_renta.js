// Date 06 May 2026 - New UI
let image_max_1qa = document.getElementById("scrollBar");
const start_img_1qa = Number(image_max_1qa.min);
const end_img_1qa = Number(image_max_1qa.max);

const CANVAS_SELECTOR = "#viewer #viewWrap #mainSlider .pageWrap canvas";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function save_image_to_device_vesc(base64image, fileNum) {
  const a = document.createElement("a");
  a.href = base64image;
  const paddedIndex = String(fileNum).padStart(3, "0");
  a.download = "image_" + paddedIndex + ".png";

  document.body.appendChild(a);
  a.click();
  try {
    document.body.removeChild(a);
  } catch (e) {}
}

function isCanvasUnrendered(canvas) {
  try {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const pixels = new Uint32Array(imgData.buffer);

    for (let i = 0; i < pixels.length; i++) {
      if (pixels[i] !== 0) {
        return false;
      }
    }
    return true;
  } catch (e) {
    console.warn(
      "Could not read pixels directly, falling back to basic check.",
    );
    return canvas.toDataURL().length < 5000;
  }
}

async function waitForPageLoadAsync(targetPage, previousData) {
  let targetWrap = null;

  for (let attempts = 0; attempts < 50; attempts++) {
    const loadingBox = document.querySelector(
      `.pageWrap .loadingBox[data-num="${targetPage}"]`,
    );
    let canvasToGrab = null;

    if (loadingBox) {
      targetWrap = loadingBox.closest(".pageWrap");
      if (loadingBox.getAttribute("data-loaded") === "1") {
        canvasToGrab = targetWrap.querySelector("canvas");
      }
    } else if (targetWrap) {
      canvasToGrab = targetWrap.querySelector("canvas");
    } else {
      const canvas = document.querySelector(CANVAS_SELECTOR);
      if (canvas) {
        const wrap = canvas.closest(".pageWrap");
        const anyLoadingBox = wrap ? wrap.querySelector(".loadingBox") : null;
        if (
          !anyLoadingBox ||
          anyLoadingBox.getAttribute("data-loaded") === "1"
        ) {
          canvasToGrab = canvas;
        }
      }
    }

    if (canvasToGrab) {
      await sleep(500);

      if (!isCanvasUnrendered(canvasToGrab)) {
        const currentData = canvasToGrab.toDataURL("image/png", 1.0);

        if (currentData !== previousData) {
          let actualPageNum = canvasToGrab.getAttribute("data-num");

          if (!actualPageNum) {
            const wrap = canvasToGrab.closest(".pageWrap");
            if (wrap) {
              actualPageNum =
                wrap.getAttribute("data-num") ||
                wrap.querySelector(".loadingBox")?.getAttribute("data-num");
            }
          }
          const finalPageNum =
            actualPageNum !== null && actualPageNum !== undefined
              ? actualPageNum
              : targetPage + 1;

          return {
            imageData: currentData,
            pageNum: finalPageNum,
          };
        }
      }
    }

    await sleep(200);
  }

  console.warn(`Timeout waiting for page ${targetPage}.`);
  return { imageData: previousData, pageNum: targetPage + 1 };
}

async function downloadImages() {
  let previousData = "";

  for (let i = start_img_1qa; i <= end_img_1qa; i++) {
    console.log(`Triggering load for page index: ${i}`);

    if (i > start_img_1qa) {
      if (typeof jumpPage === "function") {
        jumpPage(i);
      } else {
        console.error("jumpPage function not found!");
        break;
      }
    }
    const result = await waitForPageLoadAsync(i, previousData);
    save_image_to_device_vesc(result.imageData, result.pageNum);
    previousData = result.imageData;
    await sleep(400);
  }
  console.log("Download complete.");
}

downloadImages();
