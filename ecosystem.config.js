module.exports = {
    apps: [
      {
        name: 'backend-api',
        script: 'dist/main.js',
        watch: false,
        cwd: 'api',
        env_file: '.env',
      }
    ]
  };
  