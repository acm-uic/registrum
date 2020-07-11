import * as path from 'path'
import { Configuration as WebpackConfiguration, EnvironmentPlugin } from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import CopyPlugin from 'copy-webpack-plugin'

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration
}

const config: Configuration = {
    entry: { bundle: './src/index.tsx', serviceWorker: './src/serviceWorker.ts' },
    mode:
        process.env.NODE_ENV === 'production'
            ? 'production'
            : process.env.NODE_ENV === 'none'
            ? 'none'
            : 'development',
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
        filename: '[name].js'
    },
    devServer: {
        host: 'localhost',
        historyApiFallback: true,
        port: 3000,
        proxy: {
            '/api': 'http://localhost:4000/'
        }
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'public/'), to: path.resolve(__dirname, 'dist/') }
            ]
        }),
        new EnvironmentPlugin({
            NODE_ENV: 'development',
            API_BASE_PATH: '/api',
            WEBPUSHPUBLIC: ''
        })
    ]
}
// [
//     {
//         from: 'public',
//         to: path.resolve(__dirname, 'dist'),
//         ignore: ['index.html']
//     }
// ]

export default config
