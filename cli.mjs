#!/usr/bin/env node

import inquirer from 'inquirer';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve, join } from 'path';
import { listScripts, listSubprojects } from './utils/fileUtils.js';
import { runScript } from './utils/scriptRunner.js';

const rootDir = resolve(process.env.HOME, 'Space/development/rsp');
const mainScriptDir = join(rootDir, 'script');

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('-h') || args.includes('--help')) {
    console.log(`
      - Uso (projeto raiz):

        rsp.dev.sysProjMan || -h || --help
          Exibe ajuda

        rsp.dev.sysProjMan list
          Lista subprojetos

        rsp.dev.sysProjMan code
          Abre o projeto raiz no "code $rootDir"

        rsp.dev.sysProjMan script list
          Lista os scripts do projeto raiz

        rsp.dev.sysProjMan script run <scriptIndexOrName>
          Executa um script no diretório de scripts principal

      - Uso (subprojetos):    

        rsp.dev.sysProjMan <project_name_or_index> script list
          Lista os scripts de um subprojeto

        rsp.dev.sysProjMan <project_name_or_index> script run <scriptIndexOrName>
          Executa um script de um subprojeto

        rsp.dev.sysProjMan <project_name_or_index> code
          Abre o subprojeto no "code $rootDir/<project_name_or_index>"
    `);
    return;
  }

  if (args.length === 0) {
    // Comando para listar subprojetos
    const subprojects = listSubprojects(rootDir);
    subprojects.forEach((subproject, index) => {
      console.log(`${index + 1}. ${subproject}`);
    });
    return;
  }

  if (args[0] === 'code') {
    // Abre o projeto raiz no VS Code
    execSync(`code ${rootDir}`, { stdio: 'inherit' });
    return;
  }

  if (args[0] === 'script') {
    // Comandos para o projeto raiz
    if (args[1] === 'list') {
      const scripts = listScripts(mainScriptDir);
      scripts.forEach((script, index) => {
        console.log(`${index + 1}. ${script}`);
      });
      return;
    }

    if (args[1] === 'run') {
      const input = args[2];
      const scripts = listScripts(mainScriptDir);

      let scriptPath;
      if (isNaN(input)) {
        scriptPath = join(mainScriptDir, input);
      } else {
        const scriptIndex = parseInt(input, 10) - 1;
        if (scriptIndex >= 0 && scriptIndex < scripts.length) {
          scriptPath = join(mainScriptDir, scripts[scriptIndex]);
        }
      }

      if (scriptPath && existsSync(scriptPath)) {
        runScript(scriptPath);
      } else {
        console.error('Script não encontrado.');
      }
      return;
    }
  } else if (args[0] === 'list') {
    // Comando para listar subprojetos
    const subprojects = listSubprojects(rootDir);
    subprojects.forEach((subproject, index) => {
      console.log(`${index + 1}. ${subproject}`);
    });
    return;
  } else {
    // Comandos para subprojetos
    const subprojects = listSubprojects(rootDir);
    const projectIndex = isNaN(args[0]) ? -1 : parseInt(args[0], 10) - 1;
    let projectPath;

    if (projectIndex >= 0 && projectIndex < subprojects.length) {
      projectPath = join(rootDir, subprojects[projectIndex], 'script');
    } else {
      const projectName = args[0];
      if (subprojects.includes(projectName)) {
        projectPath = join(rootDir, projectName, 'script');
      }
    }

    if (projectPath && existsSync(projectPath)) {
      if (args[1] === 'script' && args[2] === 'list') {
        const scripts = listScripts(projectPath);
        scripts.forEach((script, index) => {
          console.log(`${index + 1}. ${script}`);
        });
        return;
      }

      if (args[1] === 'script' && args[2] === 'run') {
        const input = args[3];
        const scripts = listScripts(projectPath);

        let scriptPath;
        if (isNaN(input)) {
          scriptPath = join(projectPath, input);
        } else {
          const scriptIndex = parseInt(input, 10) - 1;
          if (scriptIndex >= 0 && scriptIndex < scripts.length) {
            scriptPath = join(projectPath, scripts[scriptIndex]);
          }
        }

        if (scriptPath && existsSync(scriptPath)) {
          runScript(scriptPath);
        } else {
          console.error('Script não encontrado.');
        }
        return;
      }

      if (args[1] === 'code') {
        // Abre o subprojeto no VS Code
        execSync(`code ${join(rootDir, args[0])}`, { stdio: 'inherit' });
        return;
      }
    } else {
      console.error('Subprojeto não encontrado.');
    }
  }
}

main();
