const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  plugins: [new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src', 'template', 'index.html')
  })],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: path.join('static', 'images', '[name][ext][query]')
        }
      }
    ]
  },
  output: {
    filename: path.join('static', 'js', 'main.js') ,
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    compress: true,
    port: 9000,
    hot: true,
    watchFiles: [path.resolve(__dirname, 'src')],
    devMiddleware: {
      writeToDisk: true
    }
  }
};
