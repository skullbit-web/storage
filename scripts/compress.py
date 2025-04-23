# compress.py
import sys, zstandard as zstd, hashlib

file_path = sys.argv[1]
out_dir = sys.argv[2]

with open(file_path, 'rb') as f:
    data = f.read()

compressed = zstd.ZstdCompressor(level=22).compress(data)
hash_name = hashlib.sha256(data).hexdigest()

out_path = f"{out_dir}/{hash_name}.zst"
with open(out_path, 'wb') as f:
    f.write(compressed)

print(f"::set-output name=hash::{hash_name}")
