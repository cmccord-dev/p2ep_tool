export const command = [`list filenum`, "list start end"];
export const desc = "I'm just learning";
export const builder = {};
export const handler = (argv) => {
  console.log(`${argv.name} ${argv.names.join(" ")}`);
};
