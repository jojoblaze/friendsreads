
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
const CopyPlugin = require('copy-webpack-plugin');

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: './src/server.js',
    target: 'node',
    output: {
        filename: 'server.js',
        path: path.join(__dirname, 'dist/api'),
    },
    module: {
        rules: [
            // {
            //     test: /\.tsx?$/,
            //     loader: 'ts-loader',
            //     exclude: /node_modules/,
            // },
        ]
    },
    resolve: {
        extensions: [
            // ".tsx", 
            // ".ts", 
            ".js"
        ]
    },
    node: {
        fs: "empty"
    },
    externals: nodeModules,
    plugins: [
        new CopyPlugin([
            { from: 'Dockerfile', to: '../' }
        ]),
    ]
};