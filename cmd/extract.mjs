export const command = `extract <name> [names..]`;
export const desc = "I'm just learning";
export const builder = {};
export const handler = (argv) => {
  console.log(`${argv.name} ${argv.names.join(" ")}`);
};
