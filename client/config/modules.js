/*
 * File: /config/modules.js
 * File Created: Wednesday, 11th December 2019 11:06:22 pm
 * Author: Alex Chomiak
 *
 * Last Modified: Thursday, 12th December 2019 3:36:32 am
 * Modified By: Alex Chomiak 
 *
 * Author Github: https://github.com/alexchomiak
 */

module.exports = {
    rules: [
        {
            loader: 'babel-loader',
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\.s[ac]ss$/i,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'sass-loader',
                    options: {
                        sassOptions: { includePaths: ['src/styles/*'] }
                    }
                }
            ]
        },
        {
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: [
                'file-loader',
                {
                    loader: 'image-webpack-loader'
                }
            ]
        }
    ]
}
