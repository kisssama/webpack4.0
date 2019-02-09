const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const resolve = dir => path.join(__dirname, '..', dir)
//const {join:pathJoin}  = {join:fun} 所以pathJoin就是哪个方法了 ；
//path.join将该路径片段进行拼接   path.resolvee将以/开始的路径片段作为根目录，在此之前的路径将会被丢弃，就像是在terminal中使用cd命令一样。并且返回绝对路径
//'.'指向执行文件的目录  __dirname 总是指向被执行 js 文件的绝对路径
module.exports = (env, argv) => ({
	entry:path.resolve('src/main.js'),
	output: {
		filename: '[name].[hash:5].js',// 输出文件名字的格式([name]对应entry的键名(app))
		path: path.resolve('dist'),
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
					argv.mode === 'development' ? 'vue-style-loader' : MiniCssExtractPlugin.loader, // 使用vue-style-loader直接插入到style标签中
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
			template:'index.html',// 指定模板html文件
			filename: 'index.html' // 输出的html文件名称
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		new CleanWebpackPlugin(['dist'], {
      root: path.join(__dirname, '../')
    })
	]
})