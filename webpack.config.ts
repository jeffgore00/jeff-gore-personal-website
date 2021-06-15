/* eslint-disable @typescript-eslint/no-unsafe-call, import/no-extraneous-dependencies */

import path from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CompressionPlugin from 'compression-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { DefinePlugin, Configuration as WebpackConfig } from 'webpack';
import { Configuration as WebpackDevServerConfig } from 'webpack-dev-server';
import createStyledComponentsTransformer from 'typescript-plugin-styled-components';
import { Application } from 'express';
import morgan from 'morgan';

import { sendHtmlForEnabledRoutes } from './src/server/utils/runtime/send-html-for-enabled-routes';
import { sendResourceNotFound } from './src/server/middleware/send-resource-not-found';

interface Config extends WebpackConfig, WebpackDevServerConfig {}

const styledComponentsTransformer = createStyledComponentsTransformer();

const createReactScriptHtmlWebpackConfig = () => {
  if (process.env.BUILD_OFFLINE) {
    return {
      reactScript: '',
      reactDomScript: '',
    };
  }
  const createReactScriptTags = (environment: string) => ({
    reactScript: `<script crossorigin src="https://unpkg.com/react@17/umd/react.${environment}.js"></script>`,
    reactDomScript: `<script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.${environment}.js"></script>`,
  });

  if (process.env.NODE_ENV === 'development') {
    return createReactScriptTags('development');
  }
  return createReactScriptTags('production.min');
};

const getMode = () => {
  if (process.env.NODE_ENV === 'development') return 'development';
  return 'production';
};

const config: Config = {
  mode: getMode(),
  devtool: 'source-map',
  devServer: {
    compress: true,
    port: 8080,
    contentBase: 'public',
    before(app: Application) {
      app.use(morgan('dev'));
      sendHtmlForEnabledRoutes(app, path.join(__dirname, './public'));
    },
    after(app: Application) {
      app.use(sendResourceNotFound);
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  entry: './src/client',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '', // default is '/auto', which we don't want
  },
  module: {
    rules: [
      {
        test(modulePath: string) {
          return (
            (modulePath.endsWith('.ts') || modulePath.endsWith('.tsx')) &&
            !(modulePath.endsWith('test.ts') || modulePath.endsWith('test.tsx'))
          );
        },
        include: [
          path.resolve(__dirname, 'src/client'),
          path.resolve(__dirname, 'src/shared'),
          path.resolve(__dirname, 'test-utils'),
        ],
        loader: 'ts-loader',
        options: {
          /* Separate config file needed because ts-loader will ignore the `include` above and will
          obey the default .tsconfig, which includes server files and test files:
          See https://github.com/TypeStrong/ts-loader/issues/544#issuecomment-316856503 */
          configFile: 'tsconfig.client.json',
          getCustomTransformers: () => ({
            before: [styledComponentsTransformer],
          }),
        },
      },
      // All output '.js' files will have any sourcemaps pre-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },

  /* From the TypeScript boilerplate repo webpack config:
  "When importing a module whose path matches one of the following, just assume a corresponding
  global variable exists and use that instead. This is important because it allows us to avoid
  bundling all of our dependencies, which allows browsers to cache those libraries between builds."
  */
  ...(!process.env.BUILD_OFFLINE && {
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  }),
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-size-report.html',
      openAnalyzer: false,
    }),
    new CompressionPlugin({ include: /.*bundle.js/ }),
    new HtmlWebpackPlugin({
      ...createReactScriptHtmlWebpackConfig(),
      template: 'public/index-template.html',
    }),
    new DefinePlugin({
      appEnvironment: process.env.PRODLIKE
        ? // This extra stringification is necessary or this plugin would convert the string name to a global variable.
          JSON.stringify('prodlike')
        : JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};

module.exports = config;
