import fs from 'fs';
import { promisify } from 'util';

/* Purpose of these is mostly for unit tests. This allows us to safely spy on / mock file read/write  
operations without interfering with any other processes (such as Jest itself) that may require
these core Node functions. */

type WriteFileSync = (path: string, data: string) => void;
export const writeFileSync = <WriteFileSync>fs.writeFileSync.bind(null);

type ReadDirSync = (path: string) => string[];
export const readdirSync = <ReadDirSync>fs.readdirSync.bind(null);

type MakeDirSync = (
  path: string,
  { recursive }: { recursive: boolean },
) => void;
export const mkdirSync = <MakeDirSync>fs.mkdirSync.bind(null);

export const readFile = promisify(fs.readFile);
