import {parentPort } from 'worker_threads';

// Simulate a CPU-intensive task
let total = 0;
for (let i = 0; i < 1e9; i++) {
  total += i;
}   
// Send the result back to the parent thread
parentPort.postMessage({ total });