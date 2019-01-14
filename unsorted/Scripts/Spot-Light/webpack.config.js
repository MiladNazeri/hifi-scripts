var path = require('path');
var appPath = path.join(__dirname, 'js');

module.exports = {
  module: {
      output: {
      path: path.join(__dirname, 'dist')
    },
    rules: [
      {
        test: /\.coffee$/,
        use: [
          {
            loader: 'coffee-loader',
            options: {
              transpile: {
                presets: ['env']
              }
            }
          }
        ]
      }
    ]
  }
}
