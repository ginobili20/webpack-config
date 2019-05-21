const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const devConfig = require('./webpack.dev.js');
const prodConfig = require('./webpack.prod.js');

const commonConfig = {
    entry: {
        main: './src/js/index.js',
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader'
            }]
        }, {
            test: /\.(jpg|png|gif)$/,
            use: {
                loader: 'url-loader',
                options: {
                    name: '[name]_[hash].[ext]',
                    outputPath: 'images/',
                    limit: 10240
                }
            }
        }, {
            test: /\.(eot|ttf|svg)$/,
            use: {
                loader: 'file-loader'
            }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new CleanWebpackPlugin()
    ],
    optimization: {
        usedExports: true,
        splitChunks: {
            chunks: 'all'
        }
    },
    performance: false,
    output: {
        path: path.resolve(__dirname, '../dist')
    },
    resolve: {
        extensions: ['.js'],
        alias: {}
    }
}

module.exports = (env) => {
    if(env && env.production) {
        return merge(commonConfig, prodConfig);
    }else {
        return merge(commonConfig, devConfig);
    }
}

