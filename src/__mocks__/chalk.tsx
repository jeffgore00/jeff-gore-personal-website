export default {
  bgCyan: {
    black: (msg: string): string =>
      `<black text with cyan background>${msg}</black text with cyan background>`,
  },
  bgMagenta: {
    black: (msg: string): string =>
      `<black text with magenta background>${msg}</black text with magenta background>`,
  },
  bgYellow: {
    black: (msg: string): string =>
      `<black text with yellow background>${msg}</black text with yellow background>`,
  },
  bgRed: {
    black: (msg: string): string =>
      `<black text with red background>${msg}</black text with red background>`,
  },
  cyan: (msg: string): string => `<cyan text>${msg}</cyan text>`,
  magenta: (msg: string): string => `<magenta text>${msg}</magenta text>`,
  yellow: (msg: string): string => `<yellow text>${msg}</yellow text>`,
  red: (msg: string): string => `<red text>${msg}</red text>`,
  gray: (msg: string): string => `<gray text>${msg}</gray text>`,
  dim: (msg: string): string => `<dimmed text>${msg}</dimmed text>`,
};
