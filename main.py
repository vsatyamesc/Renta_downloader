import io
import math
import base64
from PIL import Image

def f_shuffle_r(grid, t, l_idx, n):
  """JS logic for row/column shifting based on a specific index."""
  i = math.ceil(n / 2)
  kn = n // 2
  d, l_arr, r_arr = [0]*n, [0]*i, [0]*kn    
  if t % 2 == 0:
      o = k_cnt = 0
      for c in range(n):
          if c % 2 == 0: l_arr[o] = grid[c][l_idx]; o += 1
          else: r_arr[k_cnt] = grid[c][l_idx]; k_cnt += 1
      s = 0
      for c in range(i):
          if c < len(r_arr): d[s] = r_arr[c]; s += 1
          if c < len(l_arr): d[s] = l_arr[c]; s += 1
  else:
      o = k_cnt = 0
      for c in range(n):
          if c < i: l_arr[o] = grid[c][l_idx]; o += 1
          else: r_arr[k_cnt] = grid[c][l_idx]; k_cnt += 1
      s = 0
      for c in range(i):
          if c < len(l_arr): d[s] = l_arr[c]; s += 1
          if c < len(r_arr): d[s] = r_arr[c]; s += 1
  for c in range(n): grid[c][l_idx] = d[c]
  return grid

def generate_tile_map(prd_ser, page_num, image_split):
  """Calculates the NxN destination grid using the provided image_split."""
  N = image_split
  # Initialize the grid
  grid = [[(r * N + c) for c in range(N)] for r in range(N)]    
  # Initial coordinate transformation (Deterministic)
  for r in range(N):
      f = (N - r % N) % N
      grid[r] = grid[r][f:] + grid[r][:f]    
  for c in range(N):
      col = [grid[r][c] for r in range(N)]
      f = (N - c % N) % N
      shifted = col[f:] + col[:f]
      for r in range(N):
          grid[r][c] = shifted[r]
  # Dynamic shuffle using prd_ser and page_num
  for l in range(N):
      E = l + 1
      C_key = int(page_num) + int(prd_ser)
      if C_key % 20 == 0:
          C_key = abs(int(page_num) - int(prd_ser)) + 21        
      # Limit formula from JS
      limit = int((E * C_key + page_num / 20) % 20) - 1
      for h in range(limit, -1, -1):
          grid = f_shuffle_r(grid, h, l, N)    
  # Return mapping: tile_index -> (column, row)
  return {grid[r][c]: (c, r) for r in range(N) for c in range(N)}

def decrypt_manga_page(b64_string, prd_ser, page_num, image_split):
  """_summary_
  Args:
      b64_string (_type_): Octet File
      prd_ser (_type_): From index.vew
      page_num (_type_): Page number from Header Link
      image_split (_type_): From index.view
  """
  # Decode payload
  data = base64.b64decode(b64_string)    

  # Extract Metadata
  meta_len = int(data[:9].decode().strip())
  metadata = data[9:9+meta_len].decode().split('|')
  total_w, total_h = int(metadata[0]), int(metadata[1])    
  raw_payload = data[9+meta_len:]

  # segments start at metadata[2] (wImg, hImg, then tiles)
  segments = metadata[2:]     
  images = []
  for seg in segments:
      if not seg: continue
      start, length = map(int, seg.split(','))
      images.append(Image.open(io.BytesIO(raw_payload[start : start + length])))

  # Canvas Construction
  w_strip, h_strip = images[0], images[1]
  tiles = images[2:]    
  canvas = Image.new("RGB", (total_w, total_h))    

  # Paste edge cases first
  canvas.paste(w_strip, (0, 0))
  canvas.paste(h_strip, (w_strip.width, 0))    

  # Calculate tile sizes
  tile_w, tile_h = tiles[0].width, tiles[0].height
  tile_map = generate_tile_map(prd_ser, page_num, image_split)    

  # Total tiles should be image_split * image_split
  total_expected = image_split * image_split    

  # Reassemble Tiles
  for i, tile in enumerate(tiles):
      if i >= total_expected:
          break         
      target_col, target_row = tile_map[i]        
      dest_x = target_col * tile_w + w_strip.width
      dest_y = target_row * tile_h + h_strip.height        
      canvas.paste(tile, (dest_x, dest_y))        
  canvas.save(f"decrypted_p{page_num}.jpg")
  print(f"Page {page_num} reassembled using {image_split}x{image_split} grid.")

# Example usage:
# decrypt_manga_page("BASE64_HERE", "123456", 1, 7)
# Example Call:

# Octet steam of Images are saved in data.txt
with open("data.txt", "r") as f:
    data = f.read()
decrypt_manga_page(data, "3072446", 5, 7)