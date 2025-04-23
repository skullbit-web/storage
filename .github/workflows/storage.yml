import sys, os, hashlib, zstandard as zstd
from urllib.parse import urlparse
import requests

def download_file(url):
    response = requests.get(url)
    response.raise_for_status()
    filename = os.path.basename(urlparse(url).path) or "downloaded_file"
    with open(filename, 'wb') as f:
        f.write(response.content)
    return filename

file_path = sys.argv[1]
out_dir = sys.argv[2]

# If it's a URL, download it first
if file_path.startswith("http://") or file_path.startswith("https://"):
    file_path = download_file(file_path)

# Read and compress
with open(file_path, 'rb') as f:
    data = f.read()

compressed = zstd.ZstdCompressor(level=22).compress(data)
hash_name = hashlib.sha256(data).hexdigest()
os.makedirs(out_dir, exist_ok=True)

out_path = f"{out_dir}/{hash_name}.zst"
with open(out_path, 'wb') as f:
    f.write(compressed)

print(f"::set-output name=hash::{hash_name}")
