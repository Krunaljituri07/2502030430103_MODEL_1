const { spawn } = require('child_process');
const path = require('path');

function startServer(folder) {
  const cwd = path.resolve(__dirname, '..', folder);
  const proc = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'server'], { cwd, stdio: 'inherit' });
  proc.on('close', (code) => console.log(`${folder} exited with code ${code}`));
  proc.on('error', (err) => console.error(`${folder} error:`, err));
  return proc;
}

console.log('Starting dreamdrive and SOLARA servers...');
const p1 = startServer('dreamdrive');
const p2 = startServer('SOLARA');

process.on('SIGINT', () => {
  console.log('Stopping servers...');
  p1.kill('SIGINT');
  p2.kill('SIGINT');
  process.exit();
});
