let acute = "{";
let circonflex = "|";
let grave = "}";
let tilde = String.fromCharCode(0x7f);
let cedilla = ";";

let A = '<';
let E = '=';
let I = ">";
let O = "o";
let U = "$";

export const char_map = {
  á: acute + "a",
  é: acute + "e",
  í: acute + "i",
  ó: acute + "o",
  ú: acute + "u",
  â: circonflex + "a",
  ê: circonflex + "e",
  ô: circonflex + "o",
  ã: tilde + "a",
  õ: tilde + "o",
  à: grave + "a",
  è: grave + "e",
  ì: grave + "i",
  ò: grave + "o",
  ù: grave + "u",
  ç: cedilla + "c",
  Á: acute + A,
  É: acute + E,
  Í: acute + I,
  Ó: acute + O,
  Ú: acute + U,
  Â: circonflex + A,
  Ê: circonflex + E,
  Ô: circonflex + O,
  Ã: tilde + A,
  Õ: tilde + O,
  À: grave + A,
  È: grave + E,
  Ì: grave + I,
  Ò: grave + O,
  Ù: grave + U,
  Ç: cedilla + "C",
};

export const patch = [
  [acute, 3],
  [grave, 3],
  [cedilla, 3],
  [circonflex, 3],
  [tilde, 3],
  ["i", 2],
  [A, 5],
  [E, 5],
  [I, 7],
  [U, 0],
  //type 3, set to 0 width 0 offset?
  [3 * 2, 0],
  [3 * 2 + 1, 0],
];

//overwrite 3 with a zero width character

//0 00 07
//1 00 08
//2 01 03
//3 01 04
//4 01 05
//5 01 06
//6 02 02
//7 02 03
//8 02 04
//9 02 05
//a 03 01
//b 03 02
//c 03 04
//d 04 02
//e 04 03
//f 00 04
