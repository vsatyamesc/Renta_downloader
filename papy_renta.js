// Date 19 March 2025
// You can change start_img_1qa by any number, 0-indexed to make it start from that page, meaning if you want to download from page 10, do 10-1=9, and set it to 9
// Same for end image, end_img_1qa, don't want to download full chapter set the ending page. same as above, ending page is 24, then set it to 24-1 = 23
let image_max_1qa = document.getElementById("scrollBar");
const start_img_1qa = Number(image_max_1qa.min);
const end_img_1qa = Number(image_max_1qa.max);

function save_image_to_device_vesc(base64image, index) {
  const a = document.createElement("a");
  a.href = base64image;
  const paddedIndex = String(index).padStart(3, '0');
  a.download = "image_" + paddedIndex + ".png";
  a.click();
  try{
  document.body.removeChild(a);
  } catch (error) {
    console.error(error);
  }
}

function waitForCanvasUpdate(previousData, index, resolve) {
  const canvas = document.querySelector("#center .imgWrap canvas.canvas");
  const currentData = canvas.toDataURL("image/png", 1.0);
  if (currentData !== previousData) {
    resolve(currentData);
  } else {
    setTimeout(() => waitForCanvasUpdate(previousData, index, resolve), 100); // Poll every 100ms
  }
}

async function downloadImages() {
  let previousData = ""; // Placeholder for initial canvas data
  for (let i = start_img_1qa; i <= end_img_1qa; i++) {
    if (i === start_img_1qa) {
      // Handle the first page
      const canvas = document.querySelector("#center .imgWrap canvas.canvas");
      previousData = canvas.toDataURL("image/png", 1.0);
      save_image_to_device_vesc(previousData, i);
    } else {
      jumpPage(i); // Trigger the page change

      // Wait for the canvas to update
      const updatedImage = await new Promise((resolve) =>
        waitForCanvasUpdate(previousData, i, resolve)
      );

      // Save the updated image
      save_image_to_device_vesc(updatedImage, i);

      // Update the previous data for the next iteration
      previousData = updatedImage;
    }
  }
}

downloadImages();
