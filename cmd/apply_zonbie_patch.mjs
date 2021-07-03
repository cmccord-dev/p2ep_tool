
import * as cdimage from "../lib/cdimage.mjs";

export const command = [`apply_zonbie_patch`];
export const desc =
  "Changes Zonbie to Zombie";
export const builder = {};
export const handler = async (argv) => {
  let cd = await cdimage.init();

  let offsets = [0x57082];
  let file = await cdimage.read_file(cd, -1);
  offsets.forEach(a=>file[a+0x800] = 'm'.charCodeAt(0));
  await cdimage.write_file(cd, -1, file);


//   await cd.img.write(patch_data, 0, 1, 0x1c6e0);

  await cdimage.close(cd);
  console.log("Patch applied successfully");
};
