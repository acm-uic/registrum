import * as path from 'path'
import { Configuration as WebpackConfiguration, HotModuleReplacementPlugin, DefinePlugin } from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { InjectManifest } from 'workbox-webpack-plugin'
import WebpackPwaManifest from 'webpack-pwa-manifest'
import GitRevisionPlugin from 'git-revision-webpack-plugin'

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration
}

const gitRevisionPlugin = new GitRevisionPlugin({ branch: true })
const gcm_sender_id = '565395438650'
const webPushPublic = process.env.WEB_PUSH_PUBLIC
const webPushPrivate = process.env.WEB_PUSH_PRIVATE

const config: Configuration = {
    entry: './src/index.tsx',
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
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
        hotOnly: true,
        proxy: {
            '/api': 'http://localhost:4000/'
        }
    },
    devtool: 'inline-source-map',
    plugins: [
        new CleanWebpackPlugin(),
        gitRevisionPlugin,
        new DefinePlugin({
            'VERSION': JSON.stringify(gitRevisionPlugin.version()),
            'COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
            'BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
            'WEB_PUSH_PUBLIC': webPushPublic,
            'WEB_PUSH_PRIVATE': webPushPrivate
        }),
        new HtmlWebpackPlugin({
            title: 'Registrum',
            favicon: 'src/images/favicon.ico'
        }),
        new WebpackPwaManifest({
            short_name: 'Registrum',
            name: 'Registrum: Class Tracker',
            description: 'Registrum Class Tracker',
            lang: 'en-US',
            start_url: '.',
            display: 'fullscreen',
            theme_color: '#d90000',
            background_color: '#ffffff',
            gcm_sender_id,
            crossorigin: 'use-credentials',
            icons: [
                {
                    src: path.resolve('src/images/logo.png'),
                    sizes: [120, 152, 167, 180, 1024],
                    destination: path.join('icons', 'ios'),
                    ios: true
                },
                {
                    src: path.resolve('src/images/logo.png'),
                    size: 1024,
                    destination: path.join('icons', 'ios'),
                    ios: 'startup'
                },
                {
                    src: path.resolve('src/images/logo.png'),
                    sizes: [36, 48, 72, 96, 144, 192, 512],
                    destination: path.join('icons', 'android')
                }
            ]
        } as any),
        new InjectManifest({
            swSrc: './src/sw.ts',
            swDest: 'sw.js',
            maximumFileSizeToCacheInBytes: 100 * 1024 * 1024
        }),
        new HotModuleReplacementPlugin()
    ]
}

export default config
