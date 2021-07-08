import * as fs from "fs/promises";
import * as fss from "fs";
const SECTOR_SIZE = 0x930;
const BLOCK_SIZE = 2048;
const BLOCK_OFF = 12 + 8 + 4;

export const init = async (conf) => {
  //TODO: maybe load original fileposdat to see if we've outgrown a file
  conf = conf ?? JSON.parse(fss.readFileSync(`conf.json`));
  //let file_info_fp = await fs.open(conf.filepos);
  let img_fp = await fs.open(conf.iso, fss.constants.O_RDWR);
  let fileposdat = await read(img_fp, 0x17, 0x1b88);
  return {
    img: img_fp,
    fileposdat,
  };
};

export const close = async ({ img, fileposdat }) => {
  await write(img, 0x17, 0x1b88, fileposdat);
  img.close();
  //fileposdat.close();
};

//let SLUS = Buffer.from([0x1b,0,0,0,0,0x70,0x1c,0])
let SLUS = [0x1b, 0x1c7000];

const read = async (img, file_block, file_size) => {
  let sector = Buffer.alloc(SECTOR_SIZE);
  let output = Buffer.allocUnsafe(file_size);
  let off = 0;
  let sec = file_block * SECTOR_SIZE;
  while (off < file_size) {
    console.assert(
      SECTOR_SIZE == (await img.read(sector, 0, SECTOR_SIZE, sec)).bytesRead,
      `Reading sector ${sec / SECTOR_SIZE}`
    );
    let read_size = Math.min(BLOCK_SIZE, file_size - off);
    sector.copy(output, off, BLOCK_OFF, BLOCK_OFF + read_size);
    off += read_size;
    sec += SECTOR_SIZE;
  }
  return output;
};

const write = async (img, file_block, file_size, buff) => {
  let sector = Buffer.alloc(SECTOR_SIZE);
  //let buff_size = buff.byteLength;
  //TODO: maybe update filepos.dat?
  //TODO: read filepos.dat from file

  let off = 0;
  let sec = file_block * SECTOR_SIZE;
  while (off < file_size) {
    if (
      SECTOR_SIZE != (await img.read(sector, 0, SECTOR_SIZE, sec)).bytesRead
    ) {
      throw new Error(`Error reading sector.`);
    }
    let write_size = Math.min(file_size - off, BLOCK_SIZE);
    // if (off + write_size > buff_size) {
    //   if (off < buff_size) {
    //     let len = buff_size - off;
    //     buff.copy(sector, BLOCK_OFF, off, off + len);
    //     sector.fill(0, BLOCK_OFF + len, BLOCK_OFF + BLOCK_SIZE);
    //   } else {
    //     sector.fill(0, BLOCK_OFF, BLOCK_OFF + BLOCK_SIZE);
    //   }
    // } else {
    buff.copy(sector, BLOCK_OFF, off, off + write_size);
    // }
    // console.log(write_size, file_size, off);
    if (write_size < BLOCK_SIZE) {
      console.log(
        `filling end of block ${write_size.toString(16)}, ${
          BLOCK_SIZE - write_size
        }`
      );
      sector.fill(0, BLOCK_OFF + write_size, BLOCK_OFF + BLOCK_SIZE);
    }

    console.assert(
      SECTOR_SIZE ==
        (await img.write(sector, 0, SECTOR_SIZE, sec)).bytesWritten,
      `Writing sector ${sec / SECTOR_SIZE}`
    );
    off += write_size;
    sec += SECTOR_SIZE;
  }
};

export const read_file = async ({ img, fileposdat }, filenum) => {
  //let off = filenum * 8;
  //let file_info = Buffer.alloc(8);

  let file_block, file_size;
  if (filenum >= 0) {
    //let res = await fileposdat.read(file_info, 0, 8, off);
    //console.assert(res.bytesRead == 8, "Reading file info");
    file_block = fileposdat.readUInt32LE(filenum * 8);
    file_size = fileposdat.readUInt32LE(filenum * 8 + 4);
  } else {
    file_block = SLUS[0];
    file_size = SLUS[1];
  }
  console.log(
    `Reading file ${filenum} at block ${file_block} length ${file_size}`
  );
  return await read(img, file_block, file_size);
};

export const write_file = async ({ img, fileposdat }, filenum, buff) => {
  // let off = filenum * 8;
  // let file_info = Buffer.alloc(8);

  let file_block, file_size;
  if (filenum >= 0) {
    // let res = await fileposdat.read(file_info, 0, 8, off);
    // console.assert(res.bytesRead == 8, "Reading file info");
    file_block = fileposdat.readUInt32LE(filenum * 8);
    file_size = fileposdat.readUInt32LE(filenum * 8 + 4);
    // console.assert(
    //   file_size <= file_info.readUInt32LE(4),
    //   `File is larger than orginal, data lost.  Ignore if not standard archive.`
    // );
  } else {
    file_block = SLUS[0];
    file_size = SLUS[1];
  }
  console.log(
    `Writing file ${filenum} at block ${file_block} length ${file_size}`
  );
  await write(img, file_block, buff.byteLength, buff);
  if (file_size != buff.byteLength) {
    fileposdat.writeUInt32LE(buff.byteLength, filenum * 8 + 4);
  }
};
