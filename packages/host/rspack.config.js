const path = require("node:path");
const { HtmlRspackPlugin } = require("@rspack/core");
const {
  container: { ModuleFederationPluginV1, ContainerPlugin },
} = require("@rspack/core");
const resolve = require("enhanced-resolve");

const workingDir = process.cwd();
const outDir = path.resolve(workingDir, "dist");
const ASSET_PATH = process.env.ASSET_PATH || "/";

const RUNTIME = "runtime";

module.exports = {
  entry: {
    main: {
      import: "./src/async-entry",
      runtime: RUNTIME,
    },
  },
  mode: "development",
  devtool: false,
  resolve: {
    extensions: [".jsx", ".js", ".json", ".mjs"],
  },
  optimization: {
    minimize: false,
  },
  output: {
    path: outDir,
    publicPath: ASSET_PATH,
    filename: "[name]-[contenthash].js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "ecmascript",
                jsx: true,
              },
            },
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.md$/,
        type: "asset/source",
      },
    ],
  },
  plugins: [
    new ContainerPlugin({
      name: "@mf/bundled-one",
      library: {
        type: "var",
        name: "bundledOne",
      },
      filename: `remoteEntry-bundledOne.js`,
      runtime: RUNTIME,
      shareScope: undefined,
      exposes: {
        ".": resolve.sync(__dirname, "@mf/bundled-one"),
      },
    }),
    new ContainerPlugin({
      name: "@mf/bundled-two",
      library: {
        type: "var",
        name: "bundledTwo",
      },
      filename: `remoteEntry-bundledTwo.js`,
      runtime: RUNTIME,
      shareScope: undefined,
      exposes: {
        ".": resolve.sync(__dirname, "@mf/bundled-two"),
      },
    }),

    new ModuleFederationPluginV1({
      name: "host",
      filename: "remoteEntry.js",
      remotes: {
        "@mf/bundled-one": "bundledOne@http://localhost/remoteEntry-bundledOne.js",
        "@mf/bundled-two": "bundledTwo@http://localhost/remoteEntry-bundledTwo.js",
      },
      shared: {
        react: {
          singleton: true,
        },
        "react-dom": {
          singleton: true,
        },
      },
    }),
    new HtmlRspackPlugin({
      template: "./public/index.ejs",
      chunks: ["main"],
    }),
  ],
};
