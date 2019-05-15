const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'source-map-loader',
          options: {
            enforce: 'pre',
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        }],
      },
      {
        test: /\.(ts|tsx)$/,
        use: [{
          loader: 'ts-loader',
        }],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.jsx', '.js', '.json'],
  },
  devServer: {
    contentBase: './dist',
    port: 3008,
  },
};
