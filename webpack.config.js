const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  watch: true,
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};