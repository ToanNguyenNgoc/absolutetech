module.exports = {
    apps: [
      {
        name: 'backend',
        script: 'api/dist/main.js',
        watch: false,
        cwd: 'api',
        env: {
          NODE_ENV: 'production',
          MONGODB_URI: 'mongodb+srv://nguyenanhduyit01:qJDIwW3sbClVOfiR@user-logs.fird3.mongodb.net/?retryWrites=true&w=majority&appName=user-logs',
          JWT_SECRET: 'abcxyz123456',
          PORT: 3333,
        }
      }
    ]
  };
  