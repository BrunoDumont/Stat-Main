const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest')
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    target: 'web',
    entry: path.join(__dirname, 'src', 'index.tsx'),
    output: {
        path: path.join(__dirname, "/dist"),
        publicPath: '/',
        filename: "[name].bundle.js",
        clean: true
    },
    resolve: {
        plugins: [new TsconfigPathsPlugin()],
        extensions: ['.ts', '.tsx', '.js', '.gql', '.graphql']
    },
    devtool: 'eval-cheap-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 3000,
        historyApiFallback: true,
        hot: true,
        open: true
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript",
                        ]
                    }
                }
            },
            {
                test: /\.(s*)css$/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                    "postcss-loader"
                ]
            },

            {
                test: /\.gql$/,
                exclude: /node_modules/,
                loader: 'graphql-tag/loader'
            },
            {
                test: /\.svg/,
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {},
                    },
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/public/index.html",
            favicon: "./src/public/images/favicon.ico",
            title: 'OPTIMA',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }

        }),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true
        }),
        new WebpackPwaManifest({
            name: 'OPTIMA',
            short_name: 'OPTIMA',
            description: 'OPTIMA',
            theme_color: "#e0bb87",
            background_color: "#42a3e2",
            display: "standalone",
            icons: [
                {
                    src: path.join(__dirname, 'src/public/images', 'logo-small.svg'),
                    sizes: [96, 128, 192, 256, 384, 512]
                },
            ]
        }),
        new CopyPlugin({
            patterns: [
                { from: "src/public/js", to: "js" },
            ],
        }),
    ]
};