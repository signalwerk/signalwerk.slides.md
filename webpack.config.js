import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

import webpack from "webpack";

/*-------------------------------------------------*/
// import bufferPoly from "buffer/";

import postcss from "postcss";
import postcssImport from "postcss-import";
import postcssCalc from "postcss-calc";
import postcssNested from "postcss-nested";
import postcssPresetEnv from "postcss-preset-env";
import postcssMqPacker from "css-mqpacker"; // Pack same CSS media query rules into one using PostCSS
import postcssSimpleVars from "postcss-simple-vars";
import postcssMixins from "postcss-mixins";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
// import postConditionals from "postcss-conditionals";

/*-------------------------------------------------*/

// import mdProcessor from "./src/webpack/md-processor.js";

/*-------------------------------------------------*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/*-------------------------------------------------*/

const isProduction = process.env.NODE_ENV === "production";

let rootPath = __dirname;

// if (process.env.AS_PACKAGE) {
//   rootPath = resolve(__dirname, "../../");
// }

const settings = {
  // webpack optimization mode
  mode: process.env.NODE_ENV ? process.env.NODE_ENV : "development",

  // resolve: {
  //   // configuration options
  //   buffer: bufferPoly,
  // },

  // entry file(s)
  entry: {
    base: [resolve(rootPath, "./src/styles.css")],
    index: [resolve(rootPath, "./src/index.js")],
    "image-player": [resolve(rootPath, "./src/image-player.js")], // Add this line
  },

  // output file(s) and chunks
  output: {
    path: resolve(rootPath, "dist"),
    // filename: "index.js",
    publicPath: "/",
  },

  module: {
    rules: [
      {
        test: /\.(jpg|jpeg|png|woff|otf|woff2|eot|ttf|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.(js|jsx|tsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: isProduction ? false : true,
            },
          },

          // Add PostCSS
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  postcssImport({
                    // root: resolve(__dirname, "./Resources/Private"),
                  }),
                  postcssMixins(),
                  postcssSimpleVars({
                    onVariables(variables) {
                      // console.log("CSS Variables");
                      // console.log(JSON.stringify(variables, null, 2));
                    },
                  }),

                  postcssCalc(),
                  postcssPresetEnv({
                    stage: 0,
                    browsers: ["last 2 versions", "IE > 10"],
                  }),
                  // postConditionals(),
                  postcssNested(),
                  postcssMqPacker(),
                ],
              },

              // Enable sourcemaps in development
              sourceMap: isProduction ? false : true,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "./[name].css",
      chunkFilename: "./[id].css",
    }),

    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    // new mdProcessor({
    //   // filePath: "./content",
    //   // exportPath: "./dist/",
    //   // isEncodeName: false, // if need to encode file name, like chinese
    //   // template: "./public/index.html",
    // }),
  ],

  // development server configuration
  devServer: {
    port: 9001,
    allowedHosts: "all",
    static: ["public", "content", "dist"],
    // open: true,
  },
};

export default settings;
