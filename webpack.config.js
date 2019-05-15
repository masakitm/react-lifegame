module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
		contentBase: './dist',
		port: 3008
	},
	resolve: {
		extensions: ['*', '.js', '.jsx']
	}
};