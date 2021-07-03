
import * as cdimage from "../lib/cdimage.mjs";

export const command = [`apply_nanjo_patch`];
export const desc =
  "Makes nanjo go by his last name";
export const builder = {};
export const handler = async (argv) => {
  let start = argv.start;
  let end = argv.end ?? argv.start;
  let cd = await cdimage.init();
  {
    let offsets = [0x90BC];
    let file = await cdimage.read_file(cd, 684);
    offsets.forEach(a=>file[a] = 0x2);
    await cdimage.write_file(cd, 684, file);
  }
  {
    let offsets = [0x46ca2];
    let file = await cdimage.read_file(cd, 789);
    offsets.forEach(a=>file[a] = 0x2);
    await cdimage.write_file(cd, 789, file);
  }
  


//   await cd.img.write(patch_data, 0, 1, 0x1c6e0);

  await cdimage.close(cd);
  console.log("Patch applied successfully");
};
