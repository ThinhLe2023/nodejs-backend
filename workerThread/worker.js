import { parentPort } from "worker_threads";

// Simulate a CPU-intensive task
let total = 0;
try {
  for (let i = 0; i < 1e9; i++) {
    total += i;
  }
} catch (error) {
  console.error("Error in worker thread:", error);
  parentPort.error({ error: error.message });
  process.exit(1); // Exit the worker thread with an error code
}
// Send the result back to the parent thread
parentPort.postMessage({ total });
