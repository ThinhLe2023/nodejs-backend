import cluster from 'cluster';
import os from 'os';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const numCPUs = os.cpus().length;

console.log('Total CPU cores:', numCPUs);
console.log('Primary process PID:', process.pid);
cluster.setupPrimary({
    exec: __dirname + '/appWithCluster.js'
});

for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
}

cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker PID=${worker.process.pid} exited. Code: ${code}, Signal: ${signal}`);
    console.log('Starting a new worker...');
    cluster.fork();
});