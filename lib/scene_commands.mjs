export const CMD_RETURN = 0x0e;
export const CMD_DIAG = 0x13;
export const CMD_BRANCH = 0x12;
export const CMD_CALL = 0x0d;
export const CMD_LOAD_SCENE = 0x12b;

const CMD_A8 = 0xa8; //no parameters, probably init??
const CMD_B9 = 0xb9; //something graphics related, has 5 parameters
export const commands = {
  [CMD_RETURN]: {
    opcode: CMD_RETURN,
    name: "ret",
    expected_parameters: 1,
  },
  [CMD_DIAG]: {
    opcode: CMD_DIAG,
    name: "diag",
    expected_parameters: 1,
  },
  [CMD_BRANCH]: {
    opcode: CMD_BRANCH,
    name: "jmp",
    expected_parameters: 1,
  },
  [CMD_CALL]: {
    opcode: CMD_CALL,
    name: "jal",
    expected_parameters: 1,
  },
  [CMD_LOAD_SCENE]: {
    opcode: CMD_LOAD_SCENE,
    name: "load_scene",
    expected_parameters: 1,
  },
};

//op xx for some commands? if xx is not 3 something happens?