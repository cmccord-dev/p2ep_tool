#!/usr/bin/env node
import yargs from "yargs";

import { hideBin } from "yargs/helpers";

import * as test from "./cmd/test.mjs";
import * as test_archive from "./cmd/test_archive.mjs";
import * as extract_script from "./cmd/extract_script.mjs";
import * as extract_file from "./cmd/extract_file.mjs";
import * as apply_font_patch from "./cmd/apply_font_patch.mjs";
import * as apply_zonbie_patch from "./cmd/apply_zonbie_patch.mjs";
import * as apply_nanjo_patch from "./cmd/apply_nanjo_patch.mjs";
import * as extract_string_tables from "./cmd/extract_string_tables.mjs";
import * as insert_string_table from "./cmd/insert_string_table.mjs";
import * as insert_script from "./cmd/insert_script.mjs";
import * as test_script from "./cmd/test_script.mjs";
import * as extract_battle_strings from "./cmd/extract_battle_strings.mjs";
import * as insert_battle_strings from "./cmd/insert_battle_strings.mjs";
import * as apply_map_patch from "./cmd/apply_map_patch.mjs";
import * as apply_dungeon_name_patch from "./cmd/apply_dungeon_name_patch.mjs";
import * as extract_f35 from "./cmd/extract_f35.mjs";
import * as insert_f35 from "./cmd/insert_f35.mjs";
import * as locate_file_tables from "./cmd/locate_file_tables.mjs"

import * as extract from "./cmd/extract.mjs";
import * as insert_font from "./cmd/insert_font.mjs";

let commands = [
  test,
  test_archive,
  extract_script,
  extract_file,
  apply_font_patch,
  extract_string_tables,
  insert_string_table,
  apply_nanjo_patch,
  insert_script,
  test_script,
  extract_battle_strings,
  insert_battle_strings,
  apply_zonbie_patch,
  apply_map_patch,
  apply_dungeon_name_patch,
  extract_f35,
  insert_f35,
  extract,
  locate_file_tables,
  insert_font
];
yargs(hideBin(process.argv))
  .command(commands)
  .showHelpOnFail(true)
  .help("help", "Show usage instructions.")
  .demandCommand(1, "")
  .recommendCommands()
  .strict().argv;
