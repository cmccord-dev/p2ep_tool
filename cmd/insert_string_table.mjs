import * as fs from "fs";
import * as archive from "../lib/archive.mjs";
import * as cdimage from "../lib/cdimage.mjs";
import * as file from "../lib/file.mjs";
import * as msg from "../lib/msg_script.mjs";
import * as pt from "../lib/locale/pt.mjs";

let locales = {
  en: { char_map: {} },
  pt,
};

export const command = [`insert_string_table [files..]`];
export const desc = "Reinsert string table";
export const builder = {
  files: {
    demandOption: true,
    type: "array",
  },
  lang: {
    default: "en",
  },
};

let compare_strings = (a, b) => {
  if (a.length != b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
};

export const handler = async (argv) => {
  console.log(argv.files);
  let cd = await cdimage.init();
  for (let i = 0; i < argv.files.length; i++) {
    let name = argv.files[i];
    console.log(`Processing ${name}`);
    let file = JSON.parse(fs.readFileSync(name));

    if (locales[argv.lang]) {
      let locale = locales[argv.lang];
      for (let j = 0; j < file.strings.length; j++) {
        for (let i = 0; i < file.strings[j].length; i++) {
          if (typeof file.strings[j][i] === "string") {
            file.strings[j][i] = file.strings[j][i]
              .split("")
              .map((a) => {
                if (locale.char_map[a]) {
                  return locale.char_map[a];
                }
                return a;
              })
              .join("");
          }
        }
      }
    }

    let buff = Buffer.alloc(file.max_len);
    let ind_ptr = 4;
    let str_ptr = file.strings.length * 4 + 4;
    buff.writeUInt32LE(file.strings.length, 0);

    let map = {};

    file.strings.forEach((str) => {
      if (map[str]) {
        // console.log(map[str]);
        buff.writeUInt32LE(map[str], ind_ptr);
      } else {
        buff.writeUInt32LE(str_ptr, ind_ptr);
        map[str] = str_ptr;
        str_ptr += msg.compile_msg(str, buff, str_ptr);
      }
      ind_ptr += 4;
    });
    // console.log(buff);
    console.log(file.max_len - str_ptr);
    //continue;

    let file_buff = await cdimage.read_file(cd, file.file);
    let files = archive.extract_files(file_buff);
    //console.log(files[0]);
    //console.log(buff);

    buff.copy(files[file.file_num], file.offset, 0, str_ptr);
    //   files[file.file_num]. = buff;
    let res = archive.build_archive(files, file.file);
    //console.log(res);
    //console.log(res.slice(file.offset - 20));
    await cdimage.write_file(cd, file.file, res);
    // fs.writeFileSync(`${file.file}.bin`, res);
  }

  //   if (!fs.existsSync(argv.out)) fs.mkdirSync(argv.out);
  //   for (let i = start; i <= end; i++) {
  //     console.log(`${i}`);
  //     // if (!fs.existsSync(`${argv.out}/${i}/`)) fs.mkdirSync(`${argv.out}/${i}/`);
  //     let file_buff = await cdimage.read_file(cd, i);

  //     let files = archive.extract_files(file_buff);
  //     files.forEach((f, o) => {
  //       console.log(f);
  //       let res = search_for_string_table(f);
  //       if (res) {
  //         res.forEach((t, k) => {
  //           t.file = i;
  //           t.file_num = o;
  //           let len = (t.strings.length + 1) * 4;
  //           t.strings.forEach(
  //             (line) => (len += msg.calculate_dialog_length(line))
  //           );
  //           t.max_len = len;
  //           fs.writeFileSync(
  //             `${argv.out}/${i > 0 ? i : "SLUS"}_${o}_${k}.json`,
  //             JSON.stringify(t, null, 4)
  //           );
  //         });
  //       }
  //       //   let res = file.parseFile(f);
  //       //   if (res) fs.writeFileSync(`${argv.out}/${i}_${o}.${res.type}`, res.data);
  //     });
  //   }
  cdimage.close(cd);
};
