import * as fs from "fs";
import * as archive from "../lib/archive.mjs";
import * as cdimage from "../lib/cdimage.mjs";
import * as file from "../lib/file.mjs";
import * as msg from "../lib/msg_script.mjs";
import * as lzss from "../lib/lzss.mjs";
import * as file_table from "../lib/file_table.mjs";

export const command = [`insert_f35 file`];
export const desc = "Insert scripts to f35";
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
  console.log(argv);
  let file = JSON.parse(fs.readFileSync(argv.file));

  if (file.file != 35) {
    console.error(`Unexpected file ${file.file}`);
    return;
  }
  let files = file.strings.map((a) => {
    let len = msg.calculate_dialog_length(a);
    let buff = Buffer.alloc(len);
    msg.compile_msg(a, buff, 0);
    let res = lzss.compress(buff, 0xc);
    res.writeUInt32LE(0x201, 0);
    res.writeUInt32LE(res.byteLength, 4);
    res.writeUInt32LE(len, 8);
    return res;
  }); //f32 seems to be persona tables

  let arch = archive.build_archive(files, file.file);
  //   fs.writeFileSync(`35.bin`, arch);
  await cdimage.write_file(cd, file.file, arch);

  let to_patch = [
    [32, 0x35bc],
    [33, 0x2d8c],
    [39, 0x24b74],
  ];

  for (let i = 0; i < to_patch.length; i++) {
    let table = await cdimage.read_file(cd, to_patch[i][0]);
    let table_ptr = to_patch[i][1];
    file_table.write(table, table_ptr, files);
    await cdimage.write_file(cd, to_patch[i][0], table);
  }
};
