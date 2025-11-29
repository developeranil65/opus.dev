import "./workers/vote.worker.js";

process.on('SIGTERM', async () => {
  console.log('Worker shutting down...');
  process.exit(0);
});