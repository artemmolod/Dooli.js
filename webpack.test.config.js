const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "production",

    entry: {
        core: path.join(__dirname, "test.js"),
    },

    output: {
        path: __dirname,
        filename: "[name].js",
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                },
            },
            {
                test: /\.css$/,
                use: [{
                    loader: "style-loader",
                }, {
                    loader: "css-loader",
                }, {
                    loader: "sass-loader",
                }],
            }
        ]
    },
};
