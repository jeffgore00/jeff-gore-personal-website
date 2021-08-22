import fs from 'fs';

type WriteFileSync = (
  path: number | fs.PathLike,
  data: string | NodeJS.ArrayBufferView,
  options?: fs.WriteFileOptions,
) => void;

export const writeFileSync = <WriteFileSync>fs.writeFileSync.bind(null);
