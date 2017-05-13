module.exports = {
	devtool: 'eval-source-map',

    entry: __dirname + "/app/main.js",
    output: {
		path: __dirname + "/public",
		filename: "bundle.js",
    },

    module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'   //感叹号的作用在于使同一文件能够使用不同类型的loader
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            },
            {
                test: /\.(png|jpg)$/,
                loader: "url-loader"
            }
		]
    }
}
