export const CMD_RET = 0x3;
export const CMD_NEWLINE = 0x1;
export const CMD_END_PAGE = 0x2;
export const CMD_COLOR = 0x2e;
export const CMD_WAIT = 0x06; //wait for input

//7 followed by 6 allows for the button prompt.  having multiple inside a dialog just breaks?
//possibly indicates the next button prompt should continue the main script?
//removing it seems to have no affect?
export const CMD_UNK7 = 0x07;
export const CMD_TEXT = 0x36;
export const CMD_CHOICE = 0x08;
export const CMD_CHOICE_END = 0x09;
export const CMD_TATSUYA = 0x21;
export const CMD_TATSUYA_SURNAME = 0x20;
export const CMD_KEYITEM = 0x0e;
export const CMD_PAUSE = 0x05; //pretty sure
export const CMD_ITEM = 0x35;

export const commands = {
  [CMD_RET]: {
    cmd: CMD_RET,
    alias: "ret",
    len: 1,
  },
  [CMD_NEWLINE]: {
    cmd: CMD_NEWLINE,
    alias: "nl",
    len: 1,
  },
  [CMD_END_PAGE]: {
    cmd: CMD_END_PAGE,
    alias: "page",
    len: 1,
  },
  [CMD_WAIT]: {
    cmd: CMD_WAIT,
    alias: "wait",
    len: 1,
  },
  [CMD_UNK7]: {
    cmd: CMD_UNK7,
    alias: CMD_UNK7,
    len: 1,
  },
  [CMD_TEXT]: {
    cmd: CMD_TEXT,
    alias: "text",
    len: 1,
  },
  [CMD_COLOR]: {
    cmd: CMD_COLOR,
    alias: "col",
    len: 2,
  },
  [CMD_CHOICE]: {
    cmd: CMD_CHOICE,
    alias: "option",
    len: 2,
  },
  [CMD_CHOICE_END]: {
    cmd: CMD_CHOICE_END,
    alias: "option_end",
    len: 1,
  },
  [CMD_TATSUYA]: {
    cmd: CMD_TATSUYA,
    alias: "tatsuya_firstname",
    len: 1,
  },
  [CMD_TATSUYA_SURNAME]: {
    cmd: CMD_TATSUYA_SURNAME,
    alias: "tatsuya_surname",
    len: 1,
  },
  [CMD_KEYITEM]: {
    cmd: CMD_KEYITEM,
    alias: "keyitem",
    len: 2,
  },
  [CMD_PAUSE]: {
    cmd: CMD_PAUSE,
    alias: "pause",
    len: 2,
  },
  [CMD_ITEM]: {
    cmd: CMD_ITEM,
    alias: "item",
    len: 2,
  },
};

//30/31 seem to just be spaces
//22 tatsu

export const emoji = {
  146: "heart",
  156: "music_note",
};

export const command_lookup = Object.values(commands).reduce((p, c) => {
  p[c.alias] = c;
  return p;
}, {});
