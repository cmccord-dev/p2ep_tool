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

  let groups = {};
  let group_files = [];
  for (let i = 0; i < argv.files.length; i++) {
    let name = argv.files[i];
    console.log(`Processing ${name}`);
    let file = JSON.parse(fs.readFileSync(name));
    if (!groups[file.file]) {
      groups[file.file] = [];
      group_files.push(file.file);
    }

    groups[file.file].push({ ...file, name });
  }

  let battle_exe = await cdimage.read_file(cd, 789);

  let battle_mapping = {
    863: { off: 0xf9b90 - 0xaf000, len: 257 },
    864: { off: 0xf9fa0 - 0xaf000, len: 257 },
    862: { off: 0xfa3bc - 0xaf000, len: 65 },
  };

  for (let i = 0; i < group_files.length; i++) {
    let process_files = groups[group_files[i]];
    let file_buff = await cdimage.read_file(cd, group_files[i]);
    let files = archive.extract_files(file_buff);
    for (let j = 0; j < process_files.length; j++) {
      let file = process_files[j];
      //   console.log(file);
      //   console.log(file.name);

      let orig_buff = files[file.file_num].slice(8);

      if (
        files[file.file_num][0] != 1 &&
        files[file.file_num][1] != 0 &&
        files[file.file_num][8] != 8
      ) {
        throw new Error();
      }
      let table_ptr = file.table_start + 8;
      let str_ptr = file.string_ptr + 8;
      let string_start = str_ptr;
      if (str_ptr < table_ptr) continue;
      let len = str_ptr;
      file.strings.forEach((a) => (len += msg.calculate_dialog_length(a)));
      let buff = Buffer.alloc(len);
      orig_buff.copy(buff, 8, 0, Math.min(orig_buff.byteLength, len - 8));
      buff.writeUInt32LE(files[file.file_num].readUInt32LE(0), 0);
      

      //   console.log(buff, orig_buff);
      let map = {};
      file.strings.forEach((str) => {
        if (map[str]) {
          buff.writeUInt16LE(map[str], table_ptr);
        } else {
          buff.writeUInt16LE(str_ptr - string_start, table_ptr);
          map[str] = str_ptr - string_start;
          str_ptr += msg.compile_msg(str, buff, str_ptr);
        }
        table_ptr += 2;
      });
      console.assert(
        table_ptr == string_start,
        `Table pointer ends at strings ${file.name} ${table_ptr} ${string_start}`
      );
      buff.writeUInt32LE(str_ptr, 4);
      // console.log(buff);
      //   console.log(file.max_len - str_ptr);
    //   console.assert(str_ptr == len, `len is end ${file.name} ${str_ptr} ${len}`);
      files[file.file_num] = buff.slice(0, str_ptr);
      //continue;

      //    buff.copy(files[file.file_num], file.offset);
      //   files[file.file_num]. = buff;
      //console.log(res);
    }
    if (battle_mapping[group_files[i]]) {
      let info = battle_mapping[group_files[i]];
      let exe_ptr = info.off;
      let len = info.len;
      let ptr = 0;
      let fptr = 0;
      while (len--) {
        let start = battle_exe.readUInt32LE(exe_ptr);
        let count = start >> 0x19;
        battle_exe.writeUInt32LE((count << 0x19) | ptr, exe_ptr);
        exe_ptr += 4;
        while (count-- > 0) {
          ptr += files[fptr++].byteLength;
          while (ptr & 0x3) ptr++;
          if (0x800 - (ptr & 0x7ff) < 0x10) {
            ptr += 0x800 - (ptr & 0x7ff);
          }
        }
      }
      console.assert(fptr == files.length);
    }
    let res = archive.build_archive(files, group_files[i]);
    // fs.writeFileSync(`${group_files[i]}.bin`, res);
    await cdimage.write_file(cd, group_files[i], res);
  }

  await cdimage.write_file(cd, 789, battle_exe);

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
