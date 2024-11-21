import RSp from 'rsp-libjscript';

const rsp = new RSp();

function runScript(scriptPath) {

  const log = rsp.exec(`${scriptPath}`).value;
  
  console.log(log, log);

}

export { runScript };
