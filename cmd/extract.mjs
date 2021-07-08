import * as fs from "fs";
import * as archive from "../lib/archive.mjs";
import * as cdimage from "../lib/cdimage.mjs";
import * as file from "../lib/file.mjs";
import * as scene_script from "../lib/scene_script.mjs";

export const command = `extract [type] [files..]`;
export const desc = "Extract data from files.";

export const builder = {
  out: {
    alias: "o",
    default: ".",
  },
  type: {
    alias: "t",
    default: "all",
    choices: ["all", "strings", "string_table", "battle_strings", "images"],
  },
  recursive: {
    type: "boolean",
    default: false,
  },
  raw: {
    type: "boolean",
    desc: "Extract in raw binary format",
    default: false,
  },
  decompress: {
    type: "boolean",
    desc: "decompresses binary",
    default: true,
  },
  iso: {
    type: "string",
  },
};

function extract_data(argv, buff) {
  return [];
}

export const handler = (argv) => {
  console.log(argv, "extract2");
  if (!fs.existsSync(argv.out)) {
    console.log(`Creating directory ${argv.out}`);
    fs.mkdirSync(argv.out, { recursive: true });
  }
  if (argv.iso) {
  } else {
    let files = argv.files;
    files.forEach((file) => {
      if (!fs.existsSync(file)) {
        console.error(`Unknown file ${file}`);
      }
      let res = extract_data(argv, fs.readFileSync(file));
      res.forEach((r) => {
        fs.writeFileSync(`${argv.out}/${r.filename}`, r.data);
      });
    });
  }
};
