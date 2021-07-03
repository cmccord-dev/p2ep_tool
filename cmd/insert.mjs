import * as fs from "fs";
import * as archive from "../lib/archive.mjs";
import * as cdimage from "../lib/cdimage.mjs";
import * as file from "../lib/file.mjs";
import * as msg from "../lib/msg_script.mjs";

export const command = [`insert_battle_strings [files..]`];
export const desc = "Reinsert battle strings";
export const builder = {
  files: {
    demandOption: true,
    type: "array",
  },
};

export const handler = async (argv) => {
  console.log(argv.files);
  let cd = await cdimage.init();
  for (let i = 0; i < argv.files.length; i++) {
    let name = argv.files[i];
    console.log(`Processing ${name}`);
    let file = JSON.parse(fs.readFileSync(name));

    let file_buff = await cdimage.read_file(cd, file.file);
    let files = archive.extract_files(file_buff);

    let buff = files[file.file_num].slice(8);
    console.log(buff);
    console.log(name);
    if (
      files[file.file_num][0] != 1 &&
      files[file.file_num][1] != 0 &&
      files[file.file_num[8]] != 8
    ) {
      throw new Error();
    }
    let table_ptr = file.table_start;
    let str_ptr = file.string_ptr;
    let string_start = str_ptr;

    let map = {};
    file.strings.forEach((str) => {
      if ( map[str]) {
        buff.writeUInt16LE(map[str], table_ptr);
      } else {
        buff.writeUInt16LE(str_ptr - string_start, table_ptr);
        map[str] = str_ptr - string_start;
        str_ptr += msg.compile_msg(str, buff, str_ptr);
      }
      table_ptr += 2;
    });
    // console.log(buff);
    console.log(file.max_len - str_ptr);
    //continue;

    //    buff.copy(files[file.file_num], file.offset);
    //   files[file.file_num]. = buff;
    let res = archive.build_archive(files, file.file);
    //console.log(res);
    await cdimage.write_file(cd, file.file, res);
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
