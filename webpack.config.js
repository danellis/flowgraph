module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: "./src/nodes.ts",
    output: {
        filename: "bundle.js"
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },
    devServer: {
        publicPath: '/assets/'
    }
};
