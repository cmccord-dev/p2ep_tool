const DEBUG_SCRIPT = false;
export const decompress = (input, ptr, compressed_size, uncompressed_size) => {
  let off = ptr;
  if (
    compressed_size == 0 ||
    uncompressed_size == 0 ||
    compressed_size > uncompressed_size
  ) {
    console.error(`Invalid compressed data at ${off}`);
    return null;
  }
  if (DEBUG_SCRIPT)
    console.log(
      `Trying to decompress RLE encoded data ${compressed_size}->${uncompressed_size} at ${off}`
    );
  let output = Buffer.allocUnsafe(uncompressed_size);
  let optr = 0;
  while (optr < uncompressed_size && ptr - off < compressed_size) {
    if ((input[ptr] & 0x80) == 0x80) {
      let count = (input[ptr++] & 0x7f) + 3;
      let char = input[ptr++];

      //while (count--) output[ptr++] = char;
      output.fill(char, optr, optr + count);
      optr += count;
    } else {
      let count = input[ptr++] + 1;
      if (isNaN(count)) {
        console.log(ptr - 1);
      }
      input.copy(output, optr, ptr, ptr + count);
      optr += count;
      ptr += count;
      //while (count--) output[optr++] = input[ptr++];
    }
  }
  if (optr != uncompressed_size || ptr - off != compressed_size) {
    console.error(
      `RLE Decompression failed at ${off}: expected ${
        ptr - off
      }=${compressed_size} and ${optr}=${uncompressed_size}`
    );
  }
  return output;
};
