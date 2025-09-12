module.exports = {
  apps: [
    {
      name: 'backend-dev',
      script: 'server.js',
      cwd: './',
      watch: true,
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'frontend-dev',
      script: 'npm',
      args: 'run dev',
      cwd: './frontend',
      watch: true,
      env: {
        NODE_ENV: 'development'
      }
    }
  ]
};
