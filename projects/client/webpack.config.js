const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: './src/index.tsx',
    mode: process.env.NODE_ENV || 'development',
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/i,
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: ['file-loader']
            },
            {
                test: /\.svg$/,
                loader: 'react-svg-loader'
            }
        ]
    },
    resolve: { extensions: ['*', '.js', '.jsx', '.ts', '.tsx'] },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'bundle.js'
    },
    devServer: {
        historyApiFallback: true,
        port: 3000,
        hotOnly: true
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Registrum'
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
}
