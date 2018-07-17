module.exports = {
  entry: {
    blocks: './src/gutenberg-blocks/blocks.js',
  },
  output: {
    path: __dirname + '/build/gutenberg/',
    filename: '[name].build.js',
  },

  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [ 'react' ]
            }
          },
        ],
        exclude: [
          /node_modules/,
        ],
      }
    ],
  }
};
