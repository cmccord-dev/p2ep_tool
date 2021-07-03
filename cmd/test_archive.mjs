import * as fs from "fs";
import * as archive from "../lib/archive.mjs";
import * as cdimage from "../lib/cdimage.mjs";

export const command = [`test_archive start end`];
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
export const handler = async (argv) => {
  let start = argv.start ?? argv.file;
  let end = argv.end ?? argv.file;
  let cd = await cdimage.init();

  for (let i = start; i <= end; i++) {
    console.log(`${i}`);
    let file_buff = await cdimage.read_file(cd, i);
    // fs.writeFileSync(`${i}.bin`, file_buff);
    let files = archive.extract_files(file_buff);
    // console.log(files);
    // console.log(file_buff.byteLength & 0x7ff);
    let reconstituted = archive.build_archive(files, i);
    console.log(
      file_buff.byteLength.toString(16),
      reconstituted.byteLength.toString(16)
    );
    // console.log(reconstituted.compare(file_buff));
    if (file_buff.length == reconstituted.length) {
      console.assert(reconstituted.compare(file_buff) == 0, `${i}`);
    } else {
      console.assert(
        reconstituted.length < file_buff.length,
        `Reconstituted larger ${i}`
      );
      console.assert(reconstituted.compare(file_buff, 0, reconstituted.length) == 0, `${i}`);
      let len = reconstituted.length;
      for (let j = len; j < file_buff.length; j++) {
        if (file_buff[j]) {
          console.assert(false,
            `Nonzero data at end of file not present in reconstruction ${i}`
          );
          break;
        }
      }
    }
  }
  cdimage.close(cd);
};
