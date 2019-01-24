"use strict";

const _config = require("./helpers/config.js");

const PORS = require("@babel/plugin-proposal-object-rest-spread");
const TFC = require("babel-plugin-transform-flow-comments");

const FlowBabelWebpackPlugin = require("flow-babel-webpack-plugin");

module.exports = {
	entry: {
		main: `${_config.path.src.js}/main.js`
	},

	output: {
		path: _config.path.dist.js,
		filename: `[name].js`
	},

	resolve: {
		extensions: [".js"]
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				include: _config.path.src.js,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
						plugins: [
							PORS,
							TFC,
							require("@babel/plugin-proposal-class-properties")
						]
					}
				}
			},

			{
				test: /\.json$/,
				loader: "json"
			}
		]
	},

	plugins: [new FlowBabelWebpackPlugin()]
};
