var path = require('path'),
    webpack = require('webpack');

module.exports = {
    context: __dirname,
    entry: [
        "underscore",
        "backbone",
        "./js/index"
    ],
    output: {
        filename: "bundle.js"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                cacheDirectory: true,
                presets: ['es2015', 'react']
            }
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};