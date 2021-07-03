import * as cdimage from "../lib/cdimage.mjs";

export const command = [`apply_font_patch`];
export const desc =
  "Patches the text rendering algorithm to correctly vertically align lower case ijpqy";
export const builder = {};
export const handler = async (argv) => {
  let start = argv.start;
  let end = argv.end ?? argv.start;
  let cd = await cdimage.init();
  let patch_data = Buffer.alloc(1, 2);

  // let offsets = [0x0ac98, 0x0c654];
  let file = await cdimage.read_file(cd, -1);
  //offsets.forEach(a=>file[a+0x800] = 0x2);
  let patches = [
    //first function
    [0x4d0, 0x8001ac94], //patch switch table
    [0xac84, 0x8fb1001c], //lw s1, 0x1c(sp)
    [0xac90, 0x26310001], //addiu s1, s1, 1
    [0xac98, 0x26310001], //addiu s1, s1, 1
    //second function
    [0x520, 0x8001c658], //patch switch table
    [0xc650, 0x24020001],
    [0xc654, 0x24020002],
  ];

  // file.writeUInt32LE(0x8001ac94, 0x4d0 + 0x800);
  // file.writeUInt32LE(0x8fb1001c, 0xac84 + 0x800);
  // file.writeUInt32LE(0x26310001, 0xac90 + 0x800);
  // file.writeUInt32LE(0x26310001, 0xac98 + 0x800);
  patches.forEach((a) => file.writeUInt32LE(a[1], a[0] + 0x800));

  await cdimage.write_file(cd, -1, file);

  // 800104d0 -> 94ac0180
  // 8001ac84 -> 1c00b18f
  // 8001ac90 -> 01003126
  // 8001ac98 -> 01003126

  //   await cd.img.write(patch_data, 0, 1, 0x1c6e0);

  await cdimage.close(cd);
  console.log("Patch applied successfully");
};
