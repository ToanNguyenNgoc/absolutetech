module.exports = {
    apps: [
      {
        name: 'backend',
        script: 'api/dist/main.js',
        watch: false,
        cwd: 'api',
        env_file: '.env',
      }
    ]
  };
  