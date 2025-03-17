module.exports = {
    apps: [
      {
        name: 'backend',
        script: 'dist/main.js',
        watch: false,
        cwd: 'api',
        env_file: '.env',
      }
    ]
  };
  