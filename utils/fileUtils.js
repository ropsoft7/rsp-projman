import { readdirSync, lstatSync } from 'fs';
import { join } from 'path';

function listScripts(directory) {
  try {
    const files = readdirSync(directory);
    return files;
  } catch (err) {
    console.error(`Erro ao listar scripts: ${err.message}`);
    return [];
  }
}

function listSubprojects(rootDir) {
  try {
    return readdirSync(rootDir)
      .filter(item => lstatSync(join(rootDir, item)).isDirectory() && item.startsWith('rsp-'));
  } catch (err) {
    console.error(`Erro ao listar subprojetos: ${err.message}`);
    return [];
  }
}

export { listScripts, listSubprojects };
