module.exports = {
  apps: [
    {
      name: "node-api",
      script: "./dist/server.js",
      instances: "max",           // Use all available CPU cores (Cluster Mode)
      exec_mode: "cluster",       // Enables load balancing across CPUs
      max_memory_restart: "400M", // Auto-restart if memory exceeds 400MB
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      }
    },
    {
      name: "node-worker",
      script: "./dist/workers/email.worker.js",
      instances: 1,               // 1 worker is fine for small/medium load
      exec_mode: "fork",          // Workers should stay in fork mode
      max_memory_restart: "300M", // Worker usually needs less memory
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }
  ]
};
