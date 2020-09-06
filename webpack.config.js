const path = require('path');
module.exports = {
  entry: './public/index.js',
  mode: 'development',
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'bundle.js',
  },
};
console.log(__dirname);
