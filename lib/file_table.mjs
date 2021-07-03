export function write(table, off, files) {
  let ptr = 0;
  let fptr = 0;
  let table_ptr = off;
  while (fptr < files.length) {
    let start = table.readUInt32LE(table_ptr);
    let count = start >> 0x19;
    table.writeUInt32LE((count << 0x19) | ptr, table_ptr);
    table_ptr += 4;
    while (count-- > 0) {
      ptr += files[fptr++].byteLength;
      while (ptr & 0x3) ptr++;
      if (0x800 - (ptr & 0x7ff) < 0x10) {
        ptr += 0x800 - (ptr & 0x7ff);
      }
    }
  }
  console.assert(fptr == files.length);
}
