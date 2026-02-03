import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';


function runWorker() {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js');
        worker.on('message', resolve);
        worker.on('error', reject);
    });
}

async function main() {
    console.log('Starting worker thread...');   
    const result = await runWorker();
    console.log('Worker result:', result);
}

main();
console.log('Main thread continues execution...');