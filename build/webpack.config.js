const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const resolve = dir => path.join(__dirname, '..', dir)

module.exports = (env, argv) => ({
	entry: resolve('src/main.js'),
	output: {
		filename: '[name].[hash:5].js',
		path: resolve('dist')
	},
	optimization: {
		splitChunks: {
			// 默认将node_modules中依赖打包到venders.js
			chunks: 'all'
		},
		// 将webpack运行时生成代码打包到runtime.js
		runtimeChunk: true
	},
	module: {
		rules: [{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.vue$/,
				use: 'vue-loader'
			},
			{
				test: /\.(css|scss)$/,
				use: [
					argv.mode === 'development' ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader',
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.(png|jpg|bmp|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'fonts/[name].[hash:7].[ext]'
				}
			}
		]
	},
	plugins: [
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			template: resolve('index.html')
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		new CleanWebpackPlugin(['dist'], {
      root: path.join(__dirname, '../')
    })
	]
})