const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const optimizeCss = require('optimize-css-assets-webpack-plugin');
const HappyPack = require('happypack')
const test  = require ('./api/test')
const resolve = dir => path.join(__dirname, '..', dir)
//const {join:pathJoin}  = {join:fun} 所以pathJoin就是哪个方法了 ；
//path.join将该路径片段进行拼接   path.resolvee将以/开始的路径片段作为根目录，在此之前的路径将会被丢弃，就像是在terminal中使用cd命令一样。并且返回绝对路径
//'.'指向执行文件的目录  __dirname 总是指向被执行 js 文件的绝对路径
module.exports = (env, argv) => ({
	entry: path.resolve('src/main.js'),
	output: {
		filename: '[name].[hash:5].js', // 输出文件名字的格式([name]对应entry的键名(app))
		path: path.resolve('dist'),
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
			// initial 入口chunk，对于异步导入的文件不处理
			// async 异步chunk，只对异步导入的文件处理（个人理解）
			// all 全部chunk（我反正选all，不甚理解）
			cacheGroups:{
				vendor: {   // 抽离第三方插件
					test: /node_modules/,   // 指定是node_modules下的第三方包
					chunks: 'initial',
					name: 'vendor',  // 打包后的文件名，任意命名    
					// 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
					priority: 10    
				},
				myVendor: { // 抽离自己写的公共代码，common这个名字可以随意起
					chunks: 'initial',
					name: 'myVendor',  // 任意命名
					minSize: 0,    // 只要超出0字节就生成一个新包
					minChunks:2// minChunks是指某个模块至少被2个入口文件依赖。
				}
			}
		},
		// 将webpack运行时生成代码打包到runtime.js
		runtimeChunk: true
	},
	resolve: {
		modules: [path.resolve('src'),
			path.resolve('node_modules')
		],
		extensions: ['.js', '.vue'],
		alias: {
			'@': resolve('src'), //@
			img: resolve('src/img'), //~img
		}
	},
	module: {
		rules: [{
				test: /\.js$/,
				use: ['happypack/loader?id=babel'],
				exclude: path.resolve(__dirname, 'node_modules'),
			},
			{
				test: /\.vue$/,
				use: 'vue-loader',
				exclude: path.resolve(__dirname, 'node_modules'),
			},
			{
				test: /\.(css|scss)$/,
				use: [
					argv.mode === 'development' ? 'vue-style-loader' : MiniCssExtractPlugin.loader, // 使用vue-style-loader直接插入到style标签中
					{
						loader: 'css-loader',
						options: {},
					},
					'sass-loader',
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true
						}
					}
				],
				exclude: path.resolve(__dirname, 'node_modules'),
			},
			{
				test: /\.(png|jpg|bmp|gif)(\?.*)?$/,
				use: [{
					loader: 'url-loader',
					options: {
						limit: 10000,
					}
				}, {
					loader: 'image-webpack-loader',
					options: {
						mozjpeg: { // 压缩 jpeg 的配置
							progressive: true,
							quality: 65
						},
						optipng: { // 使用 imagemin-optipng 压缩 png，enable: false 为关闭
							enabled: false,
						},
						pngquant: { // 使用 imagemin-pngquant 压缩 png
							quality: '65-90',
							speed: 4
						},
						gifsicle: { // 压缩 gif 的配置
							interlaced: false,
						},
						webp: { // 开启 webp，会把 jpg 和 png 图片压缩为 webp 格式
							quality: 75
						}
					}
				}],
				exclude: path.resolve(__dirname, 'node_modules'),
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'fonts/[name].[hash:7].[ext]'
				},
			}
		]
	},
	plugins: [
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			template: 'index.html', // 指定模板html文件
			filename: 'index.html', // 输出的html文件名称
			minify: { // 压缩 HTML 的配置
				minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
				minifyJS: true,// 压缩 HTML 中出现的 JS 代码
				removeComments: true,
				collapseWhitespace: true, //折叠空白区域 也就是压缩代码
				removeAttributeQuotes: true, //去除属性引用
			}
		}),
		new HappyPack({
      // 用唯一的标识符id来代表当前的HappyPack 处理一类特定的文件
      id: 'babel',
      // 如何处理.js文件，用法和Loader配置是一样的
			loaders: ['babel-loader'],
    }),
		//我们可以直接使用 imagemin 来做图片压缩，编写简单的命令即可。然后使用 pre-commit 这个类库来配置对应的命令，
		//使其在 git commit 的时候触发，并且将要提交的文件替换为压缩后的文件。
		//这样提交到代码仓库的图片就已经是压缩好的了，image-webpack-loader 也就没有必要了。
		new optimizeCss(),
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		new CleanWebpackPlugin(['dist'], {
			root: path.join(__dirname)
		})
	],
	  //测试mock数据
    devServer: {
			port: '1234',
			contentBase: path.join(__dirname, "../src"),
			host: "127.0.0.1",
			overlay: true, // 浏览器页面上显示错误,
			hot:true,//开启热功效
			before(app) {
					app.get('/api/test.json', function (req, res) { // 当访问 /some/path 路径时，返回自定义的 json 数据
							res.json({
									code: 200,
									message: test.okc
							})
					})
			}
	},
})