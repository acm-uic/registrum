import * as path from 'path'
import * as webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'

import * as tsconfig from './tsconfig.json'

function tsConfigPathsToAliases({ webpackConfigBasePath = __dirname } = {}) {
    if (!tsconfig.compilerOptions.paths) return {}

    const paths: { [key: string]: string[] } = tsconfig.compilerOptions.paths

    const aliases: { [key: string]: string } = {}

    Object.keys(paths).forEach(item => {
        const key = item.replace('/*', '')
        const value = path.resolve(
            webpackConfigBasePath,
            paths[item][0].replace('/*', '').replace('*', '')
        )

        aliases[key] = value
    })

    return aliases
}

const config: webpack.Configuration = {
    entry: {
        bundle: './src/index',
        serviceWorker: './src/serviceWorker'
    },
    output: {
        path: path.join(__dirname, '/dist'),
        filename: '[name].js'
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: tsConfigPathsToAliases()
    },
    devServer: {
        proxy: {
            '/api': 'http://localhost:4000'
        },
        historyApiFallback: true,
        stats: {
            children: false,
            maxModules: 0
        },
        before: app => {
            app.use(require('morgan')('tiny'))
        }
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpe?g|svg|gif)?$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new CopyPlugin([
            {
                from: 'public',
                to: path.resolve(__dirname, 'dist'),
                ignore: ['index.html']
            }
        ]),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html')
        })
    ]
}

export default config
