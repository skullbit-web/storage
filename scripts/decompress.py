# decompress.py
import sys, zstandard as zstd

input_path = sys.argv[1]
output_path = sys.argv[2]

with open(input_path, 'rb') as f:
    compressed = f.read()

data = zstd.ZstdDecompressor().decompress(compressed)
with open(output_path, 'wb') as f:
    f.write(data)
