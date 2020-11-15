
const webpack = require('webpack')
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`

// console.log('IS_PROD', isProd);
// console.log('IS_DEV', isDev);
// console.log('mode', mode);

module.exports = {
	context: path.resolve(__dirname, 'src'),

	mode: 'development',

	// entry: ['@babel/polyfill', './index.js'],
	entry: {
        main: path.resolve(__dirname, './src/index.js'),
	},
	
	output: {
		filename: filename('js'),
		path: path.resolve(__dirname, 'dist')
	},

	resolve: {
		extensions: ['.js'],
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@core': path.resolve(__dirname, 'src/core')
		}
	},

	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: 'index.html',
			minify: {
				removeComments: isProd,
				collapseWhitespace: isProd
			}
		}),
		new CopyPlugin({
			patterns: [
				{ 
				  	from: path.resolve(__dirname, 'src/favicon.ico'), 
					to: path.resolve(__dirname, 'dist/favicon.ico') 
				}
			],
		}),
		new MiniCssExtractPlugin({
			filename: filename('css')
		}),
		new webpack.HotModuleReplacementPlugin()
	],

	module: {
		rules: [
			// loader for scss->css
			{
			  test: /\.s[ac]ss$/i,
			  use: [
				{
					loader: MiniCssExtractPlugin.loader,
					options: {},
				},
				// MiniCssExtractPlugin.loader,
				"css-loader",
				"sass-loader",
			  ],
			},
			// loader babel transpiller
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		  ],
	},

	devtool: isDev? 'source-map' : false,

	devServer: {
		contentBase: path.resolve(__dirname, './dist'),
		port: 8080,
		hot: true,
		// open: true
	}
	
}
