import * as fs from "fs";
import * as archive from "../lib/archive.mjs";
import * as cdimage from "../lib/cdimage.mjs";
import * as file_table from "../lib/file_table.mjs";
export const command = [`locate_file_tables start end`];
export const desc = "Testing archive code";
export const builder = {
  start: {
    //   default: 0,
    //   max: 880,
    number: true,
    demandOption: true,
  },
  end: {
    //   default: 880,
    number: true,
    demandOption: false,
  },
};

function check(buff, ptr, arch) {
  let fptr = 0;
  let group = [];
  //   let debug = ptr == 0x35bc;
  while (fptr < arch.length) {
    let v = buff.readUInt32LE(ptr);
    ptr += 4;
    // if (debug) console.log(v.toString(16), arch[fptr]);
    if ((v & 0x1ffffff) != arch[fptr]) return false;
    fptr += v >> 0x19;
    group.push(v >> 0x19);
    if (v >> 0x19 == 0) return false;
  }
  if (fptr != arch.length) return false;
  if (group.length == 1) return false;
  return group;
}
export const handler = async (argv) => {
  let start = argv.start ?? argv.file;
  let end = argv.end ?? argv.file;
  let cd = await cdimage.init();
  let all_files = [];
  let data = {};
  let exes = [];

  for (let i = start; i <= end; i++) {
    console.log(`${i}`);
    let file_buff = await cdimage.read_file(cd, i);
    // fs.writeFileSync(`${i}.bin`, file_buff);
    let files = archive.extract_file_offsets(file_buff);
    if (files.length == 1) exes.push(i);
    if (files.length < 3) continue;

    all_files.push({ arch: files, f: i });
  }
  //   console.log(all_files);
  //   for (let i = 0; i < all_files.length; i++) {
  //     for (let j = i + 1; j < all_files.length; j++) {
  //       if (all_files[i].length < all_files[j].length) {
  //         if (all_files[i] == all_files[j].slice(0, all_files[i].length)) {
  //           console.log(i, j);
  //         }
  //       }
  //       if (all_files[i] == all_files[j]) console.log(i, j);
  //     }
  //   }
  //   return;
  for (let k = 0; k < exes.length; k++) {
    let i = exes[k];
    //   }
    //   for (let i = -1; i < 865; i++) {
    let file_buff = await cdimage.read_file(cd, i);
    let ptr = 0;
    while (ptr < file_buff.byteLength - 3) {
      let val = file_buff.readUInt32LE(ptr);
      if ((val & 0x1ffffff) == 0) {
        if (val >> 0x19) {
          //   let next = 0;
          for (let j = 0; j < all_files.length; j++) {
            let res = check(file_buff, ptr, all_files[j].arch);
            //   if(i == 32 && ptr == 0x35bc) {
            //       console.log(res);
            //   }
            if (res) {
              //   console.log(all_files[j].f, i, ptr.toString(16));
              if (!data[all_files[j].f]) data[all_files[j].f] = [];
              data[all_files[j].f].push([i, ptr.toString(16)]);
              //   ptr += res.length * 4;
              //   if (!next || res.length < next) next = res.length;
            }
          }
        }
      }
      ptr += 4;
    }
  }
  //   console.log(data);
  fs.writeFileSync("file_tables.json", JSON.stringify(data, null, 2));
  //   console.log(all_files);
  // console.log(files);
  // console.log(file_buff.byteLength & 0x7ff);
  // let reconstituted = archive.build_archive(files, i);
  // console.log(
  //   file_buff.byteLength.toString(16),
  //   reconstituted.byteLength.toString(16)
  // );
  // // console.log(reconstituted.compare(file_buff));
  // if (file_buff.length == reconstituted.length) {
  //   console.assert(reconstituted.compare(file_buff) == 0, `${i}`);
  // } else {
  //   console.assert(
  //     reconstituted.length < file_buff.length,
  //     `Reconstituted larger ${i}`
  //   );
  //   console.assert(reconstituted.compare(file_buff, 0, reconstituted.length) == 0, `${i}`);
  //   let len = reconstituted.length;
  //   for (let j = len; j < file_buff.length; j++) {
  //     if (file_buff[j]) {
  //       console.assert(false,
  //         `Nonzero data at end of file not present in reconstruction ${i}`
  //       );
  //       break;
  //     }
  //   }
  // }
  //}
  cdimage.close(cd);
};
