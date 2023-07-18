module.exports = {
  apps: [
    {
      name: 'nestjs-gpt',
      script: 'dist/main.js',
      env: {
        PORT: 3334,
        NODE_ENV: 'production',
      },
    },
  ],
};
