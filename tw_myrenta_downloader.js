// For https://tw.myrenta.com
// Taiwan/China Renta Downloader
// copy this to console
(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // Wait until the canvas has non-black pixels and has changed since last frame
  async function waitForCanvasUpdate(canvas, previousDataURL) {
    const ctx = canvas.getContext("2d");
    for (let i = 0; i < 10; i++) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const nonBlack = imgData.some((v, idx) => idx % 4 !== 3 && v > 0);
      if (nonBlack) {
        const currentDataURL = canvas.toDataURL("image/png");
        if (currentDataURL !== previousDataURL) {
          return currentDataURL;
        }
      }
      await sleep(1000);
    }
    throw new Error("Canvas did not update in time");
  }

  const range = document.getElementById("rangeInput");
  if (!range) throw new Error("No range-input found");
  const canvas = document.querySelector('#readerCanvas');
  if (!canvas) throw new Error("No <canvas> found");

  const min = +range.min, max = +range.max;
  let previous = null;

  for (let v = min; v <= max; v++) {
    range.value = v;
    range.dispatchEvent(new Event('input', { bubbles: true }));
    range.dispatchEvent(new Event('change', { bubbles: true }));
    await sleep(1000);

    try {
      const dataURL = await waitForCanvasUpdate(canvas, previous);
      previous = dataURL;

      // Create a temporary link to download
      const a = document.createElement('a');
      a.href = dataURL;
      var padIndex = String(v).padStart(3,'0');
      a.download = `image-${padIndex}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      console.log(`Downloaded image-${padIndex}.png`);
    } catch (err) {
      console.error(`Value ${padIndex}:`, err.message);
    }
  }
  console.log('Done.');
})();
