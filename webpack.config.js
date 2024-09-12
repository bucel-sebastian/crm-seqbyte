const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js', // Punctul de intrare
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Pentru fisiere .js si .jsx
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/, // Pentru fisiere CSS
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new Dotenv() // Incărcarea variabilelor de mediu
  ],
  devServer: {
    static: './dist',
    hot: true
  },
  resolve: {
    extensions: ['.js', '.jsx'] // Pentru a nu specifica extensia la importuri
  },
  mode: 'development' // Poți schimba în production la final
};
