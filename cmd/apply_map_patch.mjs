import * as cdimage from "../lib/cdimage.mjs";
import * as archive from "../lib/archive.mjs";
import { extract_files } from "../lib/archive.mjs";

export const command = [`apply_map_patch`];
export const desc = "Fix Araya Shrine, Seventh HS and Sky Museum";
export const builder = {};
export const handler = async (argv) => {
  let cd = await cdimage.init();
  let map_data = [
    [717, 17, 0x456, "Aerospace Museum"],
    [713, 16, 0x3de, "Alaya Shrine"],
    [713, 16, 0x406, "Seven Sisters HS"],
    [713, 15, 0x3e6, "Alaya Shrine"],
    [713, 15, 0x40e, "Seven Sisters HS"],
  ];
  for (let i = 0; i < map_data.length; i++) {
    let md = map_data[i];

    let file = await cdimage.read_file(cd, md[0]);
    let files = archive.extract_files(file, md[0]);
    let buff = files[md[1]];
    let ptr = md[2];
    let str = md[3];
    console.log(ptr, str);
    str.split("").forEach((a) => (buff[ptr++] = a.charCodeAt(0)));
    buff[ptr++] = 0;
    files[md[1]] = buff;
    await cdimage.write_file(cd, md[0], archive.build_archive(files, md[0]));
  }

  //   await cd.img.write(patch_data, 0, 1, 0x1c6e0);

  await cdimage.close(cd);
  console.log("Patch applied successfully");
};
