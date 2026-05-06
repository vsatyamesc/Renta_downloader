# This is index.view decoded! Will be making Tampermonkey Based on this Since it won't save UserID encoded on images!

# Here's the Working
Here is the breakdown of how the decryption and reconstruction work:
1. The Data Fetching (XMLHttpRequest)

The function drawCanvasImage initiates an arraybuffer request to a URL (the octet files from this requests e.g. - https://dre-aka-p.papy.co.jp/filesv/sc/contents/3072446/6s/0/1).

    It reads the first few bytes of the response to determine metadata like width, height, and "data lengths."

    It strips away headers to get to the raw encrypted image data.

2. The Descrambling Logic (f_shuffle_r)

The script uses a shuffle/unshuffle algorithm. The images are sent from the server in a "scrambled" state—meaning the blocks of the image are in the wrong order. The values are usually present in `index.view`

    The Key: It uses prd_ser (Product Serial) and the page number to seed a mathematical shuffle.

    The Grid: It creates a 7x7 grid (_ = new Array(7)). 	var imageSplit = 7;

    The Algorithm: The f_shuffle_r function performs row and column shifts to determine the correct coordinates for each image tile. 
    ```
    for(var n=0; n<total; n++) 
      t.drawImage(..., ar_chara[...].didx[n][0] * i.width + y, ...)
    if(t % 2 == 0)
    C=parseInt(e.lastChild.dataset.num)+parseInt(prd_ser);C%20==0&&(C=Math.abs(e.lastChild.dataset.num-prd_ser)+21);
    ```

3. The "Image Reconstruction" (D.drawImage)

Once the script calculates the correct positions (x and y coordinates) for the tiles, it uses the Canvas API:

    It takes small pieces of the downloaded image data.

    It converts these pieces from Base64 or Blob data.

    It uses D.drawImage(i, ... ar_chara[a.dataset.num].didx[n][0] * i.width + y, ...) to paint the pieces onto the hidden canvas in the correct order.

4. Anti-Tamper Features

The script includes several "security" measures to prevent easy copying:

    Context Menu Disable: document.oncontextmenu=function(){return!1}; (Prevents right-clicking).

    Watermarking (make_sukasi): It dynamically generates a "Sukashi" (watermark) containing the user_id and overlays it across the image so that even if you take a screenshot, your ID is embedded in the image.

    Canvas Storage: It uses storage: "discardable" and frequently deletes canvas elements after they are out of view to prevent high-resolution memory dumps.

