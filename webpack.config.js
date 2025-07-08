const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add html-loader to handle HTML files
  config.module.rules.push({
    test: /\.html$/,
    use: [
      {
        loader: 'html-loader',
        options: {
          // Minimize HTML
          minimize: true,
        },
      },
    ],
  });

  return config;
};
