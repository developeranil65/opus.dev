import "./workers/vote.worker";

process.on('SIGTERM', async () => {
  console.log('Worker shutting down...');
  process.exit(0);
});