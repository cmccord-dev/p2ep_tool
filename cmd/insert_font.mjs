import * as fs from "fs";
import * as archive from "../lib/archive.mjs";
import * as cdimage from "../lib/cdimage.mjs";
import * as file_type from "../lib/file.mjs";
import * as msg from "../lib/msg_script.mjs";
import * as lzss from "../lib/lzss.mjs";
import * as file_table from "../lib/file_table.mjs";
import PNG from "pngjs";

export const command = [`insert_font file`];
export const desc = "Insert font";
export const builder = {
  file: {
    demandOption: true,
  },
};
export const handler = async (argv) => {
  let cd = await cdimage.init();
  //   if (!fs.existsSync(argv.out)) fs.mkdirSync(argv.out);
  //let strings = [];
  //let file_buff = await cdimage.read_file(cd, 35);
  //   console.log(argv);
  let font = fs.readFileSync(argv.file);

  let file_num = 13;
  let f13 = await cdimage.read_file(cd, 13);
  //   console.log(f13);
  let files = archive.extract_files(f13, 13);
  //   console.log(pngjs);
  let font_file = file_type.parseFile(files[0]).data;
  console.log(font_file);
  //   console.log(PNG.PNG);
  let png = PNG.PNG.sync.read(font);
  if (png.width != 8 || png.height != 0x480) {
    console.error(`Invalid font file`);
    return -1;
  }
  let ptr = 0;
  console.log(png.data);

  while (ptr < 0x480) {
    let v = 0;
    for (let i = 8; i--; ) {
      v <<= 1;
      v |= png.data[(ptr * 8 + i) * 4] == 0xff;
    }
    font_file[ptr++] = v;
  }
  console.log(font_file);
  let res = lzss.compress(font_file, 0xc);
  res.writeUInt32LE(0x201, 0);
  res.writeUInt32LE(res.byteLength, 4);
  res.writeUInt32LE(font_file.byteLength, 8);
  files[0] = res;
  let arch = archive.build_archive(files, 13);
  await cdimage.write_file(cd, 13, arch);

  //   if (file.file != 35) {
  //     console.error(`Unexpected file ${file.file}`);
  //     return;
  //   }
  //   let files = file.strings.map((a) => {
  //     let len = msg.calculate_dialog_length(a);
  //     let buff = Buffer.alloc(len);
  //     msg.compile_msg(a, buff, 0);
  //     let res = lzss.compress(buff, 0xc);
  //     res.writeUInt32LE(0x201, 0);
  //     res.writeUInt32LE(res.byteLength, 4);
  //     res.writeUInt32LE(len, 8);
  //     return res;
  //   }); //f32 seems to be persona tables

  //   let arch = archive.build_archive(files, file.file);
  //   //   fs.writeFileSync(`35.bin`, arch);
  //   await cdimage.write_file(cd, file.file, arch);

  //   let to_patch = [
  //     [32, 0x35bc],
  //     [33, 0x2d8c],
  //     [39, 0x24b74],
  //   ];

  //   for (let i = 0; i < to_patch.length; i++) {
  //     let table = await cdimage.read_file(cd, to_patch[i][0]);
  //     let table_ptr = to_patch[i][1];
  //     file_table.write(table, table_ptr, files);
  //     await cdimage.write_file(cd, to_patch[i][0], table);
  //   }

  await cdimage.close(cd);
};
