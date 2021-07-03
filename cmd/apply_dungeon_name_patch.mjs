import * as cdimage from "../lib/cdimage.mjs";
import * as archive from "../lib/archive.mjs";
import * as filetype from "../lib/file.mjs";
import * as lzss from "../lib/lzss.mjs";

export const command = [`apply_dungeon_name_patch`];
export const desc = "Fix Seventh HS and Sky Museum dungeon/save names";
export const builder = {};
export const handler = async (argv) => {
  let cd = await cdimage.init();
  let map_data = [
    [741, 0, "Sevens HS"],
    [786, 0, "Sevens HS"],
    [744, 0, "Aero. Museum"],
  ];
  for (let i = 0; i < map_data.length; i++) {
    let md = map_data[i];

    let file = await cdimage.read_file(cd, md[0]);
    let files = archive.extract_files(file, md[0]);
    let buff = filetype.parseFile(files[md[1]]).data;
    let ptr = 0;
    let str = md[2];
    console.log(ptr, str);
    str.split("").forEach((a) => (buff[ptr++] = a.charCodeAt(0)));
    buff[ptr++] = 0;
    let comp = lzss.compress(buff, 0xc);
    comp.writeUInt32LE(0x201, 0);
    comp.writeUInt32LE(comp.byteLength, 4);
    comp.writeUInt32LE(buff.byteLength, 8);
    console.log(comp);
    files[md[1]] = comp;
    await cdimage.write_file(cd, md[0], archive.build_archive(files, md[0]));
  }

  //   await cd.img.write(patch_data, 0, 1, 0x1c6e0);

  await cdimage.close(cd);
  console.log("Patch applied successfully");
};
